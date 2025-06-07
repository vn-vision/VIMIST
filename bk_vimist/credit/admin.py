from django.contrib import admin
from credit.models import CreditAccount, CreditTransaction

# Register your models here.
@admin.register(CreditAccount)
class CreditAccount(admin.ModelAdmin):
    list_display = ('customer', 'current_balance', 'status')
    search_fields = ['customer']

@admin.register(CreditTransaction)
class CreditTransaction(admin.ModelAdmin):
    list_display = ('credit_account', 'sale', 'purchase', 'payment', 'amount', 'type', 'transaction_at')
    search_fields = ['credit_account']