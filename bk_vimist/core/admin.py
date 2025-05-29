from django.contrib import admin
from core.models.user import User
from core.models.company import Company
from core.models.config import Config

# Register your models here.
@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'subdomain',)
    search_fields = ['name', 'subdomain']

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'role', 'company', 'is_active')
    list_filter = ('role', 'is_active')
    search_fields = ['email']

@admin.register(Config)
class ConfigAdmin(admin.ModelAdmin):
    list_display = ('company', 'system_name')