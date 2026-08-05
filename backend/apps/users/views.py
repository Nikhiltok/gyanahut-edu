from django.conf import settings
from django.core.mail import send_mail
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet

from apps.authentication.otp import generate_and_store_otp, verify_otp
from apps.core.permissions import IsAdminOrSuperAdmin
from apps.core.responses import error_response, success_response

from .models import User
from .serializers import (
    AdminStudentSerializer,
    ProfileSerializer,
    ProfileUpdateSerializer,
    VerifyEmailOtpSerializer,
)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return success_response(serializer.data)

    def patch(self, request):
        serializer = ProfileUpdateSerializer(request.user, data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response("Validation error", serializer.errors)
        serializer.save()
        return success_response(ProfileSerializer(request.user).data, "Profile updated successfully")


class SendEmailOtpView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_scope = "otp"

    def post(self, request):
        if request.user.email_verified:
            return error_response("Email is already verified", status=400)

        code = generate_and_store_otp("verify-email", request.user.email)
        send_mail(
            subject="Verify your Gyanahut Edu email",
            message=f"Your email verification code is {code}. It is valid for 10 minutes.",
            from_email=None,
            recipient_list=[request.user.email],
            fail_silently=True,
        )
        data = {}
        if not settings.EMAIL_HOST:
            # No real SMTP host configured (dev/test), echo the code back
            # instead of requiring someone to read backend logs.
            data["debug_otp"] = code
        return success_response(data, "Verification code sent to your email")


class VerifyEmailOtpView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = VerifyEmailOtpSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Validation error", serializer.errors)

        if not verify_otp("verify-email", request.user.email, serializer.validated_data["code"]):
            return error_response("Invalid or expired code", {"code": ["Invalid or expired code."]})

        request.user.email_verified = True
        request.user.save(update_fields=["email_verified"])
        return success_response(ProfileSerializer(request.user).data, "Email verified successfully")


class AdminStudentViewSet(ReadOnlyModelViewSet):
    permission_classes = [IsAdminOrSuperAdmin]
    serializer_class = AdminStudentSerializer
    filter_backends = [SearchFilter]
    search_fields = ["email", "first_name", "last_name", "phone"]

    def get_queryset(self):
        return (
            User.objects.filter(role=User.Role.STUDENT)
            .select_related("student_profile")
            .prefetch_related("student_profile__target_exams")
            .order_by("-created_at")
        )
