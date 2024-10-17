"""bk_vimist URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.documentation import get_schema_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include([
        path('inventory/', include('inventory.urls')),
        path('customers/', include('customers.urls')),
        path('sales/', include('sales.urls')),
        path('credit_sales/', include('credit_sales.urls')),
        path('notifications/', include('notifications.urls')),
        path('payments/', include('payments.urls')),
        path('purchases/', include('purchases.urls')),
        path('users/', include('users.urls')),
    ])),
    # DRF's Built-in Documentation
    path('docs/', get_schema_view(title='V-APIs', version=1.0, description='API for all views'),
         name='Vimist-schema')
]
