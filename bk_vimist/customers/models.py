from django.db import models

# This model represents the customers table schema
# It records customer details including contact information
class Customer(models.Model):
    name = models.CharField(max_length=255)
    contact_info = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
