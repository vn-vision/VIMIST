from rest_framework import serializers
from customers.models import Customer

# setup serializer
class CustomerSerializer(serializers.ModelSerializer):
    """
    convert Customer model info into json format
    """
    class Meta:
        model = Customer # get all info on Customers
        fields = '__all__'