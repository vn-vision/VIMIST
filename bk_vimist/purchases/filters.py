"""
Filter set for purchases app
    Product: to search for a purchase by product
    Quantity: to search for a purchase by quantity
    Payment Method: to search for a purchase by payment method
    Price: to search for a purchase by price
    supplier: to search for a purchase by supplier
    Date: to search for a purchase by date
    Time: to search for a purchase by time
"""
from django_filters import rest_framework as filters
from purchases.models import Purchases


class PurchaseFilter(filters.FilterSet):
    product = filters.CharFilter(field_name='product', lookup_expr='icontains')
    quantity = filters.NumericRangeFilter(field_name='quantity_purchased', lookup_expr='range')
    payment_method = filters.CharFilter(field_name='payment_method', lookup_expr='icontains')
    price_range = filters.RangeFilter(field_name='purchase_price', lookup_expr='range')
    supplier = filters.CharFilter(field_name='supplier_name', lookup_expr='icontains')
    date = filters.DateFromToRangeFilter(field_name='purchase_date', lookup_expr='range')
    time = filters.TimeRangeFilter(field_name='updated_at', lookup_expr='range')

    class Meta:
        model = Purchases
        fields = ['product', 'quantity', 'payment_method', 'price_range', 'supplier', 'date', 'time']