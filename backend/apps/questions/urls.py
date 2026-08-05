from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    AIGenerationJobViewSet,
    AIGenerationStartView,
    AIGenerationStopView,
    BookmarkViewSet,
    BulkImportView,
    DifficultMarkViewSet,
    ImportHistoryViewSet,
    QuestionAdminViewSet,
    QuestionPublicViewSet,
)

public_router = DefaultRouter()
public_router.register("questions", QuestionPublicViewSet, basename="question")
public_router.register("bookmarks", BookmarkViewSet, basename="bookmark")
public_router.register("difficult-marks", DifficultMarkViewSet, basename="difficult-mark")

admin_router = DefaultRouter()
admin_router.register("question-imports", ImportHistoryViewSet, basename="admin-question-import-history")
admin_router.register("ai-jobs", AIGenerationJobViewSet, basename="admin-ai-generation-job")
admin_router.register("questions", QuestionAdminViewSet, basename="admin-question")

urlpatterns = public_router.urls

# Explicit "questions/..." action paths must be listed BEFORE admin_router.urls —
# otherwise the router's "questions/<pk>/" detail route matches "import"/"ai-generate"
# as a pk value and intercepts the request first (Django resolves patterns in list order).
admin_urlpatterns = [
    path("questions/import/", BulkImportView.as_view(), name="admin-question-import"),
    path("questions/ai-generate/", AIGenerationStartView.as_view(), name="admin-ai-generate"),
    path("ai-jobs/<uuid:pk>/stop/", AIGenerationStopView.as_view(), name="admin-ai-job-stop"),
] + admin_router.urls
