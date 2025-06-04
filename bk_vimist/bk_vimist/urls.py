"""bk_vimist URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.documentation import get_schema_view
from django.conf import settings
from django.conf.urls.static import static

api = [
        path('core/', include('core.urls')),
        path('credit/', include('credit.urls')),
        path('sales/', include('sales.urls')),
        path('payments/', include('payments.urls')),
        path('notifications/', include('notifications.urls')),
        path('inventory/', include('inventory.urls')),
        path('purchases/', include('purchases.urls')),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(api))
    ]

# media to use in dev mode: use AWS/CDN on production
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
