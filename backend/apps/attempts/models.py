from django.conf import settings
from django.db import models

from apps.core.models import BaseModel
from apps.questions.models import Question, QuestionOption
from apps.tests.models import Test


class TestAttempt(BaseModel):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="test_attempts", db_index=True
    )
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name="attempts")
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    score = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    correct_answers = models.PositiveIntegerField(default=0)
    wrong_answers = models.PositiveIntegerField(default=0)
    skipped_answers = models.PositiveIntegerField(default=0)
    accuracy = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    time_taken = models.PositiveIntegerField(default=0, help_text="Time taken in seconds")
    current_question_index = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "test_attempt"

    def __str__(self):
        return f"{self.student_id} - {self.test.title}"


class StudentAnswer(BaseModel):
    attempt = models.ForeignKey(TestAttempt, on_delete=models.CASCADE, related_name="answers")
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="student_answers")
    selected_option = models.ForeignKey(
        QuestionOption, on_delete=models.SET_NULL, null=True, blank=True, related_name="selected_in_answers"
    )
    is_correct = models.BooleanField(default=False)
    time_taken = models.PositiveIntegerField(default=0, help_text="Time taken in seconds")

    class Meta:
        db_table = "student_answer"
        unique_together = ("attempt", "question")

    def __str__(self):
        return f"{self.attempt_id} - {self.question_id}"
