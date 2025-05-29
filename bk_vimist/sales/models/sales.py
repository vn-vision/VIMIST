from django.db import models
from core.models import TimestampedModel
from django.core.validators import MinValueValidator
from core.constants import PAYMENT_TYPE
from django.core.exceptions import ValidationError

class Sale(TimestampedModel):
    '''
    store the sale records for goods sold to customers
    if goods sold via mobile money/credit -> link to customer
    '''

    customer = models.ForeignKey('sales.Customer', related_name='sale_customer', on_delete=models.PROTECT, null=True, blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    payment_type = models.CharField(max_length=10, choices=PAYMENT_TYPE, default='Cash')
    sale_datetime = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'sales'
    
    def __str__(self):
        return f"sale ({self.pk}) ({self.total_amount})"

