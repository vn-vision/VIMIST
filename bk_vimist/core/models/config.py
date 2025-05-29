from django.db import models
from core.models.mixins import TimestampedModel

class Config(TimestampedModel):
    '''
    Per-Company configurations. Created once when the company is registered.
    Editable by that company's Admin to rebrand or tweak systems settings.
    '''

    company = models.OneToOneField(
        'core.Company',
        on_delete=models.CASCADE,
        related_name='config'
    )

    system_name = models.CharField(
        max_length=100,
        help_text='The display name of the app for this company'
    )

    primary_color = models.CharField(
        max_length=7,
        help_text='Hex Code for the main branding color'
    )
    secondary_color = models.CharField(
        max_length=7,
        help_text='Hex Code for the accents/highlights branding color'
    )

    class Meta:
        db_table = 'configs'
    
    def __str__(self):
        return f"Config ({self.company.subdomain})"