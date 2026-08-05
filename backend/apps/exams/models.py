from django.db import models

from apps.core.models import BaseModel
from apps.core.utils import unique_slugify


class ExamCategory(BaseModel):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    description = models.TextField(blank=True, default="")
    image = models.ImageField(upload_to="category_images/", blank=True, null=True)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = "exam_category"
        verbose_name_plural = "Exam Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slugify(self, self.name)
        super().save(*args, **kwargs)


class Exam(BaseModel):
    class ExamType(models.TextChoices):
        SSC = "SSC", "SSC"
        UPSC = "UPSC", "UPSC"
        BPSC = "BPSC", "BPSC"
        CTET = "CTET", "CTET"
        STET = "STET", "STET"
        BANKING = "BANKING", "Banking"
        RAILWAY = "RAILWAY", "Railway"
        POLICE = "POLICE", "Police"
        DEFENCE = "DEFENCE", "Defence"
        STATE_GOVT = "STATE_GOVT", "State Government"
        ENGINEERING = "ENGINEERING", "Engineering"
        MEDICAL = "MEDICAL", "Medical"
        CA = "CA", "Chartered Accountancy"

    category = models.ForeignKey(ExamCategory, on_delete=models.CASCADE, related_name="exams")
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=170, unique=True, blank=True, db_index=True)
    description = models.TextField(blank=True, default="")
    exam_type = models.CharField(max_length=20, choices=ExamType.choices, default=ExamType.SSC)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = "exam"
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slugify(self, self.name)
        super().save(*args, **kwargs)


class Subject(BaseModel):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="subjects")
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True, default="")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "subject"
        ordering = ["order", "name"]

    def __str__(self):
        return f"{self.exam.name} / {self.name}"


class Chapter(BaseModel):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="chapters")
    name = models.CharField(max_length=150)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "chapter"
        ordering = ["order", "name"]

    def __str__(self):
        return f"{self.subject.name} / {self.name}"


class Topic(BaseModel):
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name="topics")
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True, default="")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "topic"
        ordering = ["order", "name"]

    def __str__(self):
        return f"{self.chapter.name} / {self.name}"
