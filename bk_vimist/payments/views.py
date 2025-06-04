from rest_framework import viewsets, permissions
from payments.models import Payment
from payments.serializers import PaymentSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    '''
    CRUD for payment:
    - GET /payments/ -> list all payments for the company
    - POST /payments/ -> create payment (clerk/Admin)
    - GET /payments/{pk} -> get payment by id
    - no updates/deletes on payment after creation
    '''
    queryset = Payment.objects.filter(deleted_at__isnull=True).select_related('credit_account')
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # only credit payments linked to this company
        return Payment.objects.filter(
            deleted_at__isnull=True,
            credit_account__customer__company=self.request.user.company
        ).order_by('-paid_at')

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        self.permission_denied(request, message='Payments cannot be updated')
    
    def destroy(self, request, *args, **kwargs):
        self.permission_denied(request, message="Payments cannot be deleted")
