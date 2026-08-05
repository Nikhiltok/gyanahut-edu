from rest_framework import serializers

from .models import Leaderboard


class LeaderboardSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="student.get_full_name", read_only=True)
    exam_name = serializers.CharField(source="exam.name", read_only=True)

    class Meta:
        model = Leaderboard
        fields = ("id", "student", "name", "exam", "exam_name", "total_score", "total_attempt", "accuracy", "rank")
