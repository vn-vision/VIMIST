"""
Filters for the customers app.
    name: Filter customers by name.
    contact_info: Filter customers by contact information.
    date: Filter customers by date they were created.
"""
from django_filters import rest_framework as filters
from customers.models import Customer


class CustomerFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    contact_info = filters.CharFilter(field_name='contact_info', lookup_expr='icontains')
    date = filters.DateFromToRangeFilter(field_name='created_at', lookup_expr='range')

    class Meta:
        model = Customer
        fields = ['name', 'contact_info', 'date']