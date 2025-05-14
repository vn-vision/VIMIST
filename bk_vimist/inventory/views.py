from rest_framework import viewsets
from inventory.models import Product
from inventory.serializer import ProductSerializer
from inventory.pagination import CustomPagination
from django_filters.rest_framework import DjangoFilterBackend
from inventory.filters import ProductFilter
from rest_framework.response import Response
from django.db.models import F, Sum
from django.utils.timezone import now
from datetime import timedelta
# Custom permissions to apply to the viewset
from users.mixins import RoleBasedAccessMixin
# Create your views here.
class ProductViewSet(viewsets.ModelViewSet, RoleBasedAccessMixin):
    """
    Provides the basic CRUD operations out of the box
    """
    # Defines the data that all ViewSet will operate on
    queryset = Product.objects.all().order_by('id')

    # define which serializer tp use for data validation and serialization
    serializer_class = ProductSerializer

    # define the pagination class to use
    pagination_class = CustomPagination

    # define the filter class to use
    filter_backends = [DjangoFilterBackend]

    # define the filter class to use
    filterset_class = ProductFilter

    # methods for reports and other custom actions
    def stock_levels(self, request):
        """
        Returns the stock levels of all products
        """
        # get the stock levels
        all_products = Product.objects.all().values('name', 'category', 'quantity_in_stock')
        low_stock = Product.objects.filter(quantity_in_stock__lte=F('reorder_level')).values('name', 'category', 'quantity_in_stock')
        out_of_stock = Product.objects.filter(quantity_in_stock=0).values('name', 'category', 'quantity_in_stock')

        # create a dictionary to hold the stock levels
        stock_levels = {
            'all_products': list(all_products),
            'low_stock': list(low_stock),
            'out_of_stock': list(out_of_stock)
        }
        # return the stock levels
        return Response(stock_levels)
    
    
    def inventory_valuation(self, request):
        """
        Returns the total value of the inventory
        """
        # get the total value for each item in the inventory
        total_value = Product.objects.annotate(total_value=F('quantity_in_stock') * F('unit_price')).values('name', 'category', 'total_value')
        # get the total value of the inventory
        inventory_value = Product.objects.aggregate(total_value=Sum(F('quantity_in_stock') * F('unit_price')))['total_value']

        # dictionary to hold the total value of the inventory
        total_value = {
            'total_prod_value': list(total_value),
            'inventory_value': inventory_value,
        }
        # return the total value of the inventory
        return Response(total_value)
    

    def inventory_trend(self, request):
        """
        Returns the inventory trend
        List items that have sold most and least
        By checking frequency of sales of each product
        """
        # get the most sold products
        current_date = now().date()

        # 30 days threshold for goods sold
        days_threshold = 30

        slow_moving = Product.objects.filter(updated_at__gte=current_date - timedelta(days=days_threshold)).values('name', 'category', 'quantity_in_stock')

        # create a dictionary to hold the stock levels
        inventory_trend = {
            'slow_moving': list(slow_moving),
        }
        # return the inventory trend
        return Response(inventory_trend)