"""
Filter set for notifications app
    Notification Type: to search for a notification by type
    Date: to search for a notification by date
    read_at: to search for a notification by when it was read
    Time: to search for a notification by time
"""
from django_filters import rest_framework as filters
from notifications.models import Notification


class NotificationFilter(filters.FilterSet):
    notification_type = filters.CharFilter(field_name='type', lookup_expr='icontains')
    read_at = filters.DateFromToRangeFilter(field_name='read_at', lookup_expr='range')
    time = filters.TimeRangeFilter(field_name='created_at', lookup_expr='range')

    class Meta:
        model = Notification
        fields = ['notification_type', 'read_at', 'time']