from django.db import models
from core.models import TimestampedModel
from core.constants import STATUS_CREDIT

class CreditAccount(TimestampedModel):
    '''
    records credit details
    '''

    customer = models.ForeignKey('sales.Customer', on_delete=models.PROTECT, related_name='credit_customer')
    current_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=10, choices=STATUS_CREDIT, default='Active')

    class Meta:
        db_table = 'credit_account'
    
    def __str__(self):
        return f"({self.pk}) ({self.customer}) ({self.status})"