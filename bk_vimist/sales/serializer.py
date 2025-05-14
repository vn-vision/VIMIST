from rest_framework import serializers
from sales.models import Sale
from customers.models import Customer

# Serializer class to convert data to json format
class SaleSerializer(serializers.ModelSerializer):
    """
    Serialize and deserialize data into and from JSON
    """
    customer = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(),
        allow_null=True,
        required=False
    )
    class Meta:
        model = Sale
        fields = ['id', 'product', 'customer', 'quantity_sold', 'total_price', 'sale_date', 'payment_type', 'created_at', 'updated_at']
        read_only_fields = ['total_price', 'created_at', 'updated_at']