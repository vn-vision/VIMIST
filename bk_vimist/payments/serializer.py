from rest_framework import serializers
from payments.models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
    
    def validate_phone_number(self, value):
        if not value.startswith("254") or len(value) != 12:
            raise serializers.ValidationError("Phone format: 254XXXXXXXXX")
        return value