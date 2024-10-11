from rest_framework import viewsets
from sales.serializer import SaleSerializer
from sales.models import Sale
from sales.pagination import SalesPagination
from sales.filters import SaleFilter
from django_filters.rest_framework import DjangoFilterBackend


# Create your views here.
class SaleViewSet(viewsets.ModelViewSet):
    """
    create view for the sale app
    """
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

    # custom pagination
    pagination_class = SalesPagination

    # custom filter
    filter_backends = (DjangoFilterBackend,)
    filterset_class = SaleFilter

