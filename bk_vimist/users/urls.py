from django.urls import path
from   users.views import UserRegisterView, LoginView, SuperAdminRegisterView

urlpatterns = [
    path('sa_register/', SuperAdminRegisterView.as_view(), name='sa_register'),
    path('register/', UserRegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]