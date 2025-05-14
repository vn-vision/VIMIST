"""
This script handles reorder_stock and restocked triggers
he signals are an alternative to the triggers that:
send notification when stocks are low and afer restock
"""
from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Product
from notifications.models import Notification
import logging


# setup logger
logger = logging.getLogger(__name__)

@receiver(pre_save, sender=Product)  # BEFORE UPDATE
def check_stock_levels(sender, instance, **kwargs):

    previous = None

    # check if product already exists
    if instance.pk:
        try:
            previous = Product.objects.get(pk=instance.pk)
        except Product.DoesNotExist:
            # Product remains none
            logger.info(f"Product {instance.pk} does not exist.")
            previous = None
            return
    
    # trigger for low stock (similar to reorder_stock)
    if instance.quantity_in_stock <= instance.reorder_level:
        Notification.objects.create(
            type='Reorder Stock',
            message=f"Reorder stock for {instance.name}"
        )
        Notification.objects.create(
            type='Low Stock',
            message=f"{instance.name}'s stock is low"
        )
    
    # trigger for restocked (similar to restocked)
    if previous and instance.quantity_in_stock > instance.reorder_level \
        and instance.quantity_in_stock > previous.quantity_in_stock:
        Notification.objects.create(
            type="Restocked",
            message=f"Restocked order for {instance.name}"
        )
    elif not previous:
        logger.info(f"Adding new stock for {instance.name}")