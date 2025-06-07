from django.contrib import admin
from sales.models import Sale, SaleItem, Customer

# Register your models here.
@admin.register(SaleItem)
class SaleItem(admin.ModelAdmin):
    list_display = ('sale', 'product', 'quantity', 'unit_price', 'total_price')
    search_fields = ['sale', 'product']

@admin.register(Sale)
class Sale(admin.ModelAdmin):
    list_display = ('customer', 'total_amount', 'payment_type', 'sale_datetime')
    search_fields = ['customer', 'sale_datetime']

@admin.register(Customer)
class Customer(admin.ModelAdmin):
    list_display = ('name', 'phone','address', 'credit_limit')
    search_fields = ['name', 'phone']