from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import StudentProfile, User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    ordering = ("email",)
    list_display = ("email", "phone", "first_name", "last_name", "role", "is_staff", "is_active")
    list_filter = ("role", "is_staff", "is_active")
    search_fields = ("email", "phone", "first_name", "last_name")
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "phone", "profile_image", "state", "city")}),
        ("Role & permissions", {
            "fields": ("role", "is_active", "is_staff", "is_superuser", "groups", "user_permissions"),
        }),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "phone", "role", "password1", "password2"),
        }),
    )


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "gender", "education", "is_active")
    list_filter = ("gender",)
    search_fields = ("user__email", "user__first_name", "user__last_name")
    filter_horizontal = ("target_exams",)
