from django.dispatch import receiver
from django.db.models.signals import post_save

from payments.models import Payment
from .services import apply_credit_payment

@receiver(post_save, sender=Payment)
def on_credit_payment(sender, instance: Payment, created, **kwargs):
    '''
    Whenever a payment linked to a credit account is saved with status='success'
    apply it to the credit account
    '''
   
    if instance.credit_account and instance.status == 'Success':
        # ensure it's triggered once
        if not instance.applied_to_credit:
            apply_credit_payment(instance)