from rest_framework import serializers
from .models import Config

class ConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Config
        fields = ['id','system_name', 'logo', 'primary_color', 'secondary_color', 'created_at']