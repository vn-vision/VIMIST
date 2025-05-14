from rest_framework import viewsets
from purchases.models import Purchases
from purchases.serializer import PurchaseSerializer
from purchases.filters import PurchaseFilter
from purchases.pagination import PurchasesPagination
from django_filters.rest_framework import DjangoFilterBackend
# custom permissions to apply to the viewset
from users.mixins import RoleBasedAccessMixin
from rest_framework.response import Response
from django.db.models import F, Sum
from django.db.models.functions import TruncDay, TruncMonth, TruncYear

# Create your views here.
class PurchaseViewSet(viewsets.ModelViewSet, RoleBasedAccessMixin):
    queryset = Purchases.objects.all().order_by('id')
    serializer_class = PurchaseSerializer

    # pagination
    pagination_class = PurchasesPagination

    # filter
    filter_backends = (DjangoFilterBackend,)
    filterset_class = PurchaseFilter


    # method to get total purchases over specific period
    def total_purchases(self, request):
        # get the start and end date from the request
        # daily_purchases = Purchases.objects.annotate(day=TruncDay('purchase_date')).values('day').annotate(total_purchases=F('quantity_purchased') * F('purchase_price')).values('total_purchases').order_by('day')
        
        purchases_by_day = Purchases.objects.annotate(day=TruncDay('purchase_date')).values('day').annotate(total_amount=Sum(F('quantity_purchased') * F('purchase_price'))).order_by('day')
        purchases_by_month = Purchases.objects.annotate(month=TruncMonth('purchase_date')).values('month').annotate(total_amount=Sum(F('quantity_purchased') * F('purchase_price'))).order_by('month')
        purchases_by_year = Purchases.objects.annotate(year=TruncYear('purchase_date')).values('year').annotate(total_amount=Sum(F('quantity_purchased') * F('purchase_price'))).order_by('year')

        total_purchases = {
            'by_day': list(purchases_by_day),
            'by_month': list(purchases_by_month),
            'by_year': list(purchases_by_year)
        }
        return Response(total_purchases)
    

    # purchases by supplier
    def by_supplier(self, request):
        purchases_by_supplier = Purchases.objects.values('supplier').annotate(total_purchases=F('quantity_purchased') * F('purchase_price')).values('supplier', 'total_purchases').order_by('total_purchases')
        return Response({'purchases by supplier': list(purchases_by_supplier)})
    

    # purchases by product or product category
    def by_product(self, request):
        purchases_by_product = Purchases.objects.values('product__name').annotate(total_purchases=F('quantity_purchased') * F('purchase_price')).values('product__name', 'total_purchases').order_by('total_purchases')
        purchases_by_category = Purchases.objects.values('product__category').annotate(total_purchases=F('quantity_purchased') * F('purchase_price')).values('product__category', 'total_purchases').order_by('total_purchases')
        

        purchases_by_product_category = {
            'purchases by product': list(purchases_by_product),
            'purchases by category': list(purchases_by_category)
        }

        return Response(purchases_by_product_category)
    

    # method to get total purchases over specific period
    def peak_purchases(self, request):
        # get the start and end date from the request
        peak_purchases = Purchases.objects.annotate(hour=TruncDay('created_at')).values('hour').annotate(total_purchases=Sum('quantity_purchased')).order_by('-total_purchases')
        off_peak_purchases = Purchases.objects.annotate(hour=TruncDay('created_at')).values('hour').annotate(total_purchases=Sum('quantity_purchased')).order_by('total_purchases')

        peak_purchases = {
            'peak purchases': list(peak_purchases),
            'off peak purchases': list(off_peak_purchases)
        }
        return Response(peak_purchases)
    

    # payment method used
    def payment_methods(self, request):
        payment_methods = Purchases.objects.values('payment_type').annotate(total_purchases=F('quantity_purchased') * F('purchase_price')).order_by('total_purchases')
        return Response({'payment methods': list(payment_methods)})