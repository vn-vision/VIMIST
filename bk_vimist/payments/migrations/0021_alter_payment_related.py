# Generated by Django 5.1 on 2024-09-22 11:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0020_alter_payment_related'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='related',
            field=models.IntegerField(default=291800084079847539290240155325510953648),
        ),
    ]