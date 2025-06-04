from rest_framework import serializers
from .models import User, Company, Config
from .services import onboard_user


class UserSerializer(serializers.ModelSerializer):
    '''
    General-purpose serializer for the User Model
    Used for listing, retrieving, and updating profiles.
    '''
    class Meta:
        model=User
        # expose email, name, role and company: company subdomain
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'company', 'is_staff', 'is_superuser', 'created_at', 'updated_at']
        read_only_fields = ['role', 'company', 'is_staff', 'is_superuser', 'created_at', 'updated_at']


class RegistrationSerializer(serializers.Serializer):
    '''
    Serializer for new user onboarding
    This can handle:
        - First-time 'self' registration: create default company + config + admin user
        - Subsequent user creation under existing company (admin only)
    Delegates the actual object creation to the onboard_user() service
    '''
    # Basic user Fields
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=150, required=False, default='')
    last_name = serializers.CharField(max_length=150, required=False, default='')

    # Optional Company data: If present, create a new company
    company_name = serializers.CharField(max_length=255, write_only=True, required=False, allow_blank=True)
    subdomain = serializers.CharField(max_length=100, write_only=True, required=False, allow_blank=True)
    logo = serializers.ImageField(write_only=True, required=False, allow_null=True)

    # not first-time, callers can pass role (default is Clerk)
    role = serializers.ChoiceField(
        choices=User.ROLE_CHOICES, default='Clerk', write_only=True
    )

    def validate(self, attrs):
        email = attrs.get('email')
        role = attrs.get('role')
        # if subdomain is provided, assume it is the first-time (company creation)
        subdomain = attrs.get('subdomain', '').strip()
        if subdomain:
            # check for existing subdomains
            if Company.objects.filter(subdomain=subdomain).exists():
                raise serializers.ValidationError(f"{subdomain}: Already is use")
            # only admins can create a company
            if role != 'Admin':
                raise serializers.ValidationError({"role":"First user must be Admin"})
        return attrs

    def create(self, validated_data):
        '''
        Calls onboard_user() service which encapsulates:
            - create new Company + Config + Admin if needed
            - Or Create new user under existing company
        '''
        user = self.context['request'].user # might be unathenticated on first-run
        Company_data = {}
        subdomain = validated_data.get('subdomain', '').strip()
        if subdomain:
            # build company_data from provided fields
            Company_data = {
                'name': validated_data['company_name'],
                'subdomain': subdomain,
                'logo': validated_data.get('logo', None)
            }
        
        # pass the required arguments to onboard_user()
        creds = {
            'email': validated_data['email'],
            'password': validated_data['password'],
            'first_name': validated_data.get('first_name', ''),
            'last_name': validated_data.get('last_name', '')
        }
        role = validated_data.get('role', 'Clerk')
        result = onboard_user(
            email=creds['email'],
            password=creds['password'],
            first_name=creds['first_name'],
            last_name=creds['last_name'],
            company_data=Company_data if Company_data else None,
            role=role,
            creator=user if user.is_authenticated else None
        )

        # onboard_user returns dict {company: , user: } or {user: }
        return result['user']
    

class CompanySerializer(serializers.ModelSerializer):
    '''
    Expose Company: Name, Logo, subdomain
    '''
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    class Meta:
        model = Company
        fields = ['id', 'name', 'logo', 'subdomain', 'created_at', 'updated_at']
        read_only_fields = ['subdomain'] # don't change once set


class ConfigSerializer(serializers.ModelSerializer):
    '''
    Expose Company's configurations: system_name, pri/sec-color
    '''
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    class Meta:
        model = Config
        fields = ['system_name', 'primary_color', 'secondary_color', 'created_at', 'updated_at']

