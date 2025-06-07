from django.contrib import admin
from purchases.models import Purchase, PurchaseItem, Supplier

# Register your models here.
@admin.register(PurchaseItem)
class PurchaseItem(admin.ModelAdmin):
    list_display = ('purchase', 'product', 'quantity', 'cost_price')
    search_fields = ['product', 'purchase']

@admin.register(Purchase)
class Purchase(admin.ModelAdmin):
    list_display = ('supplier', 'purchase_datetime', 'total_amount', 'payment_type')
    search_fields = ['supplier', 'purchase_datetime', 'payment_type']

@admin.register(Supplier)
class Supplier(admin.ModelAdmin):
    list_display = ('name', 'contact_info')
    search_fields = ['name']