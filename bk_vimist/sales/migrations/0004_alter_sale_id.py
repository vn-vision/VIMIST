# Generated by Django 5.1 on 2024-08-30 12:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sales', '0003_auto_20240827_1822'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sale',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]