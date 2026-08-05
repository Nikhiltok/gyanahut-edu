from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ReadOnlyModelViewSet

from .permissions import IsAdminOrSuperAdmin


class ParentFilterMixin:
    """Filters a viewset's queryset by a parent query param.

    Set `filter_param` (query string key) and `filter_field` (ORM lookup) on subclasses,
    e.g. filter_param="exam", filter_field="exam_id" to support ?exam=<uuid>.
    """

    filter_param = None
    filter_field = None

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.filter_param and self.filter_field:
            value = self.request.query_params.get(self.filter_param)
            if value:
                queryset = queryset.filter(**{self.filter_field: value})
        return queryset


class ParentFilteredReadOnlyViewSet(ParentFilterMixin, ReadOnlyModelViewSet):
    """Public, read-only viewset that can filter its queryset by a parent query param."""

    permission_classes = [AllowAny]


class AdminModelViewSet:
    """Mixin applying the standard admin-only permission to a ModelViewSet."""

    permission_classes = [IsAdminOrSuperAdmin]
