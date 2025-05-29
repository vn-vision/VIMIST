from django.db import models
from core.models.mixins import TimestampedModel

class ProductImage(TimestampedModel):
    '''
    Stores the product images
    linked to products->product_id
    '''
    product = models.ForeignKey('inventory.Product', related_name='product_image', on_delete=models.PROTECT)
    url = models.URLField()
    is_primary = models.BooleanField(default=False)

    class Meta:
        db_table = 'product_image'
        constraints = [
            models.UniqueConstraint(
                fields=['product'],
                condition=models.Q(is_primary=True),
                name='unique_primary_image_per_product'
            )
        ]
    
    def __str__(self):
        return f"({self.product.name}) ({self.url})"