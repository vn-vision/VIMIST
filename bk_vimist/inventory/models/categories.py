from django.db import models
from core.models.mixins import TimestampedModel


class Category(TimestampedModel):
    '''
    Categories store id and category name of products e.g 1 - Cereals
    '''
    name = models.CharField(max_length=150)

    class Meta:
        db_table = 'category'
    
    def __str__(self):
        return f"Category ({self.name})"