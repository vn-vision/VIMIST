from django.db import models
from core.models import TimestampedModel
from core.constants import PAYMENT_TYPE

# Create your models here.
class Payment(TimestampedModel):
    STATUS_TYPE = [
    ('Pending', 'Pending'),
    ('Failed', 'Failed'),
    ('Success', 'Success')
    ]

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=10, choices=PAYMENT_TYPE, default='Cash')
    status = models.CharField(max_length=10, choices=STATUS_TYPE, default='Pending')
    sale = models.ForeignKey('sales.Sale', on_delete=models.PROTECT, null=True, blank=True, related_name='payment_sale')
    purchase = models.ForeignKey('purchases.Purchase', on_delete=models.PROTECT, null=True, blank=True, related_name='payment_purchase')
    credit_account = models.ForeignKey('credit.CreditAccount', on_delete=models.PROTECT, null=True, blank=True, related_name='payment_credit')
    reference_code = models.CharField(max_length=100, null=True, blank=True)
    paid_at = models.DateTimeField(auto_now_add=True)
    applied_to_credit = models.BooleanField(default=False)

    class Meta:
        db_table = 'payments'

    def __str__(self):
        return f"({self.pk}) ({self.sale if self.sale else self.purchase if self.purchase else ''})"
