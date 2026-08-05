from django.conf import settings
from django.db import models

from apps.core.models import BaseModel
from apps.exams.models import Chapter, Exam, Subject, Topic
from apps.questions.models import Question


class Test(BaseModel):
    class TestType(models.TextChoices):
        PRACTICE = "PRACTICE", "Practice"
        MOCK = "MOCK", "Mock"
        LIVE = "LIVE", "Live"
        PREVIOUS_YEAR = "PREVIOUS_YEAR", "Previous Year"

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        SCHEDULED = "SCHEDULED", "Scheduled"
        LIVE = "LIVE", "Live"
        COMPLETED = "COMPLETED", "Completed"
        ARCHIVED = "ARCHIVED", "Archived"

    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="tests")
    # Optional narrower scope within the exam — a test can be scheduled for the
    # whole exam, a single subject, a single chapter, or a single topic. Leaving
    # all three blank means the test spans the full exam.
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True, related_name="tests")
    chapter = models.ForeignKey(Chapter, on_delete=models.SET_NULL, null=True, blank=True, related_name="tests")
    topic = models.ForeignKey(Topic, on_delete=models.SET_NULL, null=True, blank=True, related_name="tests")
    title = models.CharField(max_length=200)
    test_type = models.CharField(max_length=20, choices=TestType.choices, default=TestType.PRACTICE)
    duration = models.PositiveIntegerField(help_text="Duration in minutes")
    total_questions = models.PositiveIntegerField(default=0)
    total_marks = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    negative_marking = models.BooleanField(default=False)
    negative_marks = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    start_time = models.DateTimeField(null=True, blank=True, db_index=True)
    end_time = models.DateTimeField(null=True, blank=True)
    max_attempts = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="tests_created"
    )

    # Pricing (Phase 7 — Credit Wallet & Payments). Only meaningful for
    # admin-scheduled tests (MOCK/LIVE/PREVIOUS_YEAR) — self-practice tests
    # (test_type=PRACTICE, created_by.role=STUDENT) are priced by a fixed
    # question-count formula instead, handled in GeneratePracticeTestView.
    is_paid = models.BooleanField(default=False)
    credit_cost = models.PositiveIntegerField(
        null=True, blank=True, help_text="Admin-set credit cost, required when is_paid=True"
    )

    class Meta:
        db_table = "test"

    def __str__(self):
        return self.title


class TestQuestion(BaseModel):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name="test_questions")
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="test_questions")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "test_question"
        ordering = ["order"]
        unique_together = ("test", "question")

    def __str__(self):
        return f"{self.test.title} - Q{self.order}"
