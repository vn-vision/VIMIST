from django.db import models
from core.models import TimestampedModel
from core.constants import PAYMENT_TYPE

class Purchase(TimestampedModel):
    '''
    records general purchase
    '''
    supplier = models.ForeignKey('purchases.Supplier', on_delete=models.PROTECT, null=True, blank=True, related_name='purchase_supplier')
    purchase_datetime = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_type = models.CharField(max_length=10, choices=PAYMENT_TYPE, default='Cash')


    class Meta:
        db_table = 'purchases'
    
    def __str__(self):
        return f"Purchase ({self.pk}) ({self.total_amount})"