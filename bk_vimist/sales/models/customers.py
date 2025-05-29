from django.db import models
from core.models import TimestampedModel


class Customer(TimestampedModel):
    '''
    Stores details related to customers
    '''
    name = models.CharField(max_length=150, help_text='full name')
    phone = models.CharField(max_length=12)
    address = models.CharField(max_length=500, help_text='delivery/billing address', blank=True, null=True)
    credit_limit = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)


    class Meta:
        db_table = 'customers'
    
    def __str__(self):
        return f"Customer ({self.name})"