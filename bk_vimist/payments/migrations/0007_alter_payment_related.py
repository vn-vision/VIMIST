# Generated by Django 5.1 on 2024-09-16 07:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0006_alter_payment_related'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='related',
            field=models.IntegerField(default=174819333262135693510047329673196026511),
        ),
    ]
