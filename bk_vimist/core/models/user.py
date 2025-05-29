from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager, Group, Permission
from django.db import models
from django.core.exceptions import ValidationError
from core.models.mixins import TimestampedModel


class UserManager(BaseUserManager):
    '''Custom manager for email-based authentication'''

    def create_user(self, email, password=None, role='Clerk', company=None, **extra):
        '''
        created normal users:
            must have an email
            the email is normalized to standard email format
            builds the user with email + extra fields to add later on
            and then saves this user to the db
        '''
        if not email:
            raise ValueError("Users must have an email")
        email = self.normalize_email(email).lower()
        # validate admin role uniqueness
        if role == 'Admin' and company is not None:
            if self.model.objects.filter(
                company=company, role='Admin'
            ).exists():
                raise ValidationError("Company can have only one Admin")
        user = self.model(email=email, role=role, company=company, **extra)
        user.set_password(password) # hashes passwords
        # audit fields are set via middleware by default
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password, **extra):
        '''
        creates admin users:
            gives the admin access
            and then grants all permissions to that user
            uses the the default create_user function to create the admin
        '''
        extra.setdefault('is_staff', True)
        extra.setdefault('is_superuser', True)
        extra.setdefault('role', 'Admin')
        return self.create_user(email, password=password, **extra)
    
class User(AbstractBaseUser, PermissionsMixin, TimestampedModel):
    ROLE_CHOICES = [
        ('Admin', 'Admin'), # FULL control
        ('Clerk', 'Clerk'), # basic access
        ('Manager', 'Manager'), # overall leader
        ('CreditOfficer', 'Credit Officer') # handles loans
    ]
    
    # avoid reverse accessor conflicts
    groups = models.ManyToManyField(
        Group,
        related_name = 'vimist_users',
        blank = True
    )

    user_permissions = models.ManyToManyField(
        Permission,
        related_name = 'vimist_users',
        blank = True
    )

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Clerk')
    company = models.ForeignKey('core.Company',
                                on_delete=models.CASCADE,
                                related_name='users',
                                null=True,
                                blank=True,
                                help_text='Company this tenant belongs to')
    
    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'users'
        constraints = [
            models.UniqueConstraint(
                fields=['company', 'email'],
                name='unique_company_email'
            )
        ]
    
    def clean(self):
        super().clean()
        # enforce single Admin per company
        if self.role == 'Admin' and self.company:
            qs = User.objects.filter(company=self.company, role='Admin')
            if self.pk:
                qs = qs.exclude(pk=self.pk)
            if qs.exists():
                raise ValidationError("Company can have only one Admin")
    
    def __str__(self):
        # for easier debugging
        return f"{self.email} ({self.company.subdomain if self.company else 'No Company'})"