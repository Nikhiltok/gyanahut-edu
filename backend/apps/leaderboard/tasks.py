from celery import shared_task
from django.db.models import Avg, Count, Sum

from apps.attempts.models import TestAttempt
from apps.exams.models import Exam

from .models import Leaderboard


@shared_task
def update_leaderboard_for_exam(exam_id):
    exam = Exam.objects.filter(id=exam_id).first()
    if not exam:
        return

    stats = (
        TestAttempt.objects.filter(test__exam_id=exam_id, submitted_at__isnull=False)
        .values("student_id")
        .annotate(total_score=Sum("score"), total_attempt=Count("id"), avg_accuracy=Avg("accuracy"))
    )

    entries = []
    for row in stats:
        entry, _ = Leaderboard.objects.update_or_create(
            student_id=row["student_id"],
            exam=exam,
            defaults={
                "total_score": row["total_score"] or 0,
                "total_attempt": row["total_attempt"] or 0,
                "accuracy": round(row["avg_accuracy"] or 0, 2),
            },
        )
        entries.append(entry)

    ranked = sorted(entries, key=lambda e: e.total_score, reverse=True)
    for index, entry in enumerate(ranked, start=1):
        entry.rank = index
    if ranked:
        Leaderboard.objects.bulk_update(ranked, ["rank"])
