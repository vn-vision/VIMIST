from rest_framework.routers import DefaultRouter
from .views import ConfigView

router = DefaultRouter()
router.register(r'config', ConfigView)

urlpatterns = router.urls