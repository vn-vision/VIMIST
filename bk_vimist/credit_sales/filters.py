"""
Filter set for credit sales app
    date: Filter credit sales by date
    due_date: Filter credit sales by due date
    customer: Filter credit sales by customer
    amount: Filter credit sales by amount
    sale: Filter credit sales by sale
    outstanding_balance: Filter credit sales by outstanding balance
"""
from django_filters import rest_framework as filters
from credit_sales.models import Credit_Sale


class CreditSaleFilter(filters.FilterSet):
    customer = filters.CharFilter(field_name='customer', lookup_expr='icontains')
    sale = filters.CharFilter(field_name='sale', lookup_expr='icontains')
    amount = filters.NumberFilter(field_name='total_credit', lookup_expr='icontains')
    outstanding_balance = filters.RangeFilter(field_name='outstanding_balance', lookup_expr='icontains')
    created_at = filters.DateFromToRangeFilter(field_name='created_at', lookup_expr='range')
    updated_at = filters.DateFromToRangeFilter(field_name='updated_at', lookup_expr='range')
    due_date = filters.DateFromToRangeFilter(field_name='due_date', lookup_expr='range')
    class Meta:
        model = Credit_Sale
        fields = ['created_at', 'updated_at', 'due_date', 'customer', 'amount', 'sale', 'outstanding_balance']