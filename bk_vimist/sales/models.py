from django.db import models
from inventory.models import Product
from customers.models import Customer
from django.utils.timezone import now


# This model represents the sales table schema
# It records the sales transactions including product sold, customer, and payment type
class Sale(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, blank=True, null=True)
    quantity_sold = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_date = models.DateField(default=now)
    payment_type = models.CharField(max_length=7, choices=[('Cash', 'Cash'), ('Mpesa', 'Mpesa'), ('Credit', 'Credit')])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Sale of {self.product.name} to {self.customer.name if self.customer else 'Unknown'} on {self.sale_date}"