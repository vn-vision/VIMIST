from rest_framework import viewsets, permissions
from sales.models import Sale
from sales.serializers import SaleSerializer


class SaleViewSet(viewsets.ModelViewSet):
    '''
    List/create/update/Delete sales (CRUD)
    only admins/clerk can create; only admins/manager can update/delete
    '''

    queryset = Sale.objects.filter(deleted_at__isnull=True).select_related('customer')
    serializer_class = SaleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # only return sales for users company
        return Sale.objects.filter(
            deleted_at__isnull=True,
        ).order_by('-sale_datetime')
    
    def get_permissions(self):
        user = self.request.user
        if self.action in ['create']:
            if user.role not in ['Admin', 'Clerk']:
                self.permission_denied(self.request, message="Insufficient privileges")
        
        if self.action in ['update', 'destroy', 'partial_update']:
            if user.role not in ['Admin', 'Manager']:
                self.permission_denied(self.request, message="Insufficient privileges")
        return super().get_permissions()