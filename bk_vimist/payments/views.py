from rest_framework import viewsets
from payments.models import Payment
from payments.serializer import PaymentSerializer

# Create your views here.
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer