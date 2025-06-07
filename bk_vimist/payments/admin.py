from django.contrib import admin
from payments.models import Payment

# Register your models here.
@admin.register(Payment)
class Payment(admin.ModelAdmin):
    list_display = ['amount', 'method', 'status', 'sale', 'purchase', 'credit_account', 'reference_code', 'paid_at']
    search_fields = ['method', 'reference_code', 'status']