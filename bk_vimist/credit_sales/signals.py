from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Credit_Sale
from config.models import Config
from notifications.models import Notification
from datetime import date
import logging

logger = logging.getLogger(__name__)

@receiver(pre_save, sender=Credit_Sale)
def top_up_reminder(sender, instance, **kwargs):
    """Send notifications and handle credit sale logic based on thresholds and outstanding balances."""
    
    # Set a default threshold if it isn't configured
    threshold = 500  
    try:
        # Attempt to retrieve the threshold from the configuration model
        threshold = Config.objects.get(key_name='credit_threshold').value
    except Config.DoesNotExist:
        logger.warning("Credit threshold config not found. Using default threshold: 500")
    
    # Get the last credit sale for this customer
    last_sale = Credit_Sale.objects.filter(customer=instance.customer).order_by('-created_at').first()

    # Check if the last outstanding balance exceeds the threshold
    if last_sale and last_sale.outstanding_balance > threshold:
        # Send a notification regarding the high outstanding balance
        Notification.objects.create(
            type='Top-Up Reminder',
            message=f"Customer {instance.customer.id} has an outstanding balance above {threshold}"
        )
        # Calculate the new outstanding balance
        instance.outstanding_balance = last_sale.outstanding_balance + instance.total_credit
        
        raise ValueError(f"Balance goes beyond the set threshold {threshold}")
    else:
        # This is the first credit sale for the customer
        instance.outstanding_balance = instance.total_credit

    # Check if the balance is overdue
    if instance.outstanding_balance > 0 and instance.due_date < date.today():
        # Send a notification about overdue payment
        Notification.objects.create(
            type='Payment Due',
            message=f"Overdue payment for customer {instance.customer.id}. Please follow up."
        )

