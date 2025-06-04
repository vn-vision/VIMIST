from rest_framework import viewsets, permissions
from inventory.models import Category, Product, Inventory
from inventory.serializers import CategorySerializer, ProductSerializer, InventorySerializer

class CategoryViewSet(viewsets.ModelViewSet):
    '''
    List/Create/Update/Delete categories
    Only Admin or Manager role should be allowed to change
    '''
    queryset = Category.objects.filter(deleted_at__isnull=True).order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        user = self.request.user
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            if user.role not in ['Admin', 'Manager']:
                self.permission_denied(self.request, message="Insufficient privileges")
        return super().get_permissions()
    

class ProductViewSet(viewsets.ModelViewSet):
    '''
    Endpoint for Product CRUD. Only Admin/Manager can create/update/delete.
    Anyone authenticated can list or retrieve
    '''
    queryset = Product.objects.filter(deleted_at__isnull=True).order_by('name')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        user = self.request.user
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            if user.role not in ['Admin', 'Manager']:
                self.permission_denied(self.request, message="Insufficient privileges")
        return super().get_permissions()
    

class InventoryViewSet(viewsets.ModelViewSet):
    '''
    Read-only List of all inventory items.
    Only Admins/Manager can update manually
    '''
    queryset = Inventory.objects.filter(deleted_at__isnull=True).select_related('product')
    serializer_class = InventorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['update', 'partial_update']:
            if self.request.user.role not in ['Admin', 'Manager']:
                self.permission_denied(self.request, message='Insufficient privileges')
        return super().get_permissions()