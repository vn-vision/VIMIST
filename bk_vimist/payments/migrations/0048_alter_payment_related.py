# Generated by Django 5.1 on 2025-01-29 10:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0047_alter_payment_related'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='related',
            field=models.IntegerField(default=156111484771251303262054533555958449297),
        ),
    ]
