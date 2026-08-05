from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    GeneratePracticeTestView,
    LiveTestsView,
    SaveProgressView,
    StartTestView,
    SubmitTestView,
    TestAdminViewSet,
    TestDetailView,
    UpcomingTestsView,
)

admin_router = DefaultRouter()
admin_router.register("scheduler", TestAdminViewSet, basename="admin-test")

urlpatterns = [
    path("tests/upcoming/", UpcomingTestsView.as_view(), name="tests-upcoming"),
    path("tests/live/", LiveTestsView.as_view(), name="tests-live"),
    path("tests/practice/generate/", GeneratePracticeTestView.as_view(), name="tests-practice-generate"),
    path("tests/<uuid:pk>/", TestDetailView.as_view(), name="tests-detail"),
    path("tests/<uuid:pk>/start/", StartTestView.as_view(), name="tests-start"),
    path("tests/<uuid:pk>/submit/", SubmitTestView.as_view(), name="tests-submit"),
    path(
        "tests/<uuid:pk>/attempts/<uuid:attempt_id>/progress/",
        SaveProgressView.as_view(),
        name="tests-save-progress",
    ),
]

admin_urlpatterns = admin_router.urls
