from django.dispatch import receiver
from django.db.models.signals import post_save
from .models import Purchase
from .services import process_purchase

@receiver(post_save, sender=Purchase)
def handle_purchase(sender, created, instance, **kwargs):
    if not created:
        return
    # defer to purchases/services for atomic transaction
    process_purchase(instance)