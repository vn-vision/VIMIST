from rest_framework import viewsets, status
# from rest_framework.permissions import AllowAny
from payments.models import Payment
from payments.serializer import PaymentSerializer
from payments.pagination import PaymentsPagination
from payments.filters import PaymentFilter
from django_filters.rest_framework import DjangoFilterBackend
from users.permissions import IsAdmin, IsManager, IsCashier, IsCustomer
# custom permissions to apply to the viewset
from users.mixins import RoleBasedAccessMixin
from purchases.models import Purchases
from sales.models import Sale
from rest_framework.response import Response
from django.db.models import F
from.mpesa import MpesaAPI
from rest_framework.decorators import action

# Create your views here.
class PaymentViewSet(viewsets.ModelViewSet, RoleBasedAccessMixin):
    queryset = Payment.objects.all().order_by('id')
    serializer_class = PaymentSerializer

    # Pagination
    pagination_class = PaymentsPagination

    # Filters 
    filter_backends = (DjangoFilterBackend,)
    filterset_class = PaymentFilter


    # get the customer who made the payment, product, the amount paid and payment method
    def payment_details(self, request, payment_id):
        try:
            payment = Payment.objects.get(id=payment_id)
            if payment.payment_for == 'Sale':
                sale = Sale.objects.get(id=payment.related)
                Sales_Payment = {
                    'customer': sale.customer.name,
                    'product': sale.product.name,
                    'amount_paid': payment.amount_paid,
                    'payment_method': payment.payment_method
                }
                return Response(Sales_Payment)
            elif payment.payment_for == 'Purchase':
                purchase = Purchases.objects.get(id=payment.related)
                Purchases_payment = {
                    'supplier': purchase.supplier,
                    'product': purchase.product.name,
                    'amount_paid': payment.amount_paid,
                    'payment_method': payment.payment_method
                }
                return Response(Purchases_payment)
            else:
                return Response({'error': 'Unknown Payment Type'}, status=404)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=404)
        except (Sale.DoesNotExist, Purchases.DoesNotExist):
            return Response({'error': 'Related object not found'}, status=404)
        

    # get pending payments
    def pending_payments(self, request, payment_id):
        try:
            payment = Payment.objects.get(id=payment_id)
            if payment.payment_for == 'Sale':
                sale = Sale.objects.get(id=payment.related)
                balance = sale.total_price - payment.amount_paid
                return Response({
                    'customer': sale.customer.name,
                    'product': sale.product.name,
                    'amount_paid': payment.amount_paid,
                    'balance': balance,
                    'payment_method': payment.payment_method
                    })
            elif payment.payment_for == 'Purchase':
                purchase = Purchases.objects.get(id=payment.related)
                balance = (purchase.purchase_price * purchase.quantity_purchased) - payment.amount_paid
                return Response({
                    'supplier': purchase.supplier,
                    'product': purchase.product.name,
                    'amount_paid': payment.amount_paid,
                    'balance': balance,
                    'payment_method': payment.payment_method
                    })
            else:
                return Response({'error': 'Unknown Payment Type'}, status=404)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=404)
        except (Sale.DoesNotExist, Purchases.DoesNotExist):
            return Response({'error': 'Related object not found'}, status=404)
    
    # initiate mpesa payment
    @action(detail=False, methods=["post"])
    def initiate_mpesa_payment(self, request):
        phone_number = request.data.get("phone_number")
        amount = request.data.get("amount")
        
        if not amount or not phone_number:
            return Response({"error": "Phone number and amount are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        mpesa_api = MpesaAPI()
        response = mpesa_api.stk_push(phone_number, amount)
        return Response(response)