"""
FilterSet for inventory app
    Name: to search for a product by name
    Category: to search for a product by category
    Quantity in Stock: to search for a product by quantity in stock
    Price_Range: to search for a product by price
    Date_Range: to search for a product by date
    Date: to search for a product by date
"""
from django_filters import rest_framework as filters
from inventory.models import Product


class ProductFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    category = filters.CharFilter(field_name='category', lookup_expr='icontains')
    quantity_in_stock = filters.RangeFilter(field_name='quantity_in_stock')
    price_range = filters.RangeFilter(field_name='unit_price')
    date_range = filters.DateFromToRangeFilter(field_name='updated_at')
    date = filters.DateFilter(field_name='created_at', lookup_expr='exact')

    class Meta:
        model = Product
        fields = ['name', 'category', 'quantity_in_stock', 'price_range', 'date_range', 'date']