# Generated by Django 5.1 on 2024-10-30 08:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0031_alter_payment_related'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='related',
            field=models.IntegerField(default=126163005126980254226589493526151519192),
        ),
    ]
