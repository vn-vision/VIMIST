"""
convert to json format
"""
from rest_framework import serializers
from credit_sales.models import Credit_Sale


class CreditSaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Credit_Sale
        fields = '__all__'
