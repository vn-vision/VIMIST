# Generated by Django 5.1 on 2024-09-21 17:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0014_alter_payment_related'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='related',
            field=models.IntegerField(default=312852074748038707282628774629866713517),
        ),
    ]
