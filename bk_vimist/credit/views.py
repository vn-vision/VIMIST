from rest_framework import viewsets, permissions
from credit.models import CreditAccount, CreditTransaction
from credit.serializers import CreditAccountSerializer, CreditTransactionSerializer

class CreditAccountViewSet(viewsets.ReadOnlyModelViewSet):
    '''
    list/retrieve credit accounts for the company
    Clerk/Admin can view; only Admin/Manager can mark status manually if need be
    '''
    queryset = CreditAccount.objects.filter(deleted_at__isnull=True)
    serializer_class = CreditAccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CreditAccount.objects.filter(
            deleted_at__isnull=True,
            customer__company=self.request.user.company
        )
    
class CreditTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    '''
    List/Retrieve all credit transactions (debits & credits) for the company
    '''
    queryset = CreditTransaction.objects.filter(deleted_at__isnull=True,)
    serializer_class = CreditTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CreditTransaction.objects.filter(
            deleted_at__isnull=True,
            credit_account__customer__company=self.request.user.company
        ).order_by('-transaction_at')