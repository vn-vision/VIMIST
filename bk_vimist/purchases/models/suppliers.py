from django.db import models
from core.models import TimestampedModel


class Supplier(TimestampedModel):
    '''
    records supplier details
    '''
    name = models.CharField(max_length=150)
    contact_info = models.CharField(max_length=150, blank=True, null=True)

    class Meta:
        db_table = 'suppliers'
    
    def __str__(self):
        return f"Supplier ({self.name})"