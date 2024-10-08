"""
This setup will automatically create the following endpoints:
    GET /api/products/: List all products.
    POST /api/products/: Create a new product.
    GET /api/products/{id}/: Retrieve a specific product by ID.
    PUT /api/products/{id}/: Update a specific product by ID.
    DELETE /api/products/{id}/: Delete a specific product by ID.
"""
from rest_framework.routers import DefaultRouter
from inventory.views import ProductViewSet

# define the api end points
router = DefaultRouter()  # automatically generates url patterns for ViewSets
router.register(r'products', ProductViewSet)  # register urls with prefix products

urlpatterns = router.urls