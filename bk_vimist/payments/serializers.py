from rest_framework import serializers
from payments.models import Payment
from credit.models import CreditAccount
from django.utils import timezone

class PaymentSerializer(serializers.ModelSerializer):
    '''
    Account for credit payments (debit)
    '''
    credit_account_id = serializers.PrimaryKeyRelatedField(
        queryset=CreditAccount.objects.all(),
        source='credit_account', write_only=True
    )
    credit_account_balance = serializers.DecimalField(
        source='credit_account.current_balance',
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = Payment
        fields = [
            'id', 'amount', 'method', 'status', 'credit_account_id', 'credit_account_balance', 'reference_code', 'paid_at', 'created_at'
        ]
        read_only_fields = ['created_at', 'status', 'paid_at', 'credit_account_balance']
    
    def create(self, validated_data):
        '''
        Set status='Success' if method='Cash' else wait for Mpesa webhook to update
        '''
        payment = Payment.objects.create(
            amount=validated_data['amount'],
            method=validated_data['method'],
            status='Success' if validated_data['method'] == 'Cash' else 'Pending',
            credit_account=validated_data['credit_account'],
            reference_code=validated_data.get('reference_code'),
            paid_at=timezone.now(),
            created_by=self.context['request'].user,
            updated_by=self.context['request'].user,
        )

        return payment