from rest_framework import viewsets
from purchases.models import Purchases
from purchases.serializer import PurchaseSerializer
from purchases.filters import PurchaseFilter
from purchases.pagination import PurchasesPagination
from django_filters.rest_framework import DjangoFilterBackend

# Create your views here.
class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchases.objects.all()
    serializer_class = PurchaseSerializer

    # pagination
    pagination_class = PurchasesPagination

    # filter
    filter_backends = (DjangoFilterBackend,)
    filterset_class = PurchaseFilter