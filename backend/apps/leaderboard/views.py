from datetime import timedelta

from django.db.models import Avg, Count, Sum
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.attempts.models import TestAttempt
from apps.core.responses import success_response
from apps.core.utils import get_exam_ids_filter

from .models import Leaderboard
from .serializers import LeaderboardSerializer

PERIOD_DAYS = {"weekly": 7, "monthly": 30}


def compute_period_ranking(queryset, period):
    if period in PERIOD_DAYS:
        since = timezone.now() - timedelta(days=PERIOD_DAYS[period])
        queryset = queryset.filter(submitted_at__gte=since)

    stats = (
        queryset.values("student_id", "student__first_name", "student__last_name")
        .annotate(total_score=Sum("score"), total_attempt=Count("id"), accuracy=Avg("accuracy"))
        .order_by("-total_score")
    )

    results = []
    for index, row in enumerate(stats, start=1):
        name = f"{row['student__first_name']} {row['student__last_name']}".strip()
        results.append(
            {
                "student": str(row["student_id"]),
                "name": name,
                "rank": index,
                "total_score": float(row["total_score"] or 0),
                "total_attempt": row["total_attempt"],
                "accuracy": round(row["accuracy"] or 0, 2),
            }
        )
    return results


class GlobalLeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        period = request.query_params.get("period")
        queryset = TestAttempt.objects.filter(submitted_at__isnull=False)
        exam_ids = get_exam_ids_filter(request)
        if exam_ids:
            queryset = queryset.filter(test__exam_id__in=exam_ids)
        return success_response(compute_period_ranking(queryset, period))


class ExamLeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, exam_id):
        period = request.query_params.get("period")

        if period in PERIOD_DAYS:
            queryset = TestAttempt.objects.filter(test__exam_id=exam_id, submitted_at__isnull=False)
            return success_response(compute_period_ranking(queryset, period))

        entries = Leaderboard.objects.filter(exam_id=exam_id).select_related("student").order_by("rank")
        return success_response(LeaderboardSerializer(entries, many=True).data)
