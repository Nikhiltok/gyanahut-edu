from rest_framework.routers import DefaultRouter

from .views import (
    ChapterAdminViewSet,
    ChapterPublicViewSet,
    ExamAdminViewSet,
    ExamCategoryAdminViewSet,
    ExamCategoryPublicViewSet,
    ExamPublicViewSet,
    SubjectAdminViewSet,
    SubjectPublicViewSet,
    TopicAdminViewSet,
    TopicPublicViewSet,
)

public_router = DefaultRouter()
public_router.register("categories", ExamCategoryPublicViewSet, basename="category")
public_router.register("exams", ExamPublicViewSet, basename="exam")
public_router.register("subjects", SubjectPublicViewSet, basename="subject")
public_router.register("chapters", ChapterPublicViewSet, basename="chapter")
public_router.register("topics", TopicPublicViewSet, basename="topic")

admin_router = DefaultRouter()
admin_router.register("categories", ExamCategoryAdminViewSet, basename="admin-category")
admin_router.register("exams", ExamAdminViewSet, basename="admin-exam")
admin_router.register("subjects", SubjectAdminViewSet, basename="admin-subject")
admin_router.register("chapters", ChapterAdminViewSet, basename="admin-chapter")
admin_router.register("topics", TopicAdminViewSet, basename="admin-topic")

urlpatterns = public_router.urls
admin_urlpatterns = admin_router.urls
