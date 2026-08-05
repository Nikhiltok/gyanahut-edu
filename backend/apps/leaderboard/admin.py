from django.contrib import admin

from .models import Leaderboard


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ("student", "exam", "total_score", "total_attempt", "accuracy", "rank")
    list_filter = ("exam",)
    search_fields = ("student__email",)
    ordering = ("rank",)
