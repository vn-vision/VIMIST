from django.db import models
from inventory.models import Product
from django.utils import timezone

# Create your models here.

class Purchases(models.Model):
    """
    purchases model
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity_purchased = models.IntegerField()
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    purchase_date = models.DateField(default=timezone.now)
    supplier = models.CharField(max_length=255)
    payment_type = models.CharField(max_length=7, choices=[('Cash', 'Cash'), ('Mpesa', 'Mpesa'), ('Credit', 'Credit')])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return(f"{self.quantity_purchased} of {self.product.name} purchased from {self.supplier}")