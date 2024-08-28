from rest_framework import viewsets
from inventory.models import Product
from inventory.serializer import ProductSerializer


# Create your views here.
class ProductViewSet(viewsets.ModelViewSet):
    """
    Provides the basic CRUD operations out of the box
    """
    # Defines the data that all ViewSet will operate on
    queryset = Product.objects.all()

    # define which serializer tp use for data validation and serialization
    serializer_class = ProductSerializer