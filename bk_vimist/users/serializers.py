from rest_framework import serializers
from users.models import User



class SuperAdminRegSerializer(serializers.ModelSerializer):
    """
    Serializer for User model
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['role'] = 'Admin'.capitalize()
        validated_data['is_superadmin'] = True
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.is_active = True
        user.save()
        return user

class UserRegSerializer(serializers.ModelSerializer):
    """
    Serializer for User model
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'contact', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['role'] = 'Customer'.capitalize()
        # extract password
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.is_active = True
        user.save()
        return user
    
class UserLogSerializer(serializers.Serializer):
    """
    Serializer for logging in a user
    """

    username = serializers.CharField(max_length=255)
    password = serializers.CharField(write_only=True)
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            msg = 'Must provide username and password'
            raise serializers.ValidationError(msg)
        return data