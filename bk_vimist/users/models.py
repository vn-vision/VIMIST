from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser, Group, Permission

class User(AbstractUser):
    # add additional fields in here
    ROLE_CHOICES = (
        ('Admin', 'Admin'),
        ('Manager', 'Manager'),
        ('Cashier', 'Cashier'),
        ('Customer', 'Customer'),
    )
    role = models.CharField(choices=ROLE_CHOICES, max_length=10, default='Customer')

    groups = models.ManyToManyField(
        Group,
        related_name='vm_user_set',  # Change this to something unique
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='vm_user_permissions',  # Change this to something unique
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def __str__(self):
        return self.username