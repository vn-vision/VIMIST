from rest_framework import serializers
from inventory.models import Category, Product, Inventory

class CategorySerializer(serializers.ModelSerializer):
    '''
    Expose the product category: name
    '''
    class Meta:
        model = Category
        fields = ['id', 'name', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class ProductSerializer(serializers.ModelSerializer):
    '''
    Product Serializer
    '''
    category_name = serializers.CharField(source='category.name', read_only=True) # for ease of human readability
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'unit_price', 'category', 'category_name', 'reorder_level', 'created_at', 'updated_at']
        read_only = ['created_at', 'updated_at']
    

class InventorySerializer(serializers.ModelSerializer):
    '''
    Read only list and protected uodate endpoints
    '''
    product_name = serializers.CharField(source='product.name', read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Inventory
        fields = ['id', 'product', 'product_name', 'quantity', 'updated_at']
        read_only_fields = ['updated_at']