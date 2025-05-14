# config/models.py
from django.db import models
from time import timezone
class Config(models.Model):
    system_name = models.CharField(max_length=100)
    logo = models.ImageField(default='fallback.png', upload_to='images/', blank=True, null=True)
    primary_color = models.CharField(max_length=7, help_text="Hex color code (e.g. #FF5733)")
    secondary_color = models.CharField(max_length=7, help_text="Hex color code (e.g. #FF5733)")
    threshold = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.system_name