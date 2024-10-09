from rest_framework import viewsets
from sales.serializer import SaleSerializer
from sales.models import Sale

# Create your views here.
class SaleViewSet(viewsets.ModelViewSet):
    """
    create view for the sale app
    """
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
