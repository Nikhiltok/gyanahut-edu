from decimal import Decimal

from rest_framework import serializers

from .models import StudentAnswer, TestAttempt


class StudentAnswerResultSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source="question.question_text", read_only=True)
    subject_name = serializers.CharField(source="question.topic.chapter.subject.name", read_only=True)
    question_type_display = serializers.CharField(source="question.get_question_type_display", read_only=True)
    explanation = serializers.CharField(source="question.explanation", read_only=True)
    marks = serializers.DecimalField(source="question.marks", max_digits=6, decimal_places=2, read_only=True)
    negative_marks = serializers.SerializerMethodField()
    selected_option_text = serializers.CharField(source="selected_option.option_text", read_only=True, default=None)
    correct_option_text = serializers.SerializerMethodField()

    class Meta:
        model = StudentAnswer
        fields = (
            "id", "question", "question_text", "subject_name", "question_type_display", "explanation", "marks",
            "negative_marks", "selected_option", "selected_option_text", "correct_option_text", "is_correct",
            "time_taken",
        )

    def get_negative_marks(self, obj):
        test = obj.attempt.test
        if not test.negative_marking:
            return "0.00"
        # A question can carry its own negative_marks override (e.g. a mixed-scheme
        # previous-year paper); otherwise fall back to the test's flat penalty.
        return str(obj.question.negative_marks or test.negative_marks)

    def get_correct_option_text(self, obj):
        correct = obj.question.options.filter(is_correct=True).first()
        return correct.option_text if correct else None


class TestAttemptResultSerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source="test.title", read_only=True)
    exam_name = serializers.CharField(source="test.exam.name", read_only=True)
    total_marks = serializers.SerializerMethodField()
    rank = serializers.SerializerMethodField()
    total_candidates = serializers.SerializerMethodField()
    avg_time_taken = serializers.SerializerMethodField()
    subject_breakdown = serializers.SerializerMethodField()
    answers = serializers.SerializerMethodField()

    class Meta:
        model = TestAttempt
        fields = (
            "id", "test", "test_title", "exam_name", "score", "total_marks", "correct_answers", "wrong_answers",
            "skipped_answers", "accuracy", "time_taken", "started_at", "submitted_at",
            "rank", "total_candidates", "avg_time_taken", "subject_breakdown", "answers",
        )

    def get_total_marks(self, obj):
        total = sum(
            (answer.question.marks for answer in obj.answers.select_related("question")), start=Decimal("0")
        )
        return str(total)

    def get_rank(self, obj):
        from apps.leaderboard.models import Leaderboard

        entry = Leaderboard.objects.filter(student=obj.student, exam=obj.test.exam).first()
        return entry.rank if entry else None

    def get_total_candidates(self, obj):
        from apps.leaderboard.models import Leaderboard

        return Leaderboard.objects.filter(exam=obj.test.exam).count()

    def get_avg_time_taken(self, obj):
        from django.db.models import Avg

        other_attempts = TestAttempt.objects.filter(test=obj.test, submitted_at__isnull=False).exclude(id=obj.id)
        avg = other_attempts.aggregate(avg=Avg("time_taken"))["avg"]
        return round(avg) if avg else None

    def get_subject_breakdown(self, obj):
        breakdown = {}
        for answer in obj.answers.select_related("question__topic__chapter__subject"):
            subject_name = answer.question.topic.chapter.subject.name
            bucket = breakdown.setdefault(subject_name, {"correct": 0, "wrong": 0, "total": 0})
            bucket["total"] += 1
            if answer.is_correct:
                bucket["correct"] += 1
            elif answer.selected_option_id:
                bucket["wrong"] += 1
        return [{"subject": name, **stats} for name, stats in breakdown.items()]

    def get_answers(self, obj):
        answers = obj.answers.select_related(
            "question", "question__topic__chapter__subject", "selected_option"
        ).prefetch_related("question__options")
        return StudentAnswerResultSerializer(answers, many=True).data


class TestAttemptSummarySerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source="test.title", read_only=True)
    exam_name = serializers.CharField(source="test.exam.name", read_only=True)

    class Meta:
        model = TestAttempt
        fields = (
            "id", "test", "test_title", "exam_name", "score", "correct_answers", "wrong_answers",
            "skipped_answers", "accuracy", "time_taken", "started_at", "submitted_at",
        )
