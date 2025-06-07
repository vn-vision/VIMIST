from django.contrib import admin
from notifications.models import Notification

# Register your models here.
@admin.register(Notification)
class Notification(admin.ModelAdmin):
    list_display = ('type', 'payload', 'sent_at', 'read_at')
    search_fields = ['type']