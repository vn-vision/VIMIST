# Generated by Django 5.1 on 2024-10-07 14:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0028_alter_payment_related'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='related',
            field=models.IntegerField(default=171758629231203526220628518895084433115),
        ),
    ]
