from django.db import models

# This model represents the notifications table schema
# It records system notifications like low stock alerts and payment reminders
class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('Low Stock', 'Low Stock'),
        ('Payment Due', 'Payment Due'),
        ('Top-Up Reminder', 'Top-Up Reminder'),
        ('Reorder Stock', 'Reorder Stock'),
        ('Restocked', 'Restocked')
    ]
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Notification: {self.type}"
