from rest_framework import serializers
from sales.models import Sale

# Serializer class to convert data to json format
class SaleSerializer(serializers.ModelSerializer):
    """
    Serialize and deserialize data into and from JSON
    """
    class Meta:
        model = Sale
        fields = '__all__'