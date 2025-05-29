import pytest
from core.models import User, Company, Config
from core.services import register_comp_and_admin


@pytest.fixture
def creator_user(db):
    return User.objects.create_user(
        email='creator@test.com',
        password='testpass',
    )

@pytest.fixture
def admin_user(db, creator_user):
    """Admin user fixture"""
    company, admin = register_comp_and_admin(
        company_data = {
            'name':'Test Company',
            'subdomain':'test'
        },
        admin_data={
            'email':'admin@test.com',
            'password':'adminpass',
            'first_name':'Alice',
            'last_name':'Admin'
        },
        creator=creator_user
    )
    return admin

@pytest.fixture
def test_company(admin_user):
    """Company fixture with admin user"""
    return admin_user.company

@pytest.fixture
def test_config(test_company):
    return Config.objects.get(Company=test_company)