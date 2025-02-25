from django.db import models
from django.utils.timezone import now
from sales.models import Sale
from purchases.models import Purchases
from uuid import uuid4

class Payment(models.Model):
    PAYMENT_CHOICES = [
        ('Unknown', 'Unknown'),
        ('Sale', 'Sale'),
        ('Purchase', 'Purchase'),
    ]

    def_key = int(uuid4())
    related = models.IntegerField(default=def_key)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField(default=now)
    payment_method = models.CharField(max_length=20, choices=[('Cash', 'Cash'), ('Mpesa', 'Mpesa'), ('Credit', 'Credit')])
    payment_for = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='Unknown')
        
    # specific to Mpesa
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    mpesa_receipt_number = models.CharField(max_length=50, blank=True, null=True)    
    transaction_status = models.CharField(max_length=20, choices=[("pending", "pending"), ("success", "success"), ("fail", "fail")],
                                          default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'Payment of {self.amount_paid} for {self.payment_for} ID {self.related}'

    def get_related_object(self):
        if self.payment_for == 'Sale':
            return Sale.objects.get(id=self.related)
        elif self.payment_for == 'Purchase':
            return Purchases.objects.get(id=self.related)