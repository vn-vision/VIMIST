from django.db import models
from django.conf import settings
from django.utils import timezone

class TimestampedModel(models.Model):
    # this mixin adds audit logs: created_at, updated_at, and by who
    '''
    Abstract model that provides:
    -Automatic audit logging (create/updated timestamps and actors)
    -Soft delete capability: record it was deleted instead of removing it
    '''

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="%(class)s_created_by",
        null=True,
        on_delete=models.PROTECT,
        help_text='User who created this record'
    )

    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="%(class)s_updated_by",
        null=True,
        on_delete=models.PROTECT,
        help_text='User who updated this record'
    )

    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        abstract = True
    def delete(self):
        '''Soft delete implementation'''
        self.deleted_at = timezone.now()
        self.save(update_fields=['deleted_at'])
    