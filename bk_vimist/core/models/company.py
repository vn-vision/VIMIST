from django.db import models
from core.models.mixins import TimestampedModel
from django.db.models import Q, UniqueConstraint


def company_logo_path(instance, filename):
    # logos stored by company subdomains to avoid name collision
    return f'company_logos/{instance.subdomain}/{filename}'

class Company(TimestampedModel):
    '''
    Represents a tenant organization
    Soft-deleted when deleted_at is set
    '''

    name = models.CharField(max_length=255, help_text='Official Company name')
    subdomain = models.CharField(max_length=100, unique=True, help_text='subdomain used for this company')
    logo = models.ImageField(upload_to=company_logo_path, null=True, blank=True)

    class Meta:
        db_table = 'companies'
        constraints = [
            models.UniqueConstraint(
                fields=['subdomain'],
                name='unique_subdomain'
            )
        ]
    
    def __str__(self):
        return f"{self.name} ({self.subdomain})"