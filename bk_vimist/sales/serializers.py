from rest_framework import serializers
from sales.models import Sale, SaleItem
from inventory.models import Product
from sales.services import process_sale


class SaleItemSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        queryset = Product.objects.all(), source='Product'
    )
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = SaleItem
        fields = ['id', 'product_id', 'product_name', 'quantity', 'unit_price', 'total_price']
        read_only = ['total_price'] # computed  = quantity * unit price


class SaleSerializer(serializers.ModelSerializer):
    sale_item = SaleItemSerializer(many=True)
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())
    total_amount = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = Sale
        fields = ['id', 'customer', 'payment_type', 'sale_datetime', 'sale_item', 'total_amount', 'created_by']
        read_only_fields = ['sale_datetime', 'total_amount']
    
    
    def create(self, validated_data):
        items_data = validated_data('sale_item')
        user = validated_data['created_by']

        # computed total_amount
        total = sum(item['quantity'] * float(item['unit_price']) for item in items_data)
        validated_data['total_amount'] = total

        # create parent sale
        sale = Sale.objects.create(**validated_data)

        # create saleItem lines
        for item in items_data:
            total_price = item['quantity'] * item['unit_price']
            SaleItem.objects.create(
                sale=sale,
                product=item['product'],
                quantity=item['quantity'],
                unit_price=item['unit_price'],
                total_price=total_price,
                created_by=user,
                updated_by=user
            )
        
        # call service to: update inventory, create, payment/credit send notifications
        process_sale(sale)
        return sale