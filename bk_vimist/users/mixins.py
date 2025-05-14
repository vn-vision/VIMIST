from rest_framework.permissions import DjangoModelPermissions
from rest_framework import permissions
class RoleBasedAccessMixin:
    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            # Use DjangoModelPermissions to automatically check permissions
            permission_classes = [DjangoModelPermissions]
        elif self.action in ['list', 'retrieve']:
            # Allow listing and retrieval for authenticated users or anonymous read-only access
            permission_classes = [permissions.AllowAny]
        else:
            # Fallback permission
            permission_classes = [permissions.IsAuthenticated]

        return [permission() for permission in permission_classes]
