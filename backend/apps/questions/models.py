from django.conf import settings
from django.db import models

from apps.core.models import BaseModel
from apps.exams.models import Topic


class Question(BaseModel):
    class QuestionType(models.TextChoices):
        MCQ = "MCQ", "MCQ"
        TRUE_FALSE = "TRUE_FALSE", "True/False"
        MULTIPLE_CHOICE = "MULTIPLE_CHOICE", "Multiple Choice"
        IMAGE_BASED = "IMAGE_BASED", "Image Based"

    class Difficulty(models.TextChoices):
        EASY = "EASY", "Easy"
        MEDIUM = "MEDIUM", "Medium"
        HARD = "HARD", "Hard"

    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name="questions", db_index=True)
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QuestionType.choices, default=QuestionType.MCQ)
    difficulty = models.CharField(max_length=10, choices=Difficulty.choices, default=Difficulty.MEDIUM, db_index=True)
    explanation = models.TextField(blank=True, default="")
    marks = models.DecimalField(max_digits=6, decimal_places=2, default=1)
    negative_marks = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    image = models.ImageField(upload_to="question_images/", blank=True, null=True)
    language = models.CharField(max_length=30, default="en")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="questions_created"
    )

    class Meta:
        db_table = "question"

    def __str__(self):
        return self.question_text[:80]


class QuestionOption(BaseModel):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="options")
    option_text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "question_option"
        ordering = ["order"]

    def __str__(self):
        return f"{self.question_id} - {self.option_text[:40]}"


class Bookmark(BaseModel):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookmarks"
    )
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="bookmarked_by")

    class Meta:
        db_table = "bookmark"
        unique_together = ("student", "question")

    def __str__(self):
        return f"{self.student_id} bookmarked {self.question_id}"


class DifficultMark(BaseModel):
    """A student's own one-click 'this was hard for me' flag on a question —
    independent of the admin-set Question.difficulty, and independent of
    whether they answered it right or wrong."""

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="difficult_marks"
    )
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="marked_difficult_by")

    class Meta:
        db_table = "difficult_mark"
        unique_together = ("student", "question")

    def __str__(self):
        return f"{self.student_id} marked {self.question_id} as difficult"


class AIGenerationJob(BaseModel):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        RUNNING = "RUNNING", "Running"
        COMPLETED = "COMPLETED", "Completed"
        FAILED = "FAILED", "Failed"
        STOPPED = "STOPPED", "Stopped"

    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name="ai_generation_jobs")
    requested_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    difficulty = models.CharField(
        max_length=10, choices=Question.Difficulty.choices, default=Question.Difficulty.MEDIUM
    )
    target_count = models.PositiveIntegerField(default=10)
    generated_count = models.PositiveIntegerField(default=0)
    duplicate_count = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)
    # Polled by the running Celery task between batches so an admin can stop a
    # long generation run early without needing hard task revocation.
    stop_requested = models.BooleanField(default=False)
    error_message = models.TextField(blank=True, default="")

    class Meta:
        db_table = "ai_generation_job"
        ordering = ["-created_at"]

    def __str__(self):
        return f"AI job for {self.topic_id} ({self.generated_count}/{self.target_count})"


class ImportHistory(BaseModel):
    class Status(models.TextChoices):
        COMPLETED = "COMPLETED", "Completed"
        FAILED = "FAILED", "Failed"

    file_name = models.CharField(max_length=255)
    file_format = models.CharField(max_length=10)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    total = models.PositiveIntegerField(default=0)
    success = models.PositiveIntegerField(default=0)
    failed = models.PositiveIntegerField(default=0)
    errors = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.COMPLETED)

    class Meta:
        db_table = "question_import_history"
        ordering = ["-created_at"]
        verbose_name_plural = "Import histories"

    def __str__(self):
        return f"{self.file_name} ({self.success}/{self.total})"
