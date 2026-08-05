from rest_framework import serializers

from .models import StudentProfile, User


class ProfileSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    target_exams = serializers.SerializerMethodField()
    date_of_birth = serializers.SerializerMethodField()
    gender = serializers.SerializerMethodField()
    education = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id", "name", "first_name", "last_name", "email", "phone", "role",
            "profile_image", "state", "city", "target_exams", "date_of_birth", "gender", "education",
            "phone_verified", "email_verified",
        )
        read_only_fields = ("id", "email", "role", "phone_verified", "email_verified")

    def get_name(self, obj):
        return obj.get_full_name()

    def _profile(self, obj):
        return getattr(obj, "student_profile", None)

    def get_target_exams(self, obj):
        profile = self._profile(obj)
        if not profile:
            return []
        return [{"id": str(exam.id), "name": exam.name} for exam in profile.target_exams.all()]

    def get_date_of_birth(self, obj):
        profile = self._profile(obj)
        return profile.date_of_birth if profile else None

    def get_gender(self, obj):
        profile = self._profile(obj)
        return profile.gender if profile else None

    def get_education(self, obj):
        profile = self._profile(obj)
        return profile.education if profile else None


class AdminStudentSerializer(ProfileSerializer):
    class Meta(ProfileSerializer.Meta):
        fields = ProfileSerializer.Meta.fields + ("is_active", "created_at")
        read_only_fields = fields


class ProfileUpdateSerializer(serializers.ModelSerializer):
    target_exams = serializers.ListField(child=serializers.UUIDField(), required=False, write_only=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True, write_only=True)
    gender = serializers.ChoiceField(choices=StudentProfile.Gender.choices, required=False, write_only=True)
    education = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = User
        fields = (
            "first_name", "last_name", "phone", "profile_image", "state", "city",
            "target_exams", "date_of_birth", "gender", "education",
        )

    def update(self, instance, validated_data):
        profile_fields = {"target_exams", "date_of_birth", "gender", "education"}
        profile_data = {k: validated_data.pop(k) for k in list(validated_data) if k in profile_fields}

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if profile_data:
            profile, _ = StudentProfile.objects.get_or_create(user=instance)
            if "target_exams" in profile_data:
                profile.target_exams.set(profile_data["target_exams"])
            for field in ("date_of_birth", "gender", "education"):
                if field in profile_data:
                    setattr(profile, field, profile_data[field])
            profile.save()

        return instance


class VerifyEmailOtpSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=6)
