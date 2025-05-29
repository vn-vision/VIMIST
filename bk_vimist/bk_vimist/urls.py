"""bk_vimist URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.documentation import get_schema_view
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
]

# media to use in dev mode: use AWS/CDN on production
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
