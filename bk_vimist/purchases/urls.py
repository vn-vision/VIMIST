from rest_framework.routers import DefaultRouter
from purchases.views import PurchaseViewSet
from django.urls import path

router = DefaultRouter()
router.register(r'purchases', PurchaseViewSet)

urlpatterns = router.urls

urlpatterns += [
    path('total_purchases/', PurchaseViewSet.as_view({'get': 'total_purchases'})),
    path('purchases_by_supplier/', PurchaseViewSet.as_view({'get': 'by_supplier'})),
    path('purchases_by_product/', PurchaseViewSet.as_view({'get': 'by_product'})),
    path('peak_purchases/', PurchaseViewSet.as_view({'get': 'peak_purchases'})),
    path('payment_methods/', PurchaseViewSet.as_view({'get': 'payment_methods'})),
]