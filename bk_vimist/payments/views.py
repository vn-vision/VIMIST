from rest_framework import viewsets
from payments.models import Payment
from payments.serializer import PaymentSerializer
from payments.pagination import PaymentsPagination
from payments.filters import PaymentFilter
from django_filters.rest_framework import DjangoFilterBackend
# Create your views here.
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    # Pagination
    pagination_class = PaymentsPagination

    # Filters 
    filter_backends = (DjangoFilterBackend,)
    filterset_class = PaymentFilter