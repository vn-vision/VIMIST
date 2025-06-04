from rest_framework import serializers
from notifications.models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    sent_at = serializers.DateTimeField(read_only=True)
    read_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'type', 'payload', 'sent_at', 'read_at']
        read_only_fields = fields
        