from rest_framework import viewsets
from credit_sales.models import Credit_Sale
from credit_sales.serializer import CreditSaleSerializer

# Create your views here.
class CreditSaleViewSet(viewsets.ModelViewSet):
    queryset = Credit_Sale.objects.all()
    serializer_class = CreditSaleSerializer