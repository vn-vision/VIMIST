"""
This setup will automatically create the following endpoints:
    GET /api/customers/: List all customers.
    POST /api/customers/: Create a new customer.
    GET /api/customers/{id}/: Retrieve a specific customer by ID.
    PUT /api/customers/{id}/: Update a specific customer by ID.
    DELETE /api/customers/{id}/: Delete a specific customer by ID.
"""
from rest_framework.routers import DefaultRouter
from customers.views import CustomerViewSet
from django.urls import path

router = DefaultRouter()
router.register(r"customers", CustomerViewSet)

urlpatterns = router.urls
urlpatterns += [
    path('customers_in_debt/', CustomerViewSet.as_view({'get': 'customers_in_debt'}), name='customers_in_debt'),
    path('top_customers/', CustomerViewSet.as_view({'get': 'top_customers'}), name='top_customers'),
    path('customer_behaviour/', CustomerViewSet.as_view({'get': 'customer_behaviour'}), name='customer_behaviour'),
]