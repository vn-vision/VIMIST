from rest_framework.routers import DefaultRouter
from credit_sales.views import CreditSaleViewSet
from django.urls import path

router = DefaultRouter()
router.register(r'credit_sales', CreditSaleViewSet)

urlpatterns = router.urls
urlpatterns += [
    path('outstanding_credit_sales/', CreditSaleViewSet.as_view({'get': 'outstanding_credit_sales'})),
    path('debt_trend/', CreditSaleViewSet.as_view({'get': 'debt_trend'})),
]