"""
tells python how to format data into json data for api
"""

from rest_framework import serializers
from inventory.models import Product


class ProductSerializer(serializers.ModelSerializer):
    """
    convert Product data into json
    """
    class Meta:
        model = Product
        fields = '__all__'