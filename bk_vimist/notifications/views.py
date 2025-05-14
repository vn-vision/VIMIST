from rest_framework import viewsets
from notifications.models import Notification
from notifications.serializer import NotificationSerializer
from notifications.pagination import NotificationsPagination
from notifications.filters import NotificationFilter
from django_filters.rest_framework import DjangoFilterBackend
# custom permissions to apply to the viewset
from users.mixins import RoleBasedAccessMixin

# Create your views here.
class NotificationViewSet(viewsets.ModelViewSet, RoleBasedAccessMixin):
    queryset = Notification.objects.all().order_by('id')
    serializer_class = NotificationSerializer

    # Pagination
    pagination_class = NotificationsPagination

    # Filters
    filter_backends = (DjangoFilterBackend,)
    filterset_class = NotificationFilter