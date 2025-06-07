from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from core.models import User, Company, Config


class RegistrationAPITest(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')

    def test_register_first_admin_created_company_and_config_and_returns_token(self):
        payload = {
            'email':'admin@shopco.com',
            'password':'securepass',
            'first_name':'first',
            'last_name':'last',
            'company_name':'ShopCo',
            'subdomain':'shopco',
            'role':'Admin'
        }

        response = self.client.post(self.register_url, payload, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # check response contains token
        self.assertIn('token', response.data)
        # Company and Config exists
        self.assertTrue(Company.objects.filter(subdomain='shopco').exists())
        company = Company.objects.get(subdomain='shopco')
        self.assertTrue(Config.objects.filter(company=company).exists())
    
    def test_non_admin_cannot_register_company(self):
        # Attempt to register with role != Admin but providing subdomain
        payload = {
            'email':'user@shopco.com',
            'password':'secure22',
            'first_name':'first',
            'last_name':'last',
            'company_name':'ShopCo',
            'subdomain':'shopco',
            'role':'Clerk'
        }

        response = self.client.post(self.register_url, payload, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('role', response.data)

class CompanyConfigAPITest(APITestCase):
    def setUp(self):
        # onboard first admin
        admin = User.objects.create_user(
            email='admin2@nano.com', password='securepass', role='Admin'
        )
        company = Company.objects.create(name='ShopCo', subdomain='shopco')
        admin.company = company
        admin.save()
        Config.objects.create(company=company, system_name='NanoPOS', primary_color='#FFFFFF',secondary_color='#000000')

        # Authenticate
        self.client = APIClient()
        self.client.force_authenticate(user=admin)
        self.company_url = reverse('company-detail')
        self.config_url = reverse('config-detail')

    def test_get_company_details(self):
        resp = self.client.get(self.company_url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['subdomain'], 'shopco')

    def test_update_config_only_admin(self):
        data = {'primary_color': '#ABCDEF'}
        resp = self.client.patch(self.config_url, data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        cfg = Config.objects.get(company__subdomain='shopco')
        self.assertEqual(cfg.primary_color, '#ABCDEF')