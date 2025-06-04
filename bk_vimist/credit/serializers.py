from rest_framework import serializers
from credit.models import CreditAccount, CreditTransaction


class CreditAccountSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    current_balance = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = CreditAccount
        fields = [
            'id', 'customer', 'customer_name', 'current_balance', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'customer_name', 'current_balance', 'status', 'created_at', 'updated_at'
        ]
    
class CreditTransactionSerializer(serializers.ModelSerializer):
    credit_account_id = serializers.IntegerField(source='credit_account.id', read_only=True)
    transaction_type = serializers.CharField(source='type') # debit or credit
    sale_id = serializers.IntegerField(source='sale.id', read_only=True)
    payment_id = serializers.IntegerField(source='payment.id', read_only=True)

    class Meta:
        model = CreditTransaction
        fields = [
            'id', 'credit_account_id', 'transaction_type', 'amount',
            'transaction_at', 'sale_id', 'payment_id', 'created_at'
        ]
        read_only_fields = fields