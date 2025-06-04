from rest_framework.routers import DefaultRouter
from django.urls import path, include
from credit.views import CreditAccountViewSet, CreditTransactionViewSet

router = DefaultRouter()

router.register('credit-accounts', CreditAccountViewSet, basename='credit-account')
router.register('credit-transactions', CreditTransactionViewSet, basename='credit-transaction')

urlpatterns = [
    path('', include(router.urls))
]