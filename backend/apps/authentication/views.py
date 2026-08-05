from django.conf import settings
from django.core.mail import send_mail
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from apps.core.responses import error_response, success_response

from .otp import generate_and_store_otp
from .serializers import (
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    LoginSerializer,
    LogoutSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    SendPhoneOtpSerializer,
)
from .sms_provider import send_otp_sms


class SendPhoneOtpView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = "otp"

    def post(self, request):
        serializer = SendPhoneOtpSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Validation error", serializer.errors)

        phone = serializer.validated_data["phone"]
        code = generate_and_store_otp("register-phone", phone)
        send_otp_sms(phone, code)

        data = {"phone": phone}
        if not settings.SMS_API_KEY:
            # Dev/test mode: no SMS gateway configured, so echo the code back
            # instead of requiring someone to read backend logs.
            data["debug_otp"] = code
        return success_response(data, "OTP sent")


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Validation error", serializer.errors)
        user = serializer.save()
        return success_response(
            {"user_id": str(user.id), "email": user.email}, "Registration successful", status=201
        )


class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = "login"

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Invalid credentials", serializer.errors, status=401)
        return success_response(serializer.validated_data, "Login successful")


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh = request.data.get("refresh")
        if not refresh:
            return error_response("Refresh token is required", {"refresh": ["This field is required."]})
        try:
            token = RefreshToken(refresh)
        except TokenError as exc:
            return error_response("Invalid or expired refresh token", {"refresh": [str(exc)]}, status=401)
        return success_response({"access_token": str(token.access_token)}, "Token refreshed")


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Validation error", serializer.errors)
        try:
            token = RefreshToken(serializer.validated_data["refresh"])
            token.blacklist()
        except TokenError as exc:
            return error_response("Invalid or expired refresh token", {"refresh": [str(exc)]}, status=401)
        return success_response(message="Logged out successfully")


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Validation error", serializer.errors)
        result = serializer.save()
        if result:
            reset_link = f"{settings.FRONTEND_URL}/reset-password?uid={result['uid']}&token={result['token']}"
            send_mail(
                subject="Reset your Gyanahut Edu password",
                message=f"Click the link to reset your password: {reset_link}",
                from_email=None,
                recipient_list=[result["user"].email],
                fail_silently=True,
            )
        return success_response(message="If an account with that email exists, a reset link has been sent.")


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("Validation error", serializer.errors)
        serializer.save()
        return success_response(message="Password reset successful")


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        if not serializer.is_valid():
            return error_response("Validation error", serializer.errors)
        serializer.save()
        return success_response(message="Password changed successfully")
