from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import UserViewSet, RegistrationView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegistrationView.as_view(), name='register'),
]