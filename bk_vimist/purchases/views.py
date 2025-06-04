from rest_framework import viewsets, permissions
from purchases.models import Purchase
from purchases.serializers import PurchaseSerializer


class PurchaseViewSet(viewsets.ModelViewSet):
    '''
    CRUD for purchases:
    - GET /purchases/: list all purchases for this user's company
    - POST /purchases: create a new purchase - Admin/Managers
    - GET /purchases/{pk}: retrieve a purchase by id
    - PUT/PATCH/DELETE: update or delete (Admin only)
    '''
    queryset = Purchase.objects.filter(deleted_at__isnull=True).select_related('supplier')
    serializer_class = PurchaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # only return purchases belonging to user's company
        return Purchase.objects.filter(
            deleted_at__isnull=True,
        ).order_by('-purchase_datetime')
    
    def get_permissions(self):
        user = self.request.user
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            if user.role not in ['Admin', 'Manager']:
                self.permission_denied(self.request, message="Insufficient privileges")
        return super().get_permissions()