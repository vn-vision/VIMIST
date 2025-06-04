from rest_framework import viewsets, permissions
from notifications.models import Notification
from notifications.serializers import NotificationSerializer
from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    '''
    List all notifications for the authenticated user
    Provide a custom action 'mark_read' to set read_at timestamp
    '''

    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            deleted_at__isnull=True,
            user=self.request.user
        ).order_by('-sent_at')
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        ''' Custom endpoints: POST /notifications/{pk}/mark_read/'''
        notification = self.get_object()
        notification.read_at = timezone.now()
        notification.updated_by=request.user
        notification.save(update_fields['read_at', 'updated_by'])
        return Response({'status':'mark as read'}, status=status.HTTP_200_OK)