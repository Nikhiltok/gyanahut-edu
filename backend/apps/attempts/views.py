from django.db.models import OuterRef, Q, Subquery
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.core.responses import error_response, success_response
from apps.questions.models import DifficultMark
from apps.questions.serializers import QuestionSerializer

from .models import StudentAnswer, TestAttempt
from .serializers import TestAttemptResultSerializer, TestAttemptSummarySerializer


class MyAttemptsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        attempts = (
            TestAttempt.objects.filter(student=request.user, submitted_at__isnull=False)
            .select_related("test", "test__exam")
            .order_by("-submitted_at")
        )
        type_param = request.query_params.get("type")
        if type_param == "practice":
            attempts = attempts.filter(test__test_type="PRACTICE", test__created_by__role="STUDENT")
        elif type_param == "mock":
            attempts = attempts.exclude(test__test_type="PRACTICE", test__created_by__role="STUDENT")
        return success_response(TestAttemptSummarySerializer(attempts, many=True).data)


class ResultDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, attempt_id):
        try:
            attempt = TestAttempt.objects.select_related("test").get(id=attempt_id)
        except TestAttempt.DoesNotExist:
            return error_response("Result not found", status=404)

        is_owner = attempt.student_id == request.user.id
        is_admin = request.user.role in ("ADMIN", "SUPER_ADMIN")
        if not (is_owner or is_admin):
            return error_response("You do not have access to this result", status=403)

        if not attempt.submitted_at:
            return error_response("This attempt has not been submitted yet", status=400)

        return success_response(TestAttemptResultSerializer(attempt).data)


class WrongQuestionsView(APIView):
    """Questions whose most recent answer from this student was wrong.

    A question later answered correctly in a subsequent attempt is excluded —
    only the student's most recent answer per question determines inclusion.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        latest_answer_id = (
            StudentAnswer.objects.filter(question=OuterRef("question"), attempt__student=request.user)
            .order_by("-created_at")
            .values("id")[:1]
        )
        wrong_answers = (
            StudentAnswer.objects.filter(attempt__student=request.user, is_correct=False)
            .filter(id=Subquery(latest_answer_id))
            .select_related("question", "question__topic")
            .order_by("-created_at")
        )
        questions = [answer.question for answer in wrong_answers]
        return success_response(QuestionSerializer(questions, many=True, context={"request": request}).data)


class DifficultQuestionsView(APIView):
    """Union of two sources: questions the student got wrong/skipped that are
    admin-tagged HARD, and questions the student explicitly one-click flagged
    as difficult themselves (DifficultMark) — regardless of their own
    difficulty tag or whether the student answered correctly."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        answers = (
            StudentAnswer.objects.filter(
                attempt__student=request.user, question__difficulty="HARD"
            )
            .filter(Q(is_correct=False) | Q(selected_option__isnull=True))
            .select_related("question", "question__topic")
            .order_by("-created_at")
        )
        seen = set()
        questions = []
        for answer in answers:
            if answer.question_id in seen:
                continue
            seen.add(answer.question_id)
            questions.append(answer.question)

        marks = (
            DifficultMark.objects.filter(student=request.user)
            .select_related("question", "question__topic")
            .order_by("-created_at")
        )
        for mark in marks:
            if mark.question_id in seen:
                continue
            seen.add(mark.question_id)
            questions.append(mark.question)

        return success_response(QuestionSerializer(questions, many=True, context={"request": request}).data)
