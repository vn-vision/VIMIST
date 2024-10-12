from rest_framework import viewsets
from credit_sales.models import Credit_Sale
from credit_sales.serializer import CreditSaleSerializer
from credit_sales.pagination import CreditSalesPagination
from credit_sales.filters import CreditSaleFilter
from django_filters.rest_framework import DjangoFilterBackend
# custom permissions to apply to the viewset
from users.mixins import RoleBasedAccessMixin

# Create your views here.
class CreditSaleViewSet(viewsets.ModelViewSet, RoleBasedAccessMixin):
    queryset = Credit_Sale.objects.all()
    serializer_class = CreditSaleSerializer

    # Pagination
    pagination_class = CreditSalesPagination

    # Filters
    filter_backends = (DjangoFilterBackend,)
    filterset_class = CreditSaleFilter