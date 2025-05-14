from rest_framework.routers import DefaultRouter
from sales.views import SaleViewSet
from django.urls import path



router = DefaultRouter()
router.register(r'sales', SaleViewSet)

urlpatterns = router.urls

urlpatterns += [
    path('total_sales/', SaleViewSet.as_view({'get': 'total_sales'})),
    path('best_selling_products/', SaleViewSet.as_view({'get': 'best_selling_products'})),
    path('best_selling_categories/', SaleViewSet.as_view({'get': 'best_selling_categories'})),
    path('peak_sales/', SaleViewSet.as_view({'get': 'peak_sales'})),
    path('payment_method/', SaleViewSet.as_view({'get': 'payment_method'})),
]