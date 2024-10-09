import logging
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.db import transaction
from .models import Sale
from inventory.models import Product
from credit_sales.models import Credit_Sale
from payments.models import Payment
from datetime import datetime
from config.models import Config

# Setup logging
logger = logging.getLogger(__name__)

@receiver(pre_save, sender=Sale)
def calculate_total_price(sender, instance, **kwargs):
    """
    Pre-save signal to calculate the total price for a sale
    based on the product's unit price and the quantity sold.
    """
    logger.info("Pre-save signal triggered for Sale.")
    try:
        product = Product.objects.get(pk=instance.product.pk)
        instance.total_price = instance.quantity_sold * product.unit_price
        logger.info(f"Total price for {product.name}: {instance.total_price}")
    except Product.DoesNotExist:
        logger.error(f"Product with id {instance.product.pk} not found.")
        raise ValueError("Product not found. Sale cannot be processed.")

def get_credit_threshold():
    """
    Helper function to retrieve the credit threshold from the Config model.
    If not found, returns a default value of 500.
    """
    default_threshold = 500
    try:
        threshold = Config.objects.get(key_name='credit_threshold').value
        logger.info(f"Credit threshold retrieved: {threshold}")
        return threshold
    except Config.DoesNotExist:
        logger.warning("Credit threshold config not found. Using default threshold: 500")
        return default_threshold

def exceeds_credit_threshold(customer, new_credit):
    """
    Helper function to check if the customer's total outstanding balance
    (including the new sale) exceeds the credit threshold.
    
    Args:
        customer: The customer making the purchase.
        new_credit: The total credit from the current sale.
    
    Returns:
        bool: True if the total balance exceeds the threshold, False otherwise.
    """
    total_outstanding = 0
    # Sum the outstanding balance from all credit sales for the customer
    credit_sales = Credit_Sale.objects.filter(customer=customer)
    
    for credit_sale in credit_sales:
        total_outstanding += credit_sale.outstanding_balance
    
    total_outstanding += new_credit
    threshold = get_credit_threshold()
    
    logger.info(f"Current outstanding balance for {customer.name}: {total_outstanding}")
    
    if total_outstanding > threshold:
        logger.error(f"Credit threshold exceeded for {customer.name}. Total balance: {total_outstanding}, Threshold: {threshold}")
        return True
    return False

@receiver(post_save, sender=Sale)
def process_sale(sender, instance, created, **kwargs):
    """
    Post-save signal to handle the sale after it's saved. This includes:
    - Reducing stock levels
    - Recording payments
    - Managing credit sales and checking the credit threshold.
    """
    if created:
        try:
            with transaction.atomic():
                # Step 1: Reduce inventory stock
                product = Product.objects.select_for_update().get(pk=instance.product.pk)
                
                if product.quantity_in_stock < instance.quantity_sold:
                    logger.error(f"Sale exceeds stock levels for {product.name}.")
                    raise ValueError(f"Sale exceeds items in stock for {product.name}.")
                
                product.quantity_in_stock -= instance.quantity_sold
                product.save()
                logger.info(f"Updated stock for {product.name}: {product.quantity_in_stock} remaining.")

                # Step 2: Handle credit sales if applicable
                if instance.payment_type == 'Credit':
                    logger.info(f"Processing credit sale for {instance.customer.name} on {product.name}.")
                    
                    # Check if the sale exceeds the credit threshold
                    if exceeds_credit_threshold(instance.customer, instance.total_price):
                        raise ValueError(f"Credit threshold exceeded for {instance.customer.name}. Sale cannot be processed.")
                    
                    # Step 3: Create or update credit sale record
                    credit_sale = Credit_Sale.objects.filter(customer=instance.customer).order_by('-created_at').first()                    
                    if credit_sale:
                        totalbalance = credit_sale.outstanding_balance
                        totalbalance += instance.total_price
                        Credit_Sale.objects.filter(customer=instance.customer).update(
                            total_credit=totalbalance,
                            outstanding_balance=totalbalance
                        )
                        logger.info(f"Updated credit sale for {instance.customer.name} on {product.name} with outstanding balance: {credit_sale.outstanding_balance}.")
                    else:
                        Credit_Sale.objects.create(
                            customer=instance.customer,
                            sale=instance,
                            total_credit=instance.total_price,
                            outstanding_balance=instance.total_price
                        )
                        logger.info(f"Created new credit sale for {instance.customer.name} on {product.name} with balance: {instance.total_price}.")

                # Step 4: Record the payment
                Payment.objects.create(
                    related=instance.pk,
                    amount_paid=instance.total_price,
                    payment_date=datetime.now(),
                    payment_method=instance.payment_type,
                    payment_for='Sale'
                )
                logger.info(f"Recorded payment of {instance.total_price} for {instance.payment_type}.")

        except ValueError as ve:
            # Handle specific ValueErrors such as exceeding the credit threshold
            logger.error(f"Error processing sale {instance.pk}: {ve}")
            raise
        except Exception as e:
            # Rollback transaction in case of unexpected errors
            logger.error(f"Unexpected error processing sale {instance.pk}: {e}")
            raise
