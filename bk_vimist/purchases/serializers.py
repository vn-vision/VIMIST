from rest_framework import serializers
from purchases.models import PurchaseItem, Purchase
from inventory.models import Product
from purchases.services import process_purchase


class PurchaseItemSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product'
    )
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = PurchaseItem
        fields = ['id', 'product_id', 'product_name', 'quantity', 'cost_price']


class PurchaseSerializer(serializers.ModelSerializer):
    purchase_item = PurchaseItemSerializer(many=True)
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True) # computed automatically

    class Meta:
        model = Purchase
        fields = ['id', 'supplier', 'purchase_datetime', 'payment_type', 'purchase_item', 'total_amount', 'created_by']
        read_only_fields = ['purchase_datetime', 'total_amount']
    
    def create(self, validated_data):
        items_data = validated_data.pop('purchase_item')
        user = validated_data.get('created_by')
        # computed total amount
        total = sum(item['quantity']* item['cost_price'] for item in items_data)
        validated_data['total_amount'] = total

        # create parent Purchase instance
        purchase = Purchase.objects.create(**validated_data)
        # create children: PurchaseItems rows
        for item in items_data:
            PurchaseItem.objects.create(
                purchase=purchase,
                product=item['product'],
                quantity=item['quantity'],
                cost_price=item['cost_price'],
                created_by=user,
                updated_by=user
            )

        # send to services: update inventory + record payment
        process_purchase(purchase)
        return purchase