from django.urls import path

from .views import (
    ChangePasswordView,
    ForgotPasswordView,
    LoginView,
    LogoutView,
    RefreshTokenView,
    RegisterView,
    ResetPasswordView,
    SendPhoneOtpView,
)

urlpatterns = [
    path("otp/send/", SendPhoneOtpView.as_view(), name="auth-otp-send"),
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("login/", LoginView.as_view(), name="auth-login"),
    path("token/refresh/", RefreshTokenView.as_view(), name="auth-token-refresh"),
    path("logout/", LogoutView.as_view(), name="auth-logout"),
    path("password/forgot/", ForgotPasswordView.as_view(), name="auth-password-forgot"),
    path("password/reset/", ResetPasswordView.as_view(), name="auth-password-reset"),
    path("password/change/", ChangePasswordView.as_view(), name="auth-password-change"),
]
