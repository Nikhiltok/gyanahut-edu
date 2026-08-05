from django.contrib import admin

from .models import Chapter, Exam, ExamCategory, Subject, Topic


@admin.register(ExamCategory)
class ExamCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "status", "is_active")
    list_filter = ("status", "is_active")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "exam_type", "status", "is_active")
    list_filter = ("category", "exam_type", "status")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ("name", "exam", "order", "is_active")
    list_filter = ("exam",)
    search_fields = ("name",)


@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ("name", "subject", "order", "is_active")
    list_filter = ("subject__exam", "subject")
    search_fields = ("name",)


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ("name", "chapter", "order", "is_active")
    list_filter = ("chapter__subject", "chapter")
    search_fields = ("name",)
