from rest_framework import serializers

from apps.attempts.models import TestAttempt
from apps.questions.serializers import QuestionOptionSerializer

from .models import Test, TestQuestion


class TestSerializer(serializers.ModelSerializer):
    exam_name = serializers.CharField(source="exam.name", read_only=True)
    subject_name = serializers.CharField(source="subject.name", read_only=True, default=None)
    chapter_name = serializers.CharField(source="chapter.name", read_only=True, default=None)
    topic_name = serializers.CharField(source="topic.name", read_only=True, default=None)
    question_count = serializers.SerializerMethodField()
    attempts_used = serializers.SerializerMethodField()
    total_attempts_count = serializers.SerializerMethodField()

    class Meta:
        model = Test
        fields = (
            "id", "exam", "exam_name", "subject", "subject_name", "chapter", "chapter_name",
            "topic", "topic_name", "title", "test_type", "duration", "total_questions",
            "total_marks", "negative_marking", "negative_marks", "start_time", "end_time",
            "max_attempts", "status", "is_paid", "credit_cost",
            "question_count", "attempts_used", "total_attempts_count", "created_at",
        )
        read_only_fields = ("id", "created_at")

    def get_question_count(self, obj):
        return obj.test_questions.count()

    def get_attempts_used(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return 0
        return TestAttempt.objects.filter(student=request.user, test=obj).count()

    def get_total_attempts_count(self, obj):
        # Across every student — once this is non-zero, the question set is
        # locked (see TestAdminViewSet.attach_questions/auto_attach_questions)
        # so a later edit can't invalidate attempts already submitted.
        return TestAttempt.objects.filter(test=obj, submitted_at__isnull=False).count()

    def validate(self, attrs):
        exam = attrs.get("exam", getattr(self.instance, "exam", None))
        subject = attrs.get("subject", getattr(self.instance, "subject", None))
        chapter = attrs.get("chapter", getattr(self.instance, "chapter", None))
        topic = attrs.get("topic", getattr(self.instance, "topic", None))

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

        is_paid = attrs.get("is_paid", getattr(self.instance, "is_paid", False))
        credit_cost = attrs.get("credit_cost", getattr(self.instance, "credit_cost", None))
        if is_paid and not credit_cost:
            raise serializers.ValidationError({"credit_cost": "Credit cost is required when the test is paid."})

        return attrs

    def create(self, validated_data):
        validated_data["created_by"] = self.context["request"].user
        return super().create(validated_data)


class AdminTestSerializer(TestSerializer):
    """Used only by TestAdminViewSet (the scheduler). Same as TestSerializer
    except the scheduler cannot create/update a test as PRACTICE — that type
    is reserved for student self-practice (GeneratePracticeTestView), which
    builds Test rows directly and never goes through this serializer."""

    test_type = serializers.ChoiceField(choices=[c for c in Test.TestType.choices if c[0] != Test.TestType.PRACTICE])


class TestQuestionAttachSerializer(serializers.Serializer):
    question_ids = serializers.ListField(child=serializers.UUIDField(), allow_empty=False)


class TestQuestionSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source="question.question_text", read_only=True)
    explanation = serializers.CharField(source="question.explanation", read_only=True)
    options = QuestionOptionSerializer(source="question.options", many=True, read_only=True)

    class Meta:
        model = TestQuestion
        fields = ("id", "question", "question_text", "explanation", "options", "order")


class TestAttemptAdminSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.get_full_name", read_only=True)
    student_email = serializers.CharField(source="student.email", read_only=True)

    class Meta:
        model = TestAttempt
        fields = (
            "id", "student", "student_name", "student_email", "score", "correct_answers",
            "wrong_answers", "skipped_answers", "accuracy", "time_taken", "started_at", "submitted_at",
        )
