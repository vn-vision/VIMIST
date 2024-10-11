from rest_framework import viewsets
from notifications.models import Notification
from notifications.serializer import NotificationSerializer
from notifications.pagination import NotificationsPagination
from notifications.filters import NotificationFilter
from django_filters.rest_framework import DjangoFilterBackend


# Create your views here.
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    # Pagination
    pagination_class = NotificationsPagination

    # Filters
    filter_backends = (DjangoFilterBackend,)
    filterset_class = NotificationFilter