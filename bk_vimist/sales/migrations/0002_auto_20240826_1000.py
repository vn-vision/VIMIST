# Generated by Django 3.1.14 on 2024-08-26 07:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sales', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sale',
            name='total_price',
            field=models.DecimalField(decimal_places=2, max_digits=10, null=True),
        ),
    ]