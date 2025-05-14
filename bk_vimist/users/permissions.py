from rest_framework.permissions import BasePermission
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from inventory.models import Product
from sales.models import Sale
from customers.models import Customer
from payments.models import Payment
from credit_sales.models import Credit_Sale
from purchases.models import Purchases
from notifications.models import Notification
from users.models import User
from config.models import Config

import logging
logger = logging.getLogger(__name__)

class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        logger.info(f"Authenticated: {request.user.is_authenticated}, Role: {request.user.role}")
        return request.user.is_authenticated and request.user.is_superadmin and request.user.role == 'Admin'
class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'Admin'

class IsManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['Admin', 'Manager']
    
class IsCashier(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['Admin', 'Manager', 'Cashier']

class IsCustomer(BasePermission):
   def has_permission(self, request, view):
       if request.method in ['GET',]:
           return request.user.is_authenticated and request.user.role == 'Customer'
       return False
   

# Define a function to set up permissions for each model
def setup_groups_and_permissions():
    # create groups
    admin_group, created = Group.objects.get_or_create(name='Admin')
    manager_group, created = Group.objects.get_or_create(name='Manager')
    cashier_group, created = Group.objects.get_or_create(name='Cashier')
    customer_group, created = Group.objects.get_or_create(name='Customer')

    # Assign Admin full permissions across all models
    for model in [Product, Sale, Customer, Payment, Credit_Sale, Purchases, Notification, User, Config ]:
        content_type = ContentType.objects.get_for_model(model)
        permissions = Permission.objects.filter(content_type=content_type)
        admin_group.permissions.add(*permissions)
    
    # assign manager permissions (add, change, view) across all models
    for model in [Product, Sale, Customer, Payment, Credit_Sale, Purchases, Notification, Config]:
        content_type = ContentType.objects.get_for_model(model)
        manager_permissions = Permission.objects.filter(content_type=content_type, codename__contains='add')|\
        Permission.objects.filter(content_type=content_type, codename__contains='change')|\
        Permission.objects.filter(content_type=content_type, codename__contains='view')
        if model == Config:
            manager_permissions = Permission.objects.filter(content_type=content_type, codename__contains='view')
        manager_group.permissions.add(*manager_permissions)

    # assign cashier permissions (view) across all models
    for model in [Product, Sale, Payment, Credit_Sale, Purchases, Notification, Config]:
        content_type = ContentType.objects.get_for_model(model)
        cashier_permissions = Permission.objects.filter(content_type=content_type, codename__contains='view')
        cashier_group.permissions.add(*cashier_permissions)
    
    # assign customer permissions (public view) across all models
    for model in [Product, Sale, Payment, Credit_Sale, Purchases, Notification,Config]:
        content_type = ContentType.objects.get_for_model(model)
        customer_permissions = list(Permission.objects.filter(content_type=content_type, codename__contains='view'))
        # give customer permission to make a purchase on an item(sales) as well as modify customer list
        if model in [Sale, Payment]:
            customer_permissions += list(Permission.objects.filter(content_type=content_type, codename__startswith='add_'))
        customer_group.permissions.add(*customer_permissions)