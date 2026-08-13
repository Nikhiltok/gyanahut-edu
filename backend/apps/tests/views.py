import random
from datetime import timedelta

from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from apps.attempts.models import StudentAnswer, TestAttempt
from apps.core.permissions import IsAdminOrSuperAdmin
from apps.core.responses import error_response, success_response
from apps.core.utils import get_exam_ids_filter
from apps.core.viewsets import AdminModelViewSet
from apps.exams.models import Chapter, Exam, Subject, Topic
from apps.questions.models import Question, QuestionOption
from apps.questions.serializers import QuestionPublicSerializer

from .models import Test, TestQuestion
from .serializers import (
    AdminTestSerializer,
    TestAttemptAdminSerializer,
    TestQuestionAttachSerializer,
    TestQuestionSerializer,
    TestSerializer,
)


def _compute_is_correct(question, option_id):
    if not option_id:
        return False
    return QuestionOption.objects.filter(id=option_id, question=question, is_correct=True).exists()


def finalize_attempt(attempt):
    """Score an attempt from whatever StudentAnswer rows it already has and mark
    it submitted. Shared by an explicit SubmitTestView call and by StartTestView's
    expiry-triggered auto-submit, so scoring logic lives in exactly one place."""
    test = attempt.test
    total_questions = test.test_questions.count()
    rows = list(attempt.answers.select_related("question"))
    correct = sum(1 for r in rows if r.is_correct)
    wrong = sum(1 for r in rows if r.selected_option_id and not r.is_correct)
    skipped = max(total_questions - correct - wrong, 0)

    score = 0
    for r in rows:
        if not r.selected_option_id:
            continue
        if r.is_correct:
            score += float(r.question.marks)
        elif test.negative_marking:
            penalty = r.question.negative_marks or test.negative_marks
            score -= float(penalty)

    attempted = correct + wrong
    accuracy = (correct / attempted * 100) if attempted else 0

    attempt.submitted_at = timezone.now()
    attempt.score = score
    attempt.correct_answers = correct
    attempt.wrong_answers = wrong
    attempt.skipped_answers = skipped
    attempt.accuracy = round(accuracy, 2)
    attempt.time_taken = int((attempt.submitted_at - attempt.started_at).total_seconds())
    attempt.save()

    from apps.leaderboard.tasks import update_leaderboard_for_exam

    update_leaderboard_for_exam.delay(str(test.exam_id))
    return attempt


def attempt_deadline(attempt):
    return attempt.started_at + timedelta(minutes=attempt.test.duration)


def is_expired(attempt):
    return timezone.now() > attempt_deadline(attempt)

# Tests a student generates for themselves (see GeneratePracticeTestView) are
# excluded from the shared admin-scheduled listings below — they're personal,
# on-demand sessions, not content the admin scheduled for everyone.
SELF_PRACTICE_FILTER = {"test_type": Test.TestType.PRACTICE, "created_by__role": "STUDENT"}


