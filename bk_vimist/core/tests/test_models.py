from django.test import TestCase
from django.core.exceptions import ValidationError
from core.models import Company, User
from core.services.auth import register_comp_and_admin
from core.constants import DEFAULT_CONFIG

class CompanyModelTest(TestCase):
    def setUp(self):
        # Create a creator user
        self.creator = User.objects.create_user(
            email='creator@test.com',
            password='testpass'
        )

    def test_company_audit_fields(self):
        company = Company.objects.create(
            name='Acme',
            subdomain='acme',
            created_by=self.creator,
            updated_by=self.creator
        )
        self.assertEqual(company.created_by, self.creator)
        self.assertEqual(company.updated_by, self.creator)
        self.assertIsNone(company.deleted_at)

    def test_unique_subdomain_constraint(self):
        Company.objects.create(
            name='Acme',
            subdomain='acme',
            created_by=self.creator,
            updated_by=self.creator
        )
        with self.assertRaises(Exception):
            Company.objects.create(
                name='Duplicate',
                subdomain='acme',
                created_by=self.creator,
                updated_by=self.creator
            )

class UserModelTest(TestCase):
    def setUp(self):
        # Register a company+admin via service
        self.creator = User.objects.create_user(
            email='creator@test.com',
            password='testpass'
        )
        self.company, self.admin = register_comp_and_admin(
            company_data={ 'name': 'Org', 'subdomain': 'org' },
            admin_data={ 'email': 'admin@org.com', 'password': 'adminpass' },
            creator=self.creator
        )

    def test_single_admin_per_company(self):
        # Attempt to create second admin for same company
        with self.assertRaises(ValidationError):
            User.objects.create_user(
                email='second@org.com',
                password='pass',
                role='Admin',
                company=self.company
            )