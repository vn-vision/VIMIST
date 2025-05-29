from django.db import transaction
from django.core.exceptions import ValidationError
from django.utils import timezone

from .models import CreditAccount, CreditTransaction
from payments.models import Payment
from notifications.models import Notification

@transaction.atomic
def apply_credit_payment(payment: Payment):
    '''
    Apply an on-account payment to the customer's credit balance.
    Args:
        payment - Payment model
    '''
    # ensure this is indeed a credit_account payment: not sale/purchase
    acct = payment.credit_account
    if not acct:
        raise ValidationError("Payment is not linked to a credit account")
    
    # lock the account row fow updates
    acct = CreditAccount.objects.select_for_update().get(pk=acct.pk)

    # decrease account balance by amount paid
    new_balance = acct.current_balance - payment.amount
    if new_balance < 0:
        raise ValidationError('Payment exceeds outstanding balance')
    acct.current_balance = new_balance
    acct.status = 'closed' if new_balance == 0 else 'active'
    acct.updated_by = payment.updated_by
    acct.save(update_fields=['current_balance', 'status', 'updated_by'])

    # create ledger entry
    CreditTransaction.objects.create(
        credit_account=acct,
        payment=payment,
        amount=payment.amount,
        type='credit',
        transaction_at=timezone.now(),
        created_by=payment.created_by,
        updated_by=payment.updated_by
    )

    # notify
    Notification.objects.create(
        type='overdue_payment' if new_balance > 0 else 'system_alert',
        payload={
            'credit_account_id':acct.pk,
            'new_balance':str(new_balance),
            'message':(
                "Payment received. Balance is now KES"
                f"{new_balance:.2f}."
            )
        },
        created_by=payment.created_by,
        updated_by=payment.updated_by
    )