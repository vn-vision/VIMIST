from django.db import models
from core.models import TimestampedModel


class CreditTransaction(TimestampedModel):
    '''
    Record all credit transactions
    '''
    credit_account = models.ForeignKey('credit.CreditAccount', on_delete=models.PROTECT, related_name='payments_creditAccount')
    sale = models.ForeignKey('sales.Sale', on_delete=models.PROTECT, related_name='credit_payment_sale', null=True, blank=True)
    purchase = models.ForeignKey('purchases.Purchase', on_delete=models.PROTECT, related_name='credit_payment_purchase', null=True, blank=True)
    payment = models.ForeignKey('payments.Payment', on_delete=models.PROTECT, related_name='payment_id', null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=10, choices=[('debit', 'debit'), ('credit', 'credit')])
    transaction_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'credit_transaction'
    
    def __str__(self):
        return f"({self.pk}) ({self.type}) ({self.sale or self.purchase})"