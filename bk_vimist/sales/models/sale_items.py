from django.db import models
from core.models import TimestampedModel
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError

class SaleItem(TimestampedModel):
    '''
    records individual sale item
    '''
    sale = models.ForeignKey('sales.Sale', on_delete=models.PROTECT, related_name='sale_item')
    product = models.ForeignKey('inventory.Product', on_delete=models.PROTECT, related_name='product_sale')
    quantity = models.IntegerField(validators=[MinValueValidator(0)])
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'sale_items'
    

    def __str__(self):
        return f"({self.sale}) ({self.product}) ({self.total_price})"