from datetime import timedelta

from django.db.models import Avg, Count, Sum
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.attempts.models import StudentAnswer, TestAttempt
from apps.core.permissions import IsAdminOrSuperAdmin
from apps.core.responses import success_response
from apps.payments.models import Order
from apps.questions.models import Question
from apps.tests.models import Test
from apps.users.models import User

MIN_ANSWERS_FOR_TOPIC_SIGNAL = 3
GROWTH_WINDOW_DAYS = 30


class StudentDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        attempts = TestAttempt.objects.filter(student=request.user, submitted_at__isnull=False)
        aggregate = attempts.aggregate(avg_score=Avg("score"), avg_accuracy=Avg("accuracy"))

        topic_accuracy = {}
        for row in (
            StudentAnswer.objects.filter(attempt__student=request.user)
            .select_related("question__topic")
            .values("question__topic__name", "is_correct")
        ):
            name = row["question__topic__name"]
            bucket = topic_accuracy.setdefault(name, {"total": 0, "correct": 0})
            bucket["total"] += 1
            if row["is_correct"]:
                bucket["correct"] += 1

        topics_with_signal = [
            {"topic": name, "accuracy": round(b["correct"] / b["total"] * 100, 2)}
            for name, b in topic_accuracy.items()
            if b["total"] >= MIN_ANSWERS_FOR_TOPIC_SIGNAL
        ]
        topics_with_signal.sort(key=lambda t: t["accuracy"])

        weak_topics = [t["topic"] for t in topics_with_signal if t["accuracy"] < 50][:5]
        strong_topics = [t["topic"] for t in reversed(topics_with_signal) if t["accuracy"] >= 75][:5]

        submitted_dates = set(attempts.annotate(day=TruncDate("submitted_at")).values_list("day", flat=True))
        today = timezone.now().date()
        # If today has no attempt yet, the streak is still "alive" until the day ends —
        # start counting from yesterday instead of showing a premature 0.
        cursor = today if today in submitted_dates else today - timedelta(days=1)
        day_streak = 0
        while cursor in submitted_dates:
            day_streak += 1
            cursor -= timedelta(days=1)

        in_progress = (
            TestAttempt.objects.filter(student=request.user, submitted_at__isnull=True, is_active=True)
            .select_related("test", "test__exam")
            .order_by("-updated_at")
            .first()
        )
        in_progress_attempt = (
            {
                "attempt_id": str(in_progress.id),
                "test_id": str(in_progress.test_id),
                "test_title": in_progress.test.title,
                "exam_name": in_progress.test.exam.name,
                "current_question_index": in_progress.current_question_index,
                "total_questions": in_progress.test.total_questions,
                "last_seen": in_progress.updated_at.isoformat(),
            }
            if in_progress
            else None
        )

        return success_response(
            {
                "tests_attempted": attempts.count(),
                "average_score": round(aggregate["avg_score"] or 0, 2),
                "accuracy": round(aggregate["avg_accuracy"] or 0, 2),
                "weak_topics": weak_topics,
                "strong_topics": strong_topics,
                "day_streak": day_streak,
                "in_progress_attempt": in_progress_attempt,
            }
        )


class PerformanceGraphView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        attempts = (
            TestAttempt.objects.filter(student=request.user, submitted_at__isnull=False)
            .order_by("submitted_at")
            .values("submitted_at", "score", "accuracy")
        )
        return success_response(
            [
                {
                    "date": a["submitted_at"].isoformat(),
                    "score": float(a["score"]),
                    "accuracy": float(a["accuracy"]),
                }
                for a in attempts
            ]
        )


class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdminOrSuperAdmin]

    def get(self, request):
        total_revenue = Order.objects.filter(status=Order.Status.PAID).aggregate(total=Sum("amount"))["total"] or 0

        return success_response(
            {
                "students": User.objects.filter(role=User.Role.STUDENT).count(),
                "tests": Test.objects.count(),
                "questions": Question.objects.count(),
                "live_tests": Test.objects.filter(status=Test.Status.LIVE).count(),
                "revenue": float(total_revenue),
            }
        )


class AdminGrowthChartView(APIView):
    permission_classes = [IsAdminOrSuperAdmin]

    def get(self, request):
        since = timezone.now() - timedelta(days=GROWTH_WINDOW_DAYS)
        rows = (
            User.objects.filter(role=User.Role.STUDENT, created_at__gte=since)
            .annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(count=Count("id"))
            .order_by("day")
        )
        return success_response([{"date": r["day"].isoformat(), "count": r["count"]} for r in rows])


class AdminAttemptsChartView(APIView):
    permission_classes = [IsAdminOrSuperAdmin]

    def get(self, request):
        since = timezone.now() - timedelta(days=GROWTH_WINDOW_DAYS)
        rows = (
            TestAttempt.objects.filter(started_at__gte=since)
            .annotate(day=TruncDate("started_at"))
            .values("day")
            .annotate(count=Count("id"))
            .order_by("day")
        )
        return success_response([{"date": r["day"].isoformat(), "count": r["count"]} for r in rows])


class AdminPerformanceChartView(APIView):
    permission_classes = [IsAdminOrSuperAdmin]

    def get(self, request):
        since = timezone.now() - timedelta(days=GROWTH_WINDOW_DAYS)
        rows = (
            TestAttempt.objects.filter(submitted_at__gte=since)
            .annotate(day=TruncDate("submitted_at"))
            .values("day")
            .annotate(avg_score=Avg("score"), avg_accuracy=Avg("accuracy"))
            .order_by("day")
        )
        return success_response(
            [
                {
                    "date": r["day"].isoformat(),
                    "average_score": round(r["avg_score"] or 0, 2),
                    "average_accuracy": round(r["avg_accuracy"] or 0, 2),
                }
                for r in rows
            ]
        )
