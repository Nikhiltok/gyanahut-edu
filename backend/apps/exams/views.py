from rest_framework.viewsets import ModelViewSet

from apps.core.viewsets import AdminModelViewSet, ParentFilteredReadOnlyViewSet, ParentFilterMixin

from .models import Chapter, Exam, ExamCategory, Subject, Topic
from .serializers import ChapterSerializer, ExamCategorySerializer, ExamSerializer, SubjectSerializer, TopicSerializer


# --- Public, read-only endpoints (student browsing) ---

class ExamCategoryPublicViewSet(ParentFilteredReadOnlyViewSet):
    queryset = ExamCategory.objects.filter(is_active=True, status=True)
    serializer_class = ExamCategorySerializer
    lookup_field = "slug"


class ExamPublicViewSet(ParentFilteredReadOnlyViewSet):
    queryset = Exam.objects.filter(is_active=True, status=True)
    serializer_class = ExamSerializer
    lookup_field = "slug"
    filter_param = "category"
    filter_field = "category__slug"


class SubjectPublicViewSet(ParentFilteredReadOnlyViewSet):
    queryset = Subject.objects.filter(is_active=True)
    serializer_class = SubjectSerializer
    filter_param = "exam"
    filter_field = "exam_id"


class ChapterPublicViewSet(ParentFilteredReadOnlyViewSet):
    queryset = Chapter.objects.filter(is_active=True)
    serializer_class = ChapterSerializer
    filter_param = "subject"
    filter_field = "subject_id"


class TopicPublicViewSet(ParentFilteredReadOnlyViewSet):
    queryset = Topic.objects.filter(is_active=True)
    serializer_class = TopicSerializer
    filter_param = "chapter"
    filter_field = "chapter_id"


# --- Admin CRUD endpoints ---

class ExamCategoryAdminViewSet(AdminModelViewSet, ModelViewSet):
    queryset = ExamCategory.objects.all()
    serializer_class = ExamCategorySerializer


class ExamAdminViewSet(AdminModelViewSet, ParentFilterMixin, ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    filter_param = "category"
    filter_field = "category_id"


class SubjectAdminViewSet(AdminModelViewSet, ParentFilterMixin, ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    filter_param = "exam"
    filter_field = "exam_id"


class ChapterAdminViewSet(AdminModelViewSet, ParentFilterMixin, ModelViewSet):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    filter_param = "subject"
    filter_field = "subject_id"


class TopicAdminViewSet(AdminModelViewSet, ParentFilterMixin, ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    filter_param = "chapter"
    filter_field = "chapter_id"
