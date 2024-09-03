from rest_framework import viewsets
from customers.models import Customer
from customers.serializer import CustomerSerializer
from customers.pagination import CustomersPagination
from customers.filters import CustomerFilter
from django_filters.rest_framework import DjangoFilterBackend

# Create your views here.
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    # Pagination
    pagination_class = CustomersPagination

    # Filters
    filter_backends = (DjangoFilterBackend,)
    filterset_class = CustomerFilter