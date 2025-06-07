from django.contrib import admin
from inventory.models import Category, Inventory, Product, ProductImage

# Register your models here.
@admin.register(Category)
class Category(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ['name']

@admin.register(Inventory)
class Inventory(admin.ModelAdmin):
    list_display = ('product', 'quantity')
    search_fields = ['product']

@admin.register(Product)
class Product(admin.ModelAdmin):
    list_display = ('name', 'description', 'unit_price', 'category', 'reorder_level')
    search_fields = ['name', 'category']

@admin.register(ProductImage)
class ProductImage(admin.ModelAdmin):
    list_display = ('product', 'url', 'is_primary')
    search_fields = ['product']

