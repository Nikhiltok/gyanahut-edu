from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import AdminStudentViewSet, ProfileView, SendEmailOtpView, VerifyEmailOtpView

urlpatterns = [
    path("profile/", ProfileView.as_view(), name="user-profile"),
    path("email/send-otp/", SendEmailOtpView.as_view(), name="user-email-send-otp"),
    path("email/verify/", VerifyEmailOtpView.as_view(), name="user-email-verify"),
]

admin_router = DefaultRouter()
admin_router.register("students", AdminStudentViewSet, basename="admin-student")

admin_urlpatterns = admin_router.urls
