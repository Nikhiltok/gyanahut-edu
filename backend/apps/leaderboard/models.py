from django.conf import settings
from django.db import models

from apps.core.models import BaseModel
from apps.exams.models import Exam


class Leaderboard(BaseModel):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="leaderboard_entries"
    )
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="leaderboard_entries")
    total_score = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_attempt = models.PositiveIntegerField(default=0)
    accuracy = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    rank = models.PositiveIntegerField(null=True, blank=True, db_index=True)

    class Meta:
        db_table = "leaderboard"
        unique_together = ("student", "exam")
        ordering = ["rank"]

    def __str__(self):
        return f"{self.student_id} - {self.exam.name} (#{self.rank})"
