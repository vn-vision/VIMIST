from rest_framework import viewsets
from purchases.models import Purchases
from purchases.serializer import PurchaseSerializer

# Create your views here.
class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchases.objects.all()
    serializer_class = PurchaseSerializer