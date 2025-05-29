from django.dispatch import receiver
from django.db.models.signals import post_save
from .models import Sale
from .services import process_sale


@receiver(post_save, sender=Sale)
def handle_sale(sender, instance, created, **kwargs):
    if not created:
        return
    process_sale(instance)