from rest_framework.permissions import BasePermission

from apps.users.models import User


class IsAdminOrSuperAdmin(BasePermission):
    """Grants access only to ADMIN or SUPER_ADMIN users. Used for all /admin/* endpoints."""

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and user.role in (User.Role.ADMIN, User.Role.SUPER_ADMIN)
        )
