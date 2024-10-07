# config/models.py
from django.db import models

class Config(models.Model):
    key_name = models.CharField(max_length=255, unique=True)
    value = models.DecimalField(max_digits=10, decimal_places=2)