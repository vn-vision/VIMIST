from django.db import transaction
from core.models import Company, User, Config
from core.constants import DEFAULT_CONFIG
from django.core.exceptions import ValidationError

def register_comp_and_admin(
        company_data: dict,
        admin_data: dict,
        creator: User
) -> tuple[Company, User]:
    '''
    Atomically:
    1. create one company
    2. create one user with role='Admin' linked to company
    3. create its config with defaults

    Args:
        company_data: dict with name, subdomain, logo(optional)
        admin_data: data with email, password, f_name, s_name
        creator: User creating this record -> for auditing
    Returns:
        Tuple of Company, User
    '''
    with transaction.atomic():
        # validate no existing admin for requested company
        if 'role' in admin_data and admin_data['role'] != 'Admin':
            raise ValidationError("Admin must have the role 'Admin")
        
        company = Company.objects.create(**company_data, created_by=creator, updated_by=creator)
        # once company is created, create the admin user
        admin = User.objects.create_user(
            **admin_data,
            company=company,
            role='Admin'
            # audit field set by middleware
        )
        Config.objects.create(
            company=company,
            **DEFAULT_CONFIG,
            created_by=creator,
            updated_by=creator
        )
    return company, admin



@transaction.atomic
def onboard_user(
    email, password, first_name, last_name,
    company_data=None, creator=None, role='Clerk'
):
    '''
    if company_data is provided and no company exists:
        -> create company + config + admin user
    Else:
        -> only create a new user under existing creator.company
    '''
    if company_data and not Company.objects.filter(subdomain=company_data['subdomain']).exists():
        # first-time flow
        company, admin = register_comp_and_admin(
            company_data, {'email':email, 'password': password, 'first_name':first_name, 'last_name':last_name}, creator
        )
        return {'company':company, 'user':admin}
    user = User.objects.create_user(
        email=email, password=password, first_name=first_name, last_name=last_name,
        role=role, company=creator.company
    )
    return {'user': user}