from rest_framework.routers import DefaultRouter
from credit_sales.views import CreditSaleViewSet
from django.urls import path

router = DefaultRouter()
router.register(r'credit_sales', CreditSaleViewSet)

urlpatterns = router.urls