from users.permissions import IsAdmin, IsManager, IsCashier, IsCustomer
# users/mixins.py

class RoleBasedAccessMixin:
    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            permission_classes = [IsAdmin]
        elif self.action in ['partial_update']:
            permission_classes = [IsManager]
        elif self.action in ['list', 'retrieve']:
            permission_classes = [IsCashier]
        else:
            permission_classes = [IsCustomer]
        return [permission() for permission in permission_classes]