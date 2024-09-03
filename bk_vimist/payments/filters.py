"""
Filter set for payments app
    item: to search for a payment by item
    Payment_for: Sale or Purchase
    Amount: to search for a payment by amount
    Payment Method: to search for a payment by payment method
    Date: to search for a payment by date
    Time: to search for a payment by time
"""
from django_filters import rest_framework as filters
from payments.models import Payment


class PaymentFilter(filters.FilterSet):
    item = filters.CharFilter(field_name='related', lookup_expr='icontains')
    payment_for = filters.CharFilter(field_name='payment_for', lookup_expr='icontains')
    amount = filters.NumericRangeFilter(field_name='amount_paid', lookup_expr='range')
    payment_method = filters.CharFilter(field_name='payment_method', lookup_expr='icontains')
    date = filters.DateFromToRangeFilter(field_name='payment_date', lookup_expr='range')
    time = filters.TimeRangeFilter(field_name='updated_at', lookup_expr='range')

    class Meta:
        model = Payment
        fields = ['item', 'payment_for', 'amount', 'payment_method', 'date', 'time']