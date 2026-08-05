from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from apps.core.models import BaseModel

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin, BaseModel):
    class Role(models.TextChoices):
        SUPER_ADMIN = "SUPER_ADMIN", "Super Admin"
        ADMIN = "ADMIN", "Admin"
        STUDENT = "STUDENT", "Student"

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True, default="", db_index=True)
    first_name = models.CharField(max_length=150, blank=True, default="")
    last_name = models.CharField(max_length=150, blank=True, default="")
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.STUDENT)
    profile_image = models.ImageField(upload_to="profile_images/", blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, default="")
    city = models.CharField(max_length=100, blank=True, default="")
    is_staff = models.BooleanField(default=False)
    phone_verified = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        db_table = "users_user"

    def __str__(self):
        return self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.email

    def get_short_name(self):
        return self.first_name or self.email


class StudentProfile(BaseModel):
    class Gender(models.TextChoices):
        MALE = "MALE", "Male"
        FEMALE = "FEMALE", "Female"
        OTHER = "OTHER", "Other"

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="student_profile")
    target_exams = models.ManyToManyField("exams.Exam", blank=True, related_name="target_students")
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=Gender.choices, blank=True, default="")
    education = models.CharField(max_length=150, blank=True, default="")

    class Meta:
        db_table = "student_profile"

    def __str__(self):
        return f"Profile<{self.user.email}>"