class TestAdminViewSet(AdminModelViewSet, ModelViewSet):
    queryset = Test.objects.all().exclude(**SELF_PRACTICE_FILTER).select_related("exam", "subject", "chapter", "topic")
    serializer_class = AdminTestSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        exam = self.request.query_params.get("exam")
        subject = self.request.query_params.get("subject")
        chapter = self.request.query_params.get("chapter")
        topic = self.request.query_params.get("topic")
        status_param = self.request.query_params.get("status")
        if exam:
            queryset = queryset.filter(exam_id=exam)
        if subject:
            queryset = queryset.filter(subject_id=subject)
        if chapter:
            queryset = queryset.filter(chapter_id=chapter)
        if topic:
            queryset = queryset.filter(topic_id=topic)
        if status_param:
            queryset = queryset.filter(status=status_param.upper())
        return queryset

    @action(detail=True, methods=["post"])
    def publish(self, request, pk=None):
        test = self.get_object()
        if test.start_time and test.start_time > timezone.now():
            # Scheduled for the future — goes live automatically at start_time
            # (see apps.tests.tasks.activate_scheduled_tests, run every minute by Celery beat).
            test.status = Test.Status.SCHEDULED
            message = "Test scheduled — it will go live automatically at its start time"
        else:
            test.status = Test.Status.LIVE
            message = "Test published"
        test.save(update_fields=["status"])
        return success_response(TestSerializer(test).data, message)

    @action(detail=True, methods=["patch"])
    def archive(self, request, pk=None):
        test = self.get_object()
        test.status = Test.Status.ARCHIVED
        test.save(update_fields=["status"])
        return success_response(TestSerializer(test).data, "Test archived")

    def _reject_if_attempted(self, test):
        if TestAttempt.objects.filter(test=test, submitted_at__isnull=False).exists():
            return error_response(
                "This test's question set is locked because at least one student has already attempted it.",
                status=400,
            )
        return None

    @action(detail=True, methods=["get", "post"], url_path="questions")
    def attach_questions(self, request, pk=None):
        test = self.get_object()

        if request.method == "GET":
            return success_response(
                TestQuestionSerializer(
                    test.test_questions.select_related("question").prefetch_related("question__options").order_by("order"),
                    many=True,
                ).data
            )

        locked_response = self._reject_if_attempted(test)
        if locked_response:
            return locked_response

        serializer = TestQuestionAttachSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Validation error", serializer.errors)

        question_ids = serializer.validated_data["question_ids"]
        existing = set(test.test_questions.values_list("question_id", flat=True))
        start_order = test.test_questions.count()
        created = []
        for offset, question_id in enumerate(question_ids):
            if question_id in existing or not Question.objects.filter(id=question_id).exists():
                continue
            created.append(TestQuestion(test=test, question_id=question_id, order=start_order + offset))
        TestQuestion.objects.bulk_create(created)
        test.total_questions = test.test_questions.count()
        test.save(update_fields=["total_questions"])
        return success_response(
            TestQuestionSerializer(test.test_questions.order_by("order"), many=True).data,
            "Questions attached",
        )

    @action(detail=True, methods=["delete"], url_path="questions/(?P<question_id>[^/.]+)")
    def remove_question(self, request, pk=None, question_id=None):
        test = self.get_object()
        locked_response = self._reject_if_attempted(test)
        if locked_response:
            return locked_response

        deleted, _ = TestQuestion.objects.filter(test=test, question_id=question_id).delete()
        if not deleted:
            return error_response("Question not attached to this test", status=404)

        test.total_questions = test.test_questions.count()
        test.save(update_fields=["total_questions"])
        return success_response(
            TestQuestionSerializer(test.test_questions.order_by("order"), many=True).data,
            "Question removed",
        )

    @action(detail=True, methods=["post"], url_path="auto-attach")
    def auto_attach_questions(self, request, pk=None):
        """Pull questions in from the test's scope (topic, chapter, subject, or
        the whole exam if none is set) — the manual /questions/ action still
        works for hand-picking on top of this.

        Optional body params:
        - difficulty: EASY | MEDIUM | HARD — restricts the pool before selecting.
        - count: how many to attach. If omitted, attaches every matching question;
          if given, that many are chosen at random with no duplicates.
        """
        test = self.get_object()
        locked_response = self._reject_if_attempted(test)
        if locked_response:
            return locked_response

        if test.topic_id:
            scoped_questions = Question.objects.filter(topic_id=test.topic_id)
        elif test.chapter_id:
            scoped_questions = Question.objects.filter(topic__chapter_id=test.chapter_id)
        elif test.subject_id:
            scoped_questions = Question.objects.filter(topic__chapter__subject_id=test.subject_id)
        else:
            scoped_questions = Question.objects.filter(topic__chapter__subject__exam_id=test.exam_id)

        difficulty = request.data.get("difficulty")
        if difficulty:
            difficulty = str(difficulty).upper()
            if difficulty not in Question.Difficulty.values:
                return error_response("Validation error", {"difficulty": ["Invalid difficulty."]})
            scoped_questions = scoped_questions.filter(difficulty=difficulty)

        existing = set(test.test_questions.values_list("question_id", flat=True))
        available_ids = list(scoped_questions.exclude(id__in=existing).values_list("id", flat=True))

        count = request.data.get("count")
        if count is not None:
            try:
                count = int(count)
            except (TypeError, ValueError):
                return error_response("Validation error", {"count": ["count must be an integer."]})
            if count < 1:
                return error_response("Validation error", {"count": ["count must be at least 1."]})
            random.shuffle(available_ids)
            selected_ids = available_ids[:count]
        else:
            selected_ids = available_ids

        start_order = test.test_questions.count()
        created = [
            TestQuestion(test=test, question_id=question_id, order=start_order + offset)
            for offset, question_id in enumerate(selected_ids)
        ]
        TestQuestion.objects.bulk_create(created)
        test.total_questions = test.test_questions.count()
        test.save(update_fields=["total_questions"])
        return success_response(
            TestQuestionSerializer(test.test_questions.all(), many=True).data,
            f"{len(created)} question(s) auto-attached from scope",
        )

    @action(detail=True, methods=["get"])
    def attempts(self, request, pk=None):
        """List every student who has attempted this test, with their score."""
        test = self.get_object()
        attempts = (
            TestAttempt.objects.filter(test=test, submitted_at__isnull=False)
            .select_related("student")
            .order_by("-score", "-submitted_at")
        )
        return success_response(TestAttemptAdminSerializer(attempts, many=True).data)


class UpcomingTestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tests = Test.objects.filter(status=Test.Status.SCHEDULED, start_time__gt=timezone.now()).exclude(
            **SELF_PRACTICE_FILTER
        )
        exam_ids = get_exam_ids_filter(request)
        if exam_ids:
            tests = tests.filter(exam_id__in=exam_ids)
        return success_response(TestSerializer(tests, many=True, context={"request": request}).data)


class LiveTestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tests = Test.objects.filter(status=Test.Status.LIVE).exclude(**SELF_PRACTICE_FILTER)
        exam_ids = get_exam_ids_filter(request)
        if exam_ids:
            tests = tests.filter(exam_id__in=exam_ids)
        return success_response(TestSerializer(tests, many=True, context={"request": request}).data)


class TestDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            test = Test.objects.get(pk=pk)
        except Test.DoesNotExist:
            return error_response("Test not found", status=404)
        return success_response(TestSerializer(test, context={"request": request}).data)


class GeneratePracticeTestSerializer(serializers.Serializer):
    exam = serializers.PrimaryKeyRelatedField(queryset=Exam.objects.all())
    subject = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all(), required=False, allow_null=True)
    chapter = serializers.PrimaryKeyRelatedField(queryset=Chapter.objects.all(), required=False, allow_null=True)
    topic = serializers.PrimaryKeyRelatedField(queryset=Topic.objects.all(), required=False, allow_null=True)
    question_count = serializers.IntegerField(min_value=1, max_value=300)
    duration = serializers.IntegerField(min_value=1, max_value=300)

    def validate(self, attrs):
        exam = attrs["exam"]
        subject = attrs.get("subject")
        chapter = attrs.get("chapter")
        topic = attrs.get("topic")

        if topic and chapter and topic.chapter_id != chapter.id:
            raise serializers.ValidationError({"topic": "Topic does not belong to the selected chapter."})
        if topic and not chapter and topic.chapter.subject.exam_id != exam.id:
            raise serializers.ValidationError({"topic": "Topic does not belong to the selected exam."})
        if chapter and chapter.subject.exam_id != exam.id:
            raise serializers.ValidationError({"chapter": "Chapter does not belong to the selected exam."})
        if chapter and subject and chapter.subject_id != subject.id:
            raise serializers.ValidationError({"chapter": "Chapter does not belong to the selected subject."})
        if subject and not chapter and subject.exam_id != exam.id:
            raise serializers.ValidationError({"subject": "Subject does not belong to the selected exam."})

        return attrs


