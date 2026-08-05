from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.db.models import Q
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.models import StudentProfile, User

from .otp import verify_otp


class SendPhoneOtpSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)

    def validate_phone(self, value):
        if User.objects.filter(phone=value, phone_verified=True).exists():
            raise serializers.ValidationError("This phone number is already registered.")
        return value


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=15)
    otp_code = serializers.CharField(max_length=6, write_only=True)
    target_exams = serializers.ListField(child=serializers.UUIDField(), required=False)
    password = serializers.CharField(write_only=True, validators=[validate_password])

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_phone(self, value):
        if User.objects.filter(phone=value, phone_verified=True).exists():
            raise serializers.ValidationError("This phone number is already registered.")
        return value

    def validate(self, attrs):
        if not verify_otp("register-phone", attrs["phone"], attrs["otp_code"]):
            raise serializers.ValidationError({"otp_code": "Invalid or expired OTP."})
        return attrs

    def create(self, validated_data):
        name_parts = validated_data["name"].strip().split(" ", 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ""
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            phone=validated_data["phone"],
            phone_verified=True,
            first_name=first_name,
            last_name=last_name,
        )
        target_exams = validated_data.get("target_exams")
        if target_exams:
            profile, _ = StudentProfile.objects.get_or_create(user=user)
            profile.target_exams.set(target_exams)
        return user


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(help_text="Email or phone number")
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs["identifier"].strip()
        password = attrs["password"]

        user = User.objects.filter(Q(email__iexact=identifier) | Q(phone=identifier)).first()
        if not user or not user.check_password(password) or not user.is_active:
            raise serializers.ValidationError("Invalid credentials.")

        refresh = RefreshToken.for_user(user)
        refresh["role"] = user.role
        refresh["email"] = user.email

        return {
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "user": {
                "id": str(user.id),
                "name": user.get_full_name(),
                "email": user.email,
                "role": user.role,
            },
        }


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email__iexact=value).exists():
            # Do not reveal whether the email exists.
            return value
        return value

    def save(self):
        email = self.validated_data["email"]
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return None
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        return {"uid": uid, "token": token, "user": user}


class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])

    def validate(self, attrs):
        try:
            user_id = force_str(urlsafe_base64_decode(attrs["uid"]))
            user = User.objects.get(pk=user_id)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            raise serializers.ValidationError({"uid": "Invalid reset link."})

        if not default_token_generator.check_token(user, attrs["token"]):
            raise serializers.ValidationError({"token": "Invalid or expired token."})

        attrs["user"] = user
        return attrs

    def save(self):
        user = self.validated_data["user"]
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])

    def validate(self, attrs):
        user = self.context["request"].user
        if not user.check_password(attrs["old_password"]):
            raise serializers.ValidationError({"old_password": "Incorrect current password."})
        return attrs

    def save(self):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])
        return user
