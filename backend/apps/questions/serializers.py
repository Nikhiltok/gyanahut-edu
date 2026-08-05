from rest_framework import serializers

from .models import AIGenerationJob, Bookmark, DifficultMark, ImportHistory, Question, QuestionOption


class QuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = ("id", "option_text", "is_correct", "order")


class QuestionOptionPublicSerializer(serializers.ModelSerializer):
    """Same as above but hides is_correct — used on the student practice feed."""

    class Meta:
        model = QuestionOption
        fields = ("id", "option_text", "order")


class QuestionSerializer(serializers.ModelSerializer):
    options = QuestionOptionSerializer(many=True, required=False)
    topic_name = serializers.CharField(source="topic.name", read_only=True)

    class Meta:
        model = Question
        fields = (
            "id", "topic", "topic_name", "question_text", "question_type", "difficulty",
            "explanation", "marks", "negative_marks", "image", "language", "options", "created_at",
        )
        read_only_fields = ("id", "created_at")

    def create(self, validated_data):
        options_data = validated_data.pop("options", [])
        validated_data["created_by"] = self.context["request"].user
        question = Question.objects.create(**validated_data)
        for order, option in enumerate(options_data):
            QuestionOption.objects.create(question=question, order=option.get("order", order), **{
                k: v for k, v in option.items() if k != "order"
            })
        return question

    def update(self, instance, validated_data):
        options_data = validated_data.pop("options", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if options_data is not None:
            instance.options.all().delete()
            for order, option in enumerate(options_data):
                QuestionOption.objects.create(question=instance, order=option.get("order", order), **{
                    k: v for k, v in option.items() if k != "order"
                })
        return instance


class QuestionPublicSerializer(serializers.ModelSerializer):
    options = QuestionOptionPublicSerializer(many=True, read_only=True)
    topic_name = serializers.CharField(source="topic.name", read_only=True)

    class Meta:
        model = Question
        fields = (
            "id", "topic", "topic_name", "question_text", "question_type", "difficulty",
            "marks", "negative_marks", "image", "language", "options",
        )


class BookmarkSerializer(serializers.ModelSerializer):
    question_detail = QuestionPublicSerializer(source="question", read_only=True)

    class Meta:
        model = Bookmark
        fields = ("id", "question", "question_detail", "created_at")
        read_only_fields = ("id", "created_at")

    def create(self, validated_data):
        validated_data["student"] = self.context["request"].user
        return super().create(validated_data)


class DifficultMarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = DifficultMark
        fields = ("id", "question", "created_at")
        read_only_fields = ("id", "created_at")

    def create(self, validated_data):
        validated_data["student"] = self.context["request"].user
        return super().create(validated_data)


class ImportHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ImportHistory
        fields = ("id", "file_name", "file_format", "total", "success", "failed", "errors", "status", "created_at")
        read_only_fields = fields


class AIGenerationJobSerializer(serializers.ModelSerializer):
    topic_name = serializers.CharField(source="topic.name", read_only=True)

    class Meta:
        model = AIGenerationJob
        fields = (
            "id", "topic", "topic_name", "difficulty", "target_count", "generated_count",
            "duplicate_count", "status", "error_message", "created_at",
        )
        read_only_fields = fields
