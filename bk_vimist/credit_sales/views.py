from rest_framework import viewsets
from credit_sales.models import Credit_Sale
from credit_sales.serializer import CreditSaleSerializer
from credit_sales.pagination import CreditSalesPagination
from credit_sales.filters import CreditSaleFilter
from django_filters.rest_framework import DjangoFilterBackend
# custom permissions to apply to the viewset
from users.mixins import RoleBasedAccessMixin
from rest_framework.response import Response

# Create your views here.
class CreditSaleViewSet(viewsets.ModelViewSet, RoleBasedAccessMixin):
    queryset = Credit_Sale.objects.all()
    serializer_class = CreditSaleSerializer

    # Pagination
    pagination_class = CreditSalesPagination

    # Filters
    filter_backends = (DjangoFilterBackend,)
    filterset_class = CreditSaleFilter


    # method to get the credit sales that haven't been paid fully
    def outstanding_credit_sales(self, request):
        outstanding_credit_sales = Credit_Sale.objects.filter(outstanding_balance__gt=0).values('customer__name', 'outstanding_balance')
        return Response({'outstanding credit sales': list(outstanding_credit_sales)})
    

    # get the debt trend, that is, whether the debt is increasing or decreasing over time
    def debt_trend(self, request):
        credit_sales = Credit_Sale.objects.all()
        debt_trend = []
        for credit_sale in credit_sales:
            if credit_sale.outstanding_balance > credit_sale.previous_outstanding_balance:
                debt_trend.append({'customer': credit_sale.customer.name, 'debt_trend': 'increasing'})
            elif credit_sale.outstanding_balance < credit_sale.previous_outstanding_balance:
                debt_trend.append({'customer': credit_sale.customer.name, 'debt_trend': 'decreasing'})
            else:
                debt_trend.append({'customer': credit_sale.customer.name, 'debt_trend': 'constant'})
        return Response({'debt trend': debt_trend})
    