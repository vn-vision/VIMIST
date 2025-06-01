from django.db import transaction
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import User
from credit.models import CreditAccount
from notifications.models import Notification
from .middleware import get_current_user
from django.contrib.auth.models import Group
from core.constants import ROLE_GROUP_MAP


@receiver(pre_save)
def set_audit_fields(sender, instance, **kwargs):
    user = get_current_user()
    if not user or not hasattr(instance, 'updated_by'):
        return
    if instance._state.adding and hasattr(instance, 'created_by'):
        instance.created_by = user
    instance.updated_by = user

@receiver(post_save, sender=User)
def assign_group_permissions(sender, instance, created, **kwargs):
    if not created:
        return
    group, _= Group.objects.get_or_create(name=instance.role)
    instance.groups.add(group)
    # permissions can be assigned to the group via a data

# @receiver(post_save, sender=User)
# def create_credit_account_and_notify(sender, instance, created, **kwargs):
#     if not created:
#         return
    
#     #. create a credit account for new users
#     CreditAccount.objects.create(
#         customer = instance.id,
#         current_balance=0,
#         status='active',
#         created_by=instance,
#         updated_by=instance
#     )

    # create a welcome notification
    Notification.objects.create(
        type='system_alert',
        payload={'message':'Welcome to Vimist! Your account is ready'}
    )