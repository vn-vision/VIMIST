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

router = DefaultRouter()
router.register(r"customers", CustomerViewSet)

urlpatterns = router.urls