from django.urls import path

from .views import ExamLeaderboardView, GlobalLeaderboardView

urlpatterns = [
    path("leaderboard/global/", GlobalLeaderboardView.as_view(), name="leaderboard-global"),
    path("leaderboard/exam/<uuid:exam_id>/", ExamLeaderboardView.as_view(), name="leaderboard-exam"),
]
