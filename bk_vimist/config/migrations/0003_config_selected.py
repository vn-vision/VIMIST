# Generated by Django 5.1 on 2025-02-17 08:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('config', '0002_alter_config_threshold'),
    ]

    operations = [
        migrations.AddField(
            model_name='config',
            name='selected',
            field=models.BooleanField(default=False),
        ),
    ]
