from django.contrib.auth.models import Group
from django.db.models.signals import post_save, post_migrate
from django.dispatch import receiver
from users.models import User
from django.apps import apps
from users.permissions import setup_groups_and_permissions

# Map the role to the group name
ROLE_GROUP_MAP = {
    'Customer': 'Customer',
    'Manager': 'Manager',
    'Cashier': 'Cashier',
    'Admin': 'Admin'
}

@receiver(post_save, sender=User)
def add_user_to_group(sender, instance, created, **kwargs):
    if created:
        # Check if the user has a role
        user_role = getattr(instance, 'role', None)
        if user_role and user_role in ROLE_GROUP_MAP:
            # Get or create the group
            group, created = Group.objects.get_or_create(name=ROLE_GROUP_MAP[user_role])
            # Add the user to the group
            instance.groups.add(group)

# function is only called when the app is ready
def setup_groups_and_permissions_handler(sender, **kwargs):
    if apps.ready:
        setup_groups_and_permissions()

# Connect the function to the ready signal
post_migrate.connect(setup_groups_and_permissions_handler)