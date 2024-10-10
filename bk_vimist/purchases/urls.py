from rest_framework.routers import DefaultRouter
from purchases.views import PurchaseViewSet

router = DefaultRouter()
router.register(r'purchases', PurchaseViewSet)

urlpatterns = router.urls