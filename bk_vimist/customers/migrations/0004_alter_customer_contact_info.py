# Generated by Django 5.1 on 2025-01-29 10:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0003_alter_customer_contact_info'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='contact_info',
            field=models.CharField(max_length=255),
        ),
    ]
