from rest_framework import viewsets, permissions
from customers.models import Customer
from customers.serializer import CustomerSerializer
from customers.pagination import CustomersPagination
from customers.filters import CustomerFilter
from django_filters.rest_framework import DjangoFilterBackend
# custom permissions to apply to the viewset
# from users.mixins import RoleBasedAccessMixin
from rest_framework.response import Response
from credit_sales.models import Credit_Sale
from sales.models import Sale
from django.db.models import Count, Sum

# Create your views here.
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all().order_by('id')
    serializer_class = CustomerSerializer

    # Pagination
    pagination_class = CustomersPagination

    # Filters
    filter_backends = (DjangoFilterBackend,)
    filterset_class = CustomerFilter

    permission_classes = [permissions.AllowAny,]

    # method to get the customers in debt
    def customers_in_debt(self, request):
        customers_in_debt = Credit_Sale.objects.filter(outstanding_balance__gt=0).values('customer__name', 'outstanding_balance')
        return Response({'customers in debt': list(customers_in_debt)})
    
    # get the top customers by frequency of purchases and total amount spent
    def top_customers(self, request):
        top_customers = Sale.objects.values('customer__name').annotate(total_purchases=Count('customer'), total_amount=Sum('total_price')).order_by('-total_purchases', '-total_amount')
        return Response({'top customers': list(top_customers)})
    
    # get customer behaviour and purchase patterns: Frequency of purchases, total amount spent, and average amount spent
    def customer_behaviour(self, request):
        customer_behaviour = Sale.objects.values('customer__name').annotate(total_purchases=Count('customer'), total_amount=Sum('total_price'), average_amount=Sum('total_price')/Count('customer')).order_by('-total_purchases', '-total_amount')
        return Response({'customer behaviour': list(customer_behaviour)})