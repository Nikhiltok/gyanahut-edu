from django.contrib import admin

from .models import Bookmark, ImportHistory, Question, QuestionOption


class QuestionOptionInline(admin.TabularInline):
    model = QuestionOption
    extra = 4


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("__str__", "topic", "question_type", "difficulty", "marks", "negative_marks", "is_active")
    list_filter = ("difficulty", "question_type", "topic__chapter__subject__exam")
    search_fields = ("question_text",)
    inlines = [QuestionOptionInline]


@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ("student", "question", "created_at")
    search_fields = ("student__email",)


@admin.register(ImportHistory)
class ImportHistoryAdmin(admin.ModelAdmin):
    list_display = ("file_name", "file_format", "total", "success", "failed", "status", "created_at")
    list_filter = ("status", "file_format")
