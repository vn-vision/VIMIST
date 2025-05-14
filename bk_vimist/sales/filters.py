"""
Filter set for sales app
    Product: to search for a sale by product
    Quantity: to search for a sale by quantity
    Payment Method: to search for a sale by payment method
    Price: to search for a sale by price
    Date: to search for a sale by date
"""
from django_filters import rest_framework as filters
from sales.models import Sale


class SaleFilter(filters.FilterSet):
    product = filters.CharFilter(field_name='product', lookup_expr='icontains')
    quantity = filters.NumberFilter(field_name='quantity_sold', lookup_expr='exact')
    payment_method = filters.CharFilter(field_name='payment_type', lookup_expr='icontains')
    price_range = filters.RangeFilter(field_name='total_price', lookup_expr='range')
    date = filters.DateFromToRangeFilter(field_name='sale_date', lookup_expr='range')
    time = filters.TimeRangeFilter(field_name='updated_at', lookup_expr='range')

    class Meta:
        model = Sale
        fields = ['product', 'quantity', 'payment_method', 'price_range', 'date', 'time']