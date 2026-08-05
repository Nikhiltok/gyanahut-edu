from django.contrib import admin

from .models import Test, TestQuestion


class TestQuestionInline(admin.TabularInline):
    model = TestQuestion
    extra = 1


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = (
        "title", "exam", "test_type", "status", "start_time", "is_paid", "credit_cost", "max_attempts",
    )
    list_filter = ("test_type", "status", "is_paid", "exam")
    search_fields = ("title",)
    inlines = [TestQuestionInline]
