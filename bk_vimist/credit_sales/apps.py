from django.apps import AppConfig


class CreditsalesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'credit_sales'

    def ready(self):
        import credit_sales.signals