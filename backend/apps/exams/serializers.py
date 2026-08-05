from rest_framework import serializers

from .models import Chapter, Exam, ExamCategory, Subject, Topic


class ExamCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamCategory
        fields = ("id", "name", "slug", "description", "image", "status", "created_at")
        read_only_fields = ("id", "slug", "created_at")


class ExamSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    subjects = serializers.SerializerMethodField()

    class Meta:
        model = Exam
        fields = (
            "id", "category", "category_name", "name", "slug", "description",
            "exam_type", "status", "subjects", "created_at",
        )
        read_only_fields = ("id", "slug", "created_at")

    def get_subjects(self, obj):
        return list(obj.subjects.filter(is_active=True).order_by("order").values_list("name", flat=True))


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ("id", "exam", "name", "description", "order", "created_at")
        read_only_fields = ("id", "created_at")


class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ("id", "subject", "name", "order", "created_at")
        read_only_fields = ("id", "created_at")


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ("id", "chapter", "name", "description", "order", "created_at")
        read_only_fields = ("id", "created_at")
