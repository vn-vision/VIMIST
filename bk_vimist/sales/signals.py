import logging
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.db import transaction
from .models import Sale
from inventory.models import Product
from credit_sales.models import Credit_Sale
from payments.models import Payment
from datetime import datetime

# Setup logging
logger = logging.getLogger(__name__)

@receiver(pre_save, sender=Sale)
def record_amount_paid(sender, instance, **kwargs):
    """
    Calculate and record the amount to be paid before saving the Sale.
    """
    logger.info("Pre-save signal triggered for Sale.")
    try:
        item = Product.objects.get(pk=instance.product.pk)
        instance.total_price = instance.quantity_sold * item.unit_price
        logger.info(f"Total price for {item.name}: {instance.total_price}")
    except Product.DoesNotExist:
        logger.error(f"Product with id {instance.product.pk} not found.")
        raise ValueError("Product not found. Sale cannot be processed.")

@receiver(post_save, sender=Sale)
def process_sale(sender, instance, created, **kwargs):
    """
    After a Sale is created, reduce stock levels, record the payment, 
    and handle credit sales if applicable.
    """
    if created:
        try:
            with transaction.atomic():  # Begin the transaction

                # Reduce inventory
                item = Product.objects.select_for_update().get(pk=instance.product.pk)
                if item.quantity_in_stock < instance.quantity_sold:
                    logger.error(f"Sale exceeds items in stock for {item.name}.")
                    raise ValueError(f"Sale exceeds items in stock for {item.name}.")

                item.quantity_in_stock -= instance.quantity_sold
                item.save()
                logger.info(f"Updated stock for {item.name}: {item.quantity_in_stock} remaining.")

                # Record the payment
                Payment.objects.create(
                    related=instance.pk,
                    amount_paid=instance.total_price,
                    payment_date=datetime.now(),
                    payment_method=instance.payment_type,
                    payment_for='Sale'
                )
                logger.info(f"Recorded payment of {instance.total_price} for {instance.payment_type}.")

                # Handle credit sales
                if instance.payment_type == 'Credit':
                        # Proceed with creating the credit sale record
                        Credit_Sale.objects.create(
                            customer=instance.customer,
                            sale=instance,
                            total_credit=instance.total_price,
                        )
                        logger.info(f"Recorded credit sale of {instance.total_price} for {instance.customer.name}.")

        except ValueError as ve:
            # Handle specific ValueErrors (like exceeding credit threshold)
            logger.error(f"Error processing sale {instance.pk}: {ve}")
            raise

        except Exception as e:
            # Rollback transaction in case of any other exceptions
            logger.error(f"Unexpected error processing sale {instance.pk}: {e}")
            raise
