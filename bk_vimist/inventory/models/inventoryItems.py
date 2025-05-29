from django.db import models
from core.models.mixins import TimestampedModel
from django.core.validators import MinValueValidator

class Inventory(TimestampedModel):
    '''
    stores inventory items
    '''
    product = models.ForeignKey('inventory.Product', related_name='product_inventory', on_delete=models.PROTECT)
    quantity = models.SmallIntegerField(validators=[MinValueValidator(0)])

    class Meta:
        db_table = 'inventory'
    
    def __str__(self):
        return f"product ({self.product.name} quantity ({self.quantity}))"