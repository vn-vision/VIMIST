# Generated by Django 5.1 on 2024-08-30 12:31

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('credit_sales', '0002_auto_20240827_1822'),
    ]

    operations = [
        migrations.AlterField(
            model_name='credit_sale',
            name='due_date',
            field=models.DateField(default=datetime.date(2024, 9, 9)),
        ),
        migrations.AlterField(
            model_name='credit_sale',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]