from django.contrib import admin

from .models import StudentAnswer, TestAttempt


class StudentAnswerInline(admin.TabularInline):
    model = StudentAnswer
    extra = 0


@admin.register(TestAttempt)
class TestAttemptAdmin(admin.ModelAdmin):
    list_display = (
        "student", "test", "score", "correct_answers", "wrong_answers", "skipped_answers", "accuracy", "submitted_at",
    )
    list_filter = ("test",)
    search_fields = ("student__email",)
    inlines = [StudentAnswerInline]
