from django.test import TestCase
from django.core.exceptions import ValidationError
from core.models import Config, User, Company
from core.services.auth import register_comp_and_admin, onboard_user
from core.services.customization import update_branding
from core.constants import DEFAULT_CONFIG

class RegistrationServiceTest(TestCase):
    def setUp(self):
        self.creator = User.objects.create_user(
            email='creator@test.com',
            password='testpass'
        )

    def test_register_company_and_admin_creates_config(self):
        company, admin = register_comp_and_admin(
            company_data={'name': 'Vimist Corp', 'subdomain': 'vimist'},
            admin_data={'email': 'admin@test.com', 'password': 'adminpass'},
            creator=self.creator
        )
        self.assertEqual(admin.role, 'Admin')
        cfg = Config.objects.get(company=company)
        self.assertEqual(cfg.system_name, DEFAULT_CONFIG['system_name'])
        self.assertEqual(cfg.primary_color, DEFAULT_CONFIG['primary_color'])
        self.assertEqual(cfg.secondary_color, DEFAULT_CONFIG['secondary_color'])

    def test_register_first_user_flow(self):
        # Ensure no users exist
        User.objects.all().delete()
        results = onboard_user(
            email='first@test.com',
            password='firstpass',
            first_name='F',
            last_name='User',
            company_data={'name':'NewCo', 'subdomain':'newco', 'logo':None},
            creator=None,
            role='Admin'
        )

        user = results['user']
        company = results['company']

        # assertions
        self.assertTrue(isinstance(user, User))
        self.assertEqual(user.email, 'first@test.com')
        self.assertEqual(user.role, 'Admin')
        self.assertEqual(user.company, company)

        # company exists
        self.assertTrue(Company.objects.filter(subdomain='newco').exists())

        cfg = user.company.config
        self.assertEqual(cfg.primary_color, DEFAULT_CONFIG['primary_color'])

    def test_invalid_admin_data_raises(self):
        with self.assertRaises(ValidationError):
            register_comp_and_admin(
                company_data={'name':'X','subdomain':'x'},
                admin_data={'email':'u@test.com','password':'p','role':'Clerk'},
                creator=self.creator
            )
    
    def test_onboard_adds_clerk_to_existing_company(self):
        # first create an existing company + admin
        admin = User.objects.create_user(
            email='admin@admin.com',
            password='secure',
            role='Admin'
        )
        company = Company.objects.create(name='NewCo', subdomain='newco')
        admin.company = company
        admin.save()
        Config.objects.create(company=company, system_name='Test', primary_color='#000000', secondary_color='#ffffff')

        # Login as admin and add clerk
        result = onboard_user(
            email='clerk@admin.com',
            password='secure2',
            first_name='Clerk',
            last_name='user',
            company_data=None,
            creator=admin,
            role='Clerk'
        )
        clerk = result['user']
        self.assertEqual(clerk.company, company)
        self.assertEqual(clerk.role, 'Clerk')


class BrandingServiceTest(TestCase):
    def setUp(self):
        self.creator = User.objects.create_user(
            email='creator@test.com',
            password='testpass'
        )
        self.company, self.admin = register_comp_and_admin(
            company_data={'name':'Test','subdomain':'test'},
            admin_data={'email':'admin@test.com','password':'adminpass'},
            creator=self.creator
        )

    def test_update_branding(self):
        new_name = 'NewName'
        new_color = '#FFFFFF'
        updated_company, updated_cfg = update_branding(
            company=self.company,
            updater=self.admin,
            name=new_name,
            primary_color=new_color
        )
        self.assertEqual(updated_company.name, new_name)
        self.assertEqual(updated_cfg.primary_color, new_color)
        self.assertEqual(updated_company.updated_by, self.admin)

    def test_missing_config_recreated(self):
        # Remove existing config
        cfg = self.company.config
        cfg.delete()
        updated_company, updated_cfg = update_branding(
            company=self.company,
            updater=self.admin,
            secondary_color='#000000'
        )
        self.assertEqual(updated_cfg.secondary_color, '#000000')
        self.assertEqual(updated_cfg.company, self.company)