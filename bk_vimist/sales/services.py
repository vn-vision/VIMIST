from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from inventory.models import Inventory
from payments.models import Payment
from credit.models import CreditAccount, CreditTransaction
from notifications.models import Notification

from .models import Sale

def validate_credit_limit(sale):
    if sale.payment_type == 'Credit' and sale.customer:
        acct = sale.customer.credit_account
        if acct.current_balance + sale.total_amount > sale.customer.credit_limit:
            raise ValidationError("Credit limit would be exceeded")

@transaction.atomic
def process_sale(sale: Sale):
    '''
    1. Validate credit limit
    2. Decrement Inventory (atomically)
    3. Create payment or creditTransaction : mpesa,cash or credit sale
    4. trigger low-stock notification
    '''
    # credit limit validation
    validate_credit_limit(sale)

    # inventory adjustments
    for item in sale.sale_item.all():
        inv, _ = Inventory.objects.select_for_update().get_or_create(
            product=item.product,
            defaults={'quantity':0, 'created_by':sale.created_by}
        )
        if inv.quantity < item.quantity:
            raise ValidationError(f"Insufficient stock for ({item.product.name})")
        inv.quantity -= item.quantity
        inv.updated_by = sale.created_by
        inv.save(update_fields=['quantity', 'updated_by'])
    
    # Payments: Cash, Mpesa, Credit
    if sale.payment_type in ('Cash', 'Mpesa'):
        Payment.objects.create(
            amount=sale.total_amount,
            method=sale.payment_type,
            status='Pending' if sale.payment_type == 'Mpesa' else 'Success',
            sale=sale,
            reference_code=None,
            paid_at=timezone.now(),
            created_by=sale.created_by,
            updated_by=sale.created_by
        )
        # if mpesa, trigger external confirmation here ...
    else:
        acct = CreditAccount.objects.select_for_update().get(customer=sale.customer)
        acct.current_balance += sale.total_amount
        acct.updated_by = sale.created_by
        acct.save(update_fields=['current_balance', 'updated_by'])
        CreditTransaction.objects.create(
            credit_account=acct,
            sale=sale,
            amount=sale.total_amount,
            type='debit',
            transaction_at=timezone.now(),
            created_by=sale.created_by,
            updated_by=sale.created_by
        )

    # trigger low stock notification
    for item in sale.sale_item.all():
        inv = Inventory.objects.get(product=item.product)
        if inv.quantity <= item.product.reorder_level:
            Notification.objects.create(
                type='low_stock',
                payload={
                    'product_id':item.product.id,
                    'product_name':inv.product.name,
                    'current_quantity':inv.quantity
                },
                created_by=sale.created_by,
                updated_by=sale.created_by
            )