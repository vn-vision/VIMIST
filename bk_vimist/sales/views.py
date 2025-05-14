from rest_framework import viewsets
from sales.serializer import SaleSerializer
from sales.models import Sale
from sales.pagination import SalesPagination
from sales.filters import SaleFilter
from django_filters.rest_framework import DjangoFilterBackend
# custom permissions to apply to the viewset
from users.mixins import RoleBasedAccessMixin
from django.db.models import Sum
from django.db.models.functions import TruncDay, TruncMonth, TruncYear
from rest_framework.response import Response

# Create your views here.
class SaleViewSet(viewsets.ModelViewSet, RoleBasedAccessMixin):
    """
    create view for the sale app
    """
    queryset = Sale.objects.all().order_by('id')
    serializer_class = SaleSerializer

    # custom pagination
    pagination_class = SalesPagination

    # custom filter
    filter_backends = (DjangoFilterBackend,)
    filterset_class = SaleFilter


    # method to get total sales for a day, month or year
    def total_sales(self, request, *args, **kwargs):
        """
        get total sales for a day, month or year
        """
        sales_by_day = Sale.objects.annotate(day=TruncDay('sale_date')).values('day').annotate(total_amount=Sum('total_price')).order_by('day')
        sales_by_month = Sale.objects.annotate(month=TruncMonth('sale_date')).values('month').annotate(total_amount=Sum('total_price')).order_by('month')
        sales_by_year = Sale.objects.annotate(year=TruncYear('sale_date')).values('year').annotate(total_amount=Sum('total_price')).order_by('year')

        total_sales = {
            'by_day': list(sales_by_day),
            'by_month': list(sales_by_month),
            'by_year': list(sales_by_year)
        }

        return Response(total_sales)
    

    # method tp check which goods sell most and least
    def best_selling_products(self, request, *args, **kwargs):
        """
        get best selling products
        """
        best_selling_products = Sale.objects.values('product__name').annotate(total_quantity_sold=Sum('quantity_sold')).order_by('-total_quantity_sold')
        least_selling_products = Sale.objects.values('product__name').annotate(total_quantity_sold=Sum('quantity_sold')).order_by('total_quantity_sold')

        best_selling = {
            'best_selling_products': list(best_selling_products),
            'least_selling_products': list(least_selling_products)
        }

        return Response(best_selling)
    

    # group by category the sales that sell most and least
    def best_selling_categories(self, request, *args, **kwargs):
        """
        get best selling categories
        """
        best_selling_categories = Sale.objects.values('product__category').annotate(total_quantity_sold=Sum('quantity_sold')).order_by('-total_quantity_sold')
        least_selling_categories = Sale.objects.values('product__category').annotate(total_quantity_sold=Sum('quantity_sold')).order_by('total_quantity_sold')

        best_selling = {
            'best_selling_categories': list(best_selling_categories),
            'least_selling_categories': list(least_selling_categories)
        }

        return Response(best_selling)
    

    # group sales by time period: identify peak and off-peak sales time: time of day, day of week, month of year
    def peak_sales(self, request, *args, **kwargs):
        """
        get peak and off peak sales
        """
        peak_sales_by_time = Sale.objects.annotate(hour=TruncDay('created_at')).values('hour').annotate(total_sales=Sum('total_price')).order_by('-total_sales')
        off_peak_sales_by_time = Sale.objects.annotate(hour=TruncDay('created_at')).values('hour').annotate(total_sales=Sum('total_price')).order_by('total_sales')

        peak_sales = {
            'peak_sales_by_time': list(peak_sales_by_time),
            'off_peak_sales_by_time': list(off_peak_sales_by_time)
        }

        return Response(peak_sales)
    

    # group by payment method to identify which payment method is most preferred
    def payment_method(self, request, *args, **kwargs):
        """
        get payment method
        """
        payment_method = Sale.objects.values('payment_type').annotate(total_sales=Sum('total_price')).order_by('-total_sales')

        return Response(payment_method)