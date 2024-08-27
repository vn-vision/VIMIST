import logging
from purchases.models import Purchases
from inventory.models import Product
from payments.models import Payment
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from datetime import datetime

# Setup logging
logger = logging.getLogger(__name__)

@receiver(post_save, sender=Purchases)
def process_purchase(sender, instance, created, **kwargs):
    """
    Process purchases:
    Ensure the purchase is recorded in the inventory and payment records.
    """

    if created:
        try:
            with transaction.atomic():
                # Get the product instance
                item = Product.objects.select_for_update().get(pk=instance.product.pk)
                
                # Update the inventory
                item.quantity_in_stock += instance.quantity_purchased
                item.save()
                logger.info(f"Updated stock for {item.name}: {item.quantity_in_stock} units available.")

                # Record the payment for the purchase
                Payment.objects.create(
                    related=instance.pk,
                    amount_paid=instance.purchase_price,
                    payment_date=datetime.now(),
                    payment_method=instance.payment_type,
                    payment_for='Purchase'
                )
                logger.info(f"Recorded purchase payment of {instance.purchase_price} for {item.name} using {instance.payment_type}.")

        except Product.DoesNotExist:
            logger.error(f"Product with ID {instance.product.pk} does not exist. Please add it to the inventory first.")
        except Exception as e:
            logger.error(f"Purchase process failed: {e}")
            # Optionally, re-raise the exception if you want the transaction to fail.
            raise