class GeneratePracticeTestView(APIView):
    """Lets a student build their own on-demand practice test — pick a scope
    (topic/chapter/subject, or the whole exam), how many questions, and how
    long. Unlike admin-scheduled tests, this is private to the student who
    generated it (see SELF_PRACTICE_FILTER) and goes LIVE immediately."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GeneratePracticeTestSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Validation error", serializer.errors)

        data = serializer.validated_data
        exam = data["exam"]
        subject = data.get("subject")
        chapter = data.get("chapter")
        topic = data.get("topic")

        if topic:
            scoped_questions = Question.objects.filter(topic_id=topic.id)
            scope_name = topic.name
        elif chapter:
            scoped_questions = Question.objects.filter(topic__chapter_id=chapter.id)
            scope_name = chapter.name
        elif subject:
            scoped_questions = Question.objects.filter(topic__chapter__subject_id=subject.id)
            scope_name = subject.name
        else:
            scoped_questions = Question.objects.filter(topic__chapter__subject__exam_id=exam.id)
            scope_name = exam.name

        available_ids = list(scoped_questions.values_list("id", flat=True))
        if not available_ids:
            return error_response("No questions are available for this selection yet.", status=400)

        random.shuffle(available_ids)
        selected_ids = available_ids[: data["question_count"]]

        # Credit gating (Phase 7 — Credit Wallet & Payments). Self-practice is
        # priced by actual question count (not the requested count, which may
        # get truncated above by availability) — debited/free-quota-consumed
        # here, before the Test row exists, so a failed payment never leaves
        # an orphaned practice test behind.
        from apps.payments.models import CreditTransaction, PlatformSettings, Wallet

        cost = len(selected_ids)
        platform_settings = PlatformSettings.get_solo()
        now = timezone.now()
        free_used_this_month = CreditTransaction.objects.filter(
            wallet__student=request.user,
            source=CreditTransaction.Source.FREE_PRACTICE,
            created_at__year=now.year,
            created_at__month=now.month,
        ).count()
        qualifies_free = (
            free_used_this_month < platform_settings.free_practice_attempts_per_month
            and cost <= platform_settings.free_practice_max_questions
        )

        Wallet.objects.get_or_create(student=request.user)
        with transaction.atomic():
            wallet = Wallet.objects.select_for_update().get(student=request.user)
            if qualifies_free:
                CreditTransaction.objects.create(
                    wallet=wallet,
                    type=CreditTransaction.Type.CREDIT,
                    source=CreditTransaction.Source.FREE_PRACTICE,
                    amount=0,
                    balance_after=wallet.balance,
                )
            else:
                if wallet.balance < cost:
                    return Response(
                        {
                            "success": False,
                            "message": "Insufficient credits",
                            "errors": {
                                "code": "insufficient_credits",
                                "required": cost,
                                "available": wallet.balance,
                                "shortfall": cost - wallet.balance,
                            },
                        },
                        status=402,
                    )
                wallet.balance -= cost
                wallet.save(update_fields=["balance"])
                CreditTransaction.objects.create(
                    wallet=wallet,
                    type=CreditTransaction.Type.DEBIT,
                    source=CreditTransaction.Source.SELF_PRACTICE,
                    amount=cost,
                    balance_after=wallet.balance,
                )

            test = Test.objects.create(
                exam=exam,
                subject=subject,
                chapter=chapter,
                topic=topic,
                title=f"Practice — {scope_name}",
                test_type=Test.TestType.PRACTICE,
                duration=data["duration"],
                total_questions=len(selected_ids),
                max_attempts=1,
                negative_marking=False,
                status=Test.Status.LIVE,
                created_by=request.user,
            )
            TestQuestion.objects.bulk_create(
                [TestQuestion(test=test, question_id=qid, order=i) for i, qid in enumerate(selected_ids)]
            )

        return success_response(
            TestSerializer(test, context={"request": request}).data,
            "Practice test generated",
            status=201,
        )


class StartTestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            test = Test.objects.get(pk=pk)
        except Test.DoesNotExist:
            return error_response("Test not found", status=404)

        if test.status != Test.Status.LIVE:
            return error_response("This test is not currently live", status=400)

        existing = (
            TestAttempt.objects.filter(student=request.user, test=test, submitted_at__isnull=True, is_active=True)
            .select_related("test")
            .first()
        )

        # Credit gating for paid admin-scheduled tests (Phase 7). Only charged once,
        # on first start — resuming an already-started attempt (existing, above) skips
        # this block entirely so a resumed attempt is never debited a second time.
        if test.is_paid and not existing:
            from apps.payments.models import CreditTransaction, Wallet

            cost = test.credit_cost or 0
            Wallet.objects.get_or_create(student=request.user)
            with transaction.atomic():
                wallet = Wallet.objects.select_for_update().get(student=request.user)
                if wallet.balance < cost:
                    return Response(
                        {
                            "success": False,
                            "message": "Insufficient credits",
                            "errors": {
                                "code": "insufficient_credits",
                                "required": cost,
                                "available": wallet.balance,
                                "shortfall": cost - wallet.balance,
                            },
                        },
                        status=402,
                    )
                wallet.balance -= cost
                wallet.save(update_fields=["balance"])
                CreditTransaction.objects.create(
                    wallet=wallet,
                    type=CreditTransaction.Type.DEBIT,
                    source=CreditTransaction.Source.TEST_ATTEMPT,
                    amount=cost,
                    test=test,
                    balance_after=wallet.balance,
                )

        if existing:
            if is_expired(existing):
                finalize_attempt(existing)
                return success_response(
                    {
                        "attempt_id": str(existing.id),
                        "expired": True,
                        "score": float(existing.score),
                        "correct": existing.correct_answers,
                        "wrong": existing.wrong_answers,
                        "skipped": existing.skipped_answers,
                        "accuracy": float(existing.accuracy),
                    },
                    "This attempt's time expired and has been submitted automatically",
                )

            questions = (
                Question.objects.filter(test_questions__test=test).order_by("test_questions__order").distinct()
            )
            answers_map = {
                str(a.question_id): str(a.selected_option_id)
                for a in existing.answers.filter(selected_option__isnull=False)
            }
            remaining = max(0, int((attempt_deadline(existing) - timezone.now()).total_seconds()))
            return success_response(
                {
                    "attempt_id": str(existing.id),
                    "resumed": True,
                    "current_question_index": existing.current_question_index,
                    "remaining_seconds": remaining,
                    "answers": answers_map,
                    "questions": QuestionPublicSerializer(questions, many=True).data,
                },
                "Resuming your in-progress attempt",
            )

        # Abandoned (never-submitted) attempts no longer count against max_attempts —
        # only completed ones do, since an abandoned attempt is now resumable above.
        attempts_used = TestAttempt.objects.filter(
            student=request.user, test=test, submitted_at__isnull=False, is_active=True
        ).count()
        if attempts_used >= test.max_attempts:
            return error_response("Maximum attempts reached for this test", status=400)

        attempt = TestAttempt.objects.create(student=request.user, test=test)
        questions = Question.objects.filter(test_questions__test=test).order_by("test_questions__order").distinct()
        return success_response(
            {
                "attempt_id": str(attempt.id),
                "resumed": False,
                "current_question_index": 0,
                "remaining_seconds": test.duration * 60,
                "answers": {},
                "questions": QuestionPublicSerializer(questions, many=True).data,
            },
            "Test started",
        )


class SaveProgressSerializer(serializers.Serializer):
    question = serializers.UUIDField()
    option = serializers.UUIDField(required=False, allow_null=True)
    current_question_index = serializers.IntegerField(min_value=0)


class SaveProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk, attempt_id):
        serializer = SaveProgressSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Validation error", serializer.errors)

        try:
            attempt = TestAttempt.objects.select_related("test").get(
                id=attempt_id, student=request.user, test_id=pk, is_active=True
            )
        except TestAttempt.DoesNotExist:
            return error_response("Attempt not found", status=404)

        if attempt.submitted_at:
            return error_response("This attempt has already been submitted", status=400)

        if is_expired(attempt):
            finalize_attempt(attempt)
            return success_response({"expired": True, "attempt_id": str(attempt.id)}, "Attempt time expired")

        data = serializer.validated_data
        try:
            question = Question.objects.get(id=data["question"])
        except Question.DoesNotExist:
            return error_response("Question not found", status=404)

        option_id = data.get("option")
        is_correct = _compute_is_correct(question, option_id)
        StudentAnswer.objects.update_or_create(
            attempt=attempt,
            question=question,
            defaults={"selected_option_id": option_id, "is_correct": is_correct},
        )
        attempt.current_question_index = data["current_question_index"]
        attempt.save()

        return success_response({"saved": True}, "Progress saved")


class SubmitAnswerSerializer(serializers.Serializer):
    question = serializers.UUIDField()
    option = serializers.UUIDField(required=False, allow_null=True)


class SubmitTestSerializer(serializers.Serializer):
    attempt_id = serializers.UUIDField()
    answers = SubmitAnswerSerializer(many=True)


class SubmitTestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        serializer = SubmitTestSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Validation error", serializer.errors)

        try:
            attempt = TestAttempt.objects.select_related("test").get(
                id=serializer.validated_data["attempt_id"], student=request.user, test_id=pk
            )
        except TestAttempt.DoesNotExist:
            return error_response("Attempt not found", status=404)

        if attempt.submitted_at:
            return error_response("This attempt has already been submitted", status=400)

        # update_or_create (not bulk_create) because autosave via SaveProgressView may
        # already have written some of these StudentAnswer rows — a raw bulk_create would
        # crash on the (attempt, question) unique constraint. The submit payload is always
        # authoritative and simply overwrites whatever autosave had stored.
        with transaction.atomic():
            for answer in serializer.validated_data["answers"]:
                question_id = answer["question"]
                option_id = answer.get("option")
                try:
                    question = Question.objects.get(id=question_id)
                except Question.DoesNotExist:
                    continue

                is_correct = _compute_is_correct(question, option_id)
                StudentAnswer.objects.update_or_create(
                    attempt=attempt,
                    question=question,
                    defaults={"selected_option_id": option_id, "is_correct": is_correct},
                )

        finalize_attempt(attempt)

        return success_response(
            {
                "score": float(attempt.score),
                "correct": attempt.correct_answers,
                "wrong": attempt.wrong_answers,
                "skipped": attempt.skipped_answers,
                "accuracy": float(attempt.accuracy),
                "attempt_id": str(attempt.id),
            },
            "Test submitted",
        )
