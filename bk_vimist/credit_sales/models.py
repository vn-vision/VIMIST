from django.db import models
from customers.models import Customer
from sales.models import Sale
from datetime import timedelta, date

# This model represents the credit_sales table schema
# It records credit sales, including total credit amount and outstanding balance
class Credit_Sale(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE)
    total_credit = models.DecimalField(max_digits=10, decimal_places=2)
    outstanding_balance = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField(default=date.today() + timedelta(days=10))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Credit sale for {self.customer.name if self.customer else 'Anonymous'} - Balance: {self.outstanding_balance}"
