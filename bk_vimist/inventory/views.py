from rest_framework import viewsets
from inventory.models import Product
from inventory.serializer import ProductSerializer
from inventory.pagination import CustomPagination
from django_filters.rest_framework import DjangoFilterBackend
from inventory.filters import ProductFilter

# Create your views here.
class ProductViewSet(viewsets.ModelViewSet):
    """
    Provides the basic CRUD operations out of the box
    """
    # Defines the data that all ViewSet will operate on
    queryset = Product.objects.all()

    # define which serializer tp use for data validation and serialization
    serializer_class = ProductSerializer

    # define the pagination class to use
    pagination_class = CustomPagination

    # define the filter class to use
    filter_backends = [DjangoFilterBackend]

    # define the filter class to use
    filterset_class = ProductFilter