# Generated by Django 5.1 on 2024-09-16 10:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0010_alter_payment_related'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='related',
            field=models.IntegerField(default=219790475883121991088497066335761285988),
        ),
    ]