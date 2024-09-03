from rest_framework import viewsets
from notifications.models import Notification
from notifications.serializer import NotificationSerializer

# Create your views here.
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer