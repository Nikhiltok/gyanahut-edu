from rest_framework.filters import SearchFilter
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from apps.core.permissions import IsAdminOrSuperAdmin
from apps.core.responses import error_response, success_response
from apps.core.viewsets import AdminModelViewSet, ParentFilteredReadOnlyViewSet
from apps.exams.models import Topic

from .bulk_import import run_bulk_import
from .models import AIGenerationJob, Bookmark, DifficultMark, ImportHistory, Question
from .serializers import (
    AIGenerationJobSerializer,
    BookmarkSerializer,
    DifficultMarkSerializer,
    ImportHistorySerializer,
    QuestionPublicSerializer,
    QuestionSerializer,
)
from .tasks import generate_questions_task


class QuestionPublicViewSet(ParentFilteredReadOnlyViewSet):
    queryset = Question.objects.filter(is_active=True).select_related("topic")
    serializer_class = QuestionPublicSerializer
    filter_param = "topic"
    filter_field = "topic_id"
    filter_backends = [SearchFilter]
    search_fields = ["question_text"]

    def get_queryset(self):
        queryset = super().get_queryset()
        difficulty = self.request.query_params.get("difficulty")
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty.upper())
        return queryset


class QuestionAdminViewSet(AdminModelViewSet, ModelViewSet):
    queryset = Question.objects.all().select_related("topic").prefetch_related("options")
    serializer_class = QuestionSerializer
    filter_backends = [SearchFilter]
    search_fields = ["question_text"]

    def get_queryset(self):
        queryset = super().get_queryset()
        topic = self.request.query_params.get("topic")
        chapter = self.request.query_params.get("chapter")
        subject = self.request.query_params.get("subject")
        exam = self.request.query_params.get("exam")
        difficulty = self.request.query_params.get("difficulty")
        if topic:
            queryset = queryset.filter(topic_id=topic)
        elif chapter:
            queryset = queryset.filter(topic__chapter_id=chapter)
        elif subject:
            queryset = queryset.filter(topic__chapter__subject_id=subject)
        elif exam:
            queryset = queryset.filter(topic__chapter__subject__exam_id=exam)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty.upper())
        return queryset


class BulkImportView(APIView):
    permission_classes = [IsAdminOrSuperAdmin]
    parser_classes = [MultiPartParser]

    def post(self, request):
        uploaded_file = request.FILES.get("file")
        file_format = request.data.get("format", "")
        default_topic_id = request.data.get("topic_id") or None
        if not uploaded_file or not file_format:
            return error_response("Validation error", {"file": ["file and format are required"]})

        try:
            result = run_bulk_import(uploaded_file, file_format, request.user, default_topic_id)
        except (ValueError, KeyError) as exc:
            return error_response("Import failed", {"file": [str(exc)]})

        ImportHistory.objects.create(
            file_name=uploaded_file.name,
            file_format=file_format,
            uploaded_by=request.user,
            total=result["total"],
            success=result["success"],
            failed=result["failed"],
            errors=result["errors"],
            status=ImportHistory.Status.COMPLETED if result["failed"] == 0 else ImportHistory.Status.FAILED,
        )
        return success_response(result, "Import completed")


class ImportHistoryViewSet(AdminModelViewSet, ReadOnlyModelViewSet):
    queryset = ImportHistory.objects.all()
    serializer_class = ImportHistorySerializer


class AIGenerationStartView(APIView):
    permission_classes = [IsAdminOrSuperAdmin]

    def post(self, request):
        topic_id = request.data.get("topic_id")
        difficulty = str(request.data.get("difficulty") or Question.Difficulty.MEDIUM).upper()
        errors = {}

        if not topic_id or not Topic.objects.filter(id=topic_id).exists():
            errors["topic_id"] = ["A valid topic_id is required."]

        try:
            count = int(request.data.get("count"))
            if not (1 <= count <= 50):
                errors["count"] = ["count must be between 1 and 50."]
        except (TypeError, ValueError):
            errors["count"] = ["count must be an integer."]

        if difficulty not in Question.Difficulty.values:
            errors["difficulty"] = ["Invalid difficulty."]

        if errors:
            return error_response("Validation error", errors)

        job = AIGenerationJob.objects.create(
            topic_id=topic_id, requested_by=request.user, difficulty=difficulty, target_count=count
        )
        generate_questions_task.delay(str(job.id))
        return success_response(AIGenerationJobSerializer(job).data, "AI question generation started")


class AIGenerationJobViewSet(AdminModelViewSet, ReadOnlyModelViewSet):
    queryset = AIGenerationJob.objects.all().select_related("topic")
    serializer_class = AIGenerationJobSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        topic = self.request.query_params.get("topic")
        if topic:
            queryset = queryset.filter(topic_id=topic)
        return queryset


class AIGenerationStopView(APIView):
    permission_classes = [IsAdminOrSuperAdmin]

    def post(self, request, pk):
        try:
            job = AIGenerationJob.objects.get(id=pk)
        except AIGenerationJob.DoesNotExist:
            return error_response("Job not found", status=404)

        if job.status in (AIGenerationJob.Status.PENDING, AIGenerationJob.Status.RUNNING):
            job.stop_requested = True
            job.save(update_fields=["stop_requested"])

        return success_response(AIGenerationJobSerializer(job).data, "Stop requested")


class BookmarkViewSet(ModelViewSet):
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "delete"]

    def get_queryset(self):
        return Bookmark.objects.filter(student=self.request.user).select_related("question", "question__topic")


class DifficultMarkViewSet(ModelViewSet):
    serializer_class = DifficultMarkSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "delete"]

    def get_queryset(self):
        return DifficultMark.objects.filter(student=self.request.user)
