# Generated by Django 5.1 on 2024-09-21 17:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0011_alter_payment_related'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='related',
            field=models.IntegerField(default=106533571075111539292584843701433584966),
        ),
    ]