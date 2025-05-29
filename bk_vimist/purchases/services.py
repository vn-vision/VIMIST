from django.db import transaction
from django.core.exceptions import ValidationError
from django.utils import timezone

from inventory.models import Inventory
from payments.models import Payment

def calculate_total_amount(items_data):
    '''
    Calculate the quantity x cost price for each product sold
    Args:
        items_data - different products sold
    returns:
        total_amount
    '''
    return sum(item['quantity'] * float(item['cost_price']) for item in items_data)


@transaction.atomic
def process_purchase(purchase):
    '''
    1. Adjust inventory for each purchase item
    2. create payment for the purchase

    Args:
        purchase - Purchase model
    '''
    # Update invetory
    for item in purchase.purchase_item.all():
        inv, _ = Inventory.objects.select_for_update().get_or_create(
            product=item.product,
            defaults={'quantity':0, 'created_by':purchase.created_by}
        )
        inv.quantity += item.quantity
        inv.updated_by = purchase.created_by
        inv.save(update_fields=['quantity', 'updated_by'])
    
    # record payment
    Payment.objects.create(
        amount=purchase.total_amount,
        method=purchase.payment_type,
        status='Success' if purchase.payment_type == 'Cash' else 'Pending',
        purchase=purchase,
        reference_code=None,
        paid_at=timezone.now(),
        created_by=purchase.created_by,
        updated_by=purchase.updated_by
    )