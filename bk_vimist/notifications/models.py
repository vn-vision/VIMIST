from django.db import models
from core.models import TimestampedModel
from core.constants import NOTIFICATION_TYPE

# Create your models here.

class Notification(TimestampedModel):
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPE, default='')
    payload = models.JSONField(null=True, blank=True)
    sent_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'Notifications'
    
    def __str__(self):
        return f"({self.pk}) ({self.type}) ({self.payload if self.payload else 'No message'})"