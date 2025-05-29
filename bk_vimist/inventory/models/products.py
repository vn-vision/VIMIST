from django.db import models
from core.models.mixins import TimestampedModel
from django.core.validators import MinValueValidator


class Product(TimestampedModel):
    '''
    Products stores the id, and contents of the provided product
    It links this product to a category, FK: Category
    '''
    name = models.CharField(max_length=150)
    description = models.CharField(max_length=300, blank=True, null=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    category = models.ForeignKey('inventory.Category', related_name='product_category', on_delete=models.PROTECT)
    reorder_level = models.SmallIntegerField(default=10)


    class Meta:
        db_table = 'products'
    
    def __str__(self):
        return f"Product ({self.name}) category ({self.category.name})"