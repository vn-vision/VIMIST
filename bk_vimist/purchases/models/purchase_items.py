from django.db import models
from core.models import TimestampedModel
from django.core.validators import MinValueValidator


class PurchaseItem(TimestampedModel):
    '''
    Records individual purchases
    link to a particular product
    '''
    purchase = models.ForeignKey('purchases.Purchase', on_delete=models.CASCADE, related_name='purchase_item')
    product = models.ForeignKey('inventory.Product', on_delete=models.CASCADE, related_name='product_purchase')
    quantity = models.IntegerField(validators=[MinValueValidator(0)])
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])

    class Meta:
        db_table='purchase_items'
    
    def __str__(self):
        return f"Purchase ({self.purchase}) ({self.product}) ({self.cost_price})"


