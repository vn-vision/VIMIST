from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from inventory.models import Category, Product
from core.models import User, Company


class InventoryAPITest(APITestCase):
    def setUp(self):
        # create company and admin
        admin = User.objects.create_user(
            email='admin@shopco.com',
            password='securepass',
            role='Admin'
        )
        self.company=Company.objects.create(name='ShopCo', subdomain='shopco')
        admin.company=self.company
        admin.save()

        # Authenticate
        self.client = APIClient()
        self.client.force_authenticate(user=admin)

        # create a category and product
        self.cat = Category.objects.create(name='Cereal')
        self.prod = Product.objects.create(name='Maize', unit_price=70.00, category=self.cat, reorder_level=5)

        self.categories_url = reverse('category-list')
        self.products_url = reverse('product-list')

    def test_create_category(self):
        data = {'name':'Beverages'}
        resp = self.client.post(self.categories_url, data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 2)
    
    def test_list_products(self):
        data = {
            'name':'Beans',
            'unit_price':50.00,
            'category':self.cat.id,
            'reorder_level':5
        }

        resp = self.client.post(self.products_url, data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

        # switch to clerk
        clerk = User.objects.create_user(
            email='clerk@shopco.com',
            password='secureClerk',
            role='Clerk',
            company=self.company
        )
        
        self.client.force_authenticate(user=clerk)
        resp2 = self.client.post(self.products_url, data, format='json')
        self.assertEqual(resp2.status_code, status.HTTP_403_FORBIDDEN)