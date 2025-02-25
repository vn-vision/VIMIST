from rest_framework.routers import DefaultRouter
from payments.views import PaymentViewSet
from django.urls import path


router = DefaultRouter()
router.register(r'payments', PaymentViewSet)

urlpatterns = router.urls
urlpatterns += [
    path('payment_details/<int:payment_id>', PaymentViewSet.as_view({'get': 'payment_details'})),
    path('pending_payments/<int:payment_id>', PaymentViewSet.as_view({'get': 'pending_payments'})),
    path("mpesa/initiate/", PaymentViewSet.as_view({"post":"initiate_mpesa_payment"}), name="mpesa-initiate")
]