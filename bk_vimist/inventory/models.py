from django.db import models

# This model represents the products table schema
# It records the products including when they are created and/or updated
class Product(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    quantity_in_stock = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    reorder_level = models.IntegerField()
    image = models.ImageField(default='fallback.png', upload_to='images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
