from django.test import TestCase
from django.urls import reverse
from users.models import User


class RegistrationTests(TestCase):
    def setUp(self):
        pass

    def test_user_registration_success(self):
        response = self.client.post('/api/users/register/',{
            'username':'testuser',
            'contact':'test@user.com',
            'password':'testpassword',
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(User.objects.filter(username='testuser').exists(), True)
        self.assertEqual(self.client.post('/api/users/register/',
                                          {'username':'testuser', 
                                          'contact':'test1@user.com',
                                          'password':'securepassword'}).status_code, 400)


    def test_sa_user_registration(self):
        response = self.client.post('/api/users/sa_register/',{
            'username':'testAdmin',
            'email':'test@admin.com',
            'password':'testpassword',  
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(User.objects.filter(username='testAdmin', is_superadmin=True).exists(), True)

    def test_existing_admin(self):
        User.objects.create(username='testAdmin2', email='test2@admin.com', is_superadmin=True, password='SecurePass')

        with self.assertRaises(ValueError) as context:
            second_admin = User(username='testAdmin2', email='test2@admin.com', is_superadmin=True, password='SecurePass')
            second_admin.save()
        
        self.assertEqual(str(context.exception), 'There is an existing Superadmin')


    def test_user_registration_missing_fields(self):
        response = self.client.post('/api/users/register/',{
            'username':'',
            'contact':'',
            'password':''
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('This field may not be blank.', response.content.decode())

    
    def test_admin_registration_missing_fields(self):
        response = self.client.post('/api/users/sa_register/',{
            'username':'',
            'email':'',
            'password':'',  
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('This field may not be blank.', response.content.decode())
    

    def test_invalid_email(self):
        response = self.client.post('/api/users/sa_register/',{
            'username':'testAdmin',
            'email':'test1admin.com',
            'password':'testpassword',  
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn('Enter a valid email address', response.content.decode())

class LoginTests(TestCase):
    """
    Test cases for login
    """
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', contact='test@user.com',password='SecurePass')
        self.path = '/api/users/login/'

    def test_user_login_success(self):
        response = self.client.post( self.path,{
            'username':'testuser',
            'password': 'SecurePass',
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('refresh', response.data)
        self.assertIn('access', response.data)


    def test_user_login_incorrect_password(self):
            response = self.client.post(self.path, {
                'username': 'testuser',
                'password': 'wrongpassword',
            })
            self.assertEqual(response.status_code, 401)
            self.assertIn('Invalid credentials', response.content.decode())

    def test_user_login_nonexistent_username(self):
        response = self.client.post(self.path, {
            'username': 'nonexistentuser',
            'password': 'SecurePass',
        })
        self.assertEqual(response.status_code, 401) 
        self.assertIn('Invalid credentials', response.content.decode())

    def test_user_login_empty_fields(self):
        response = self.client.post(self.path, {
            'username': '',
            'password': '',
        })
        self.assertEqual(response.status_code, 400)  
        self.assertIn('This field may not be blank', response.content.decode())

class UserRoleTests(TestCase):
    def setUp(self):
        from inventory.models import Product
        from rest_framework.test import APIClient

        self.client = APIClient()
        self.customer = User.objects.create_user(username='customer', contact='0734567890', role='Customer', password='SecurePass')
        self.cashier = User.objects.create_user(username='cashier', contact='0790876543', role='Cashier', password='SecurePass')
        self.manager = User.objects.create_user(username='manager', contact='0712345678', role='Manager', password='SecurePass')
        self.admin = User.objects.create_user(username='admin', email='admin@vimi.vm', is_superadmin=True, role='Admin', password='SecurePass')

        self.product = Product.objects.create(name='TestProduct', category='Category', quantity_in_stock=100, unit_price=29.99, reorder_level=5)
        self.id = self.product.id

    

    def test_customer_role(self):
        self.assertEqual(self.customer.role, 'Customer')
        # test for CRUD operations, customer should only be able to read and update their own profile
        self.assertEqual(self.client.get('/api/inventory/products/').status_code, 200)
        self.assertEqual(self.client.get(f'/api/inventory/products/{self.id}/').status_code, 200)

        # try to make a post request to create a product: should return 401 unauthorized
        # if the user is not an admin or manager return 403 forbidden
        response = self.client.post('/api/users/login/', {
            'username': 'customer',
            'password': 'SecurePass',
        })
        token = response.data['access']

        self.assertEqual(self.client.post('/api/inventory/products/').status_code, 401)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(self.client.post('/api/inventory/products/', data ={
            "name": "New Product",
            "category": "New Category",
            "quantity_in_stock": 10,
            "unit_price": 29.99,
            "reorder_level": 5
        }).status_code, 403)

        # try to update a product as a customer, should return 403 forbidden
        self.assertEqual(self.client.put(f'/api/inventory/products/{self.id}/', data ={
            "name": "New Product",
            "category": "New Category",
            "quantity_in_stock": 109,
            "unit_price": 29.99,
            "reorder_level": 5
        }).status_code, 403)

        # try to delete a product as a customer, should return 403 forbidden
        self.assertEqual(self.client.delete(f'/api/inventory/products/{self.id}/').status_code, 403)

    def test_cashier_role(self):
        """ test for cashier role """
        self.assertEqual(self.cashier.role, 'Cashier')
        # test for CRUD operations, cashier should only be able to read and update their own profile
        self.assertEqual(self.client.get('/api/inventory/products/').status_code, 200)
        self.assertEqual(self.client.get(f'/api/inventory/products/{self.id}/').status_code, 200)

        # try to make a post request to create a product: should return 401 unauthorized
        # if the user is not an admin or manager return 403 forbidden
        response = self.client.post('/api/users/login/', {
            'username': 'cashier',
            'password': 'SecurePass',
        })

        self.assertEqual(response.status_code, 200)
        token = response.data['access']

        self.assertEqual(self.client.post('/api/inventory/products/').status_code, 401)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(self.client.post('/api/inventory/products/', data ={
            "name": "New Product",
            "category": "New Category",
            "quantity_in_stock": 10,
            "unit_price": 29.99,
            "reorder_level": 5
        }).status_code, 403)

        # try to update a product as a cashier, should return 403 forbidden
        self.assertEqual(self.client.put(f'/api/inventory/products/{self.id}/', data ={
            "name": "New Product",
            "category": "New Category",
            "quantity_in_stock": 109,
            "unit_price": 29.99,
            "reorder_level": 5
        }).status_code, 403)

        # try to delete a product as a cashier, should return 403 forbidden
        self.assertEqual(self.client.delete(f'/api/inventory/products/{self.id}/').status_code, 403)

    def test_manager_role(self):
        """ test for manager role """
        self.assertEqual(self.manager.role, 'Manager')
        # test for CRUD operations, manager should only be able to read and update their own profile
        self.assertEqual(self.client.get('/api/inventory/products/').status_code, 200)
        self.assertEqual(self.client.get(f'/api/inventory/products/{self.id}/').status_code, 200)

        # try to make a post request to create a product: should return 401 unauthorized
        # if the user is not an admin or manager return 403 forbidden
        response = self.client.post('/api/users/login/', {
            'username': 'manager',
            'password': 'SecurePass',
        })
        token = response.data['access']

        self.assertEqual(self.client.post('/api/inventory/products/').status_code, 401)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(self.client.post('/api/inventory/products/', data ={
            "name": "New Product",
            "category": "New Category",
            "quantity_in_stock": 10,
            "unit_price": 29.99,
            "reorder_level": 5
        }).status_code, 201)

        # try to update a product as a manager, should return 403 forbidden
        self.assertEqual(self.client.put(f'/api/inventory/products/{self.id}/', data ={
            "name": "New Product",
            "category": "New Category",
            "quantity_in_stock": 109,
            "unit_price": 29.99,
            "reorder_level": 5
        }).status_code, 200)

        # try to delete a product as a manager, should return 403 forbidden
        self.assertEqual(self.client.delete(f'/api/inventory/products/{self.id}/').status_code, 403)

    def test_admin_role(self):
        """ test for admin role """
        self.assertEqual(self.admin.role, 'Admin')
        # test for CRUD operations, admin should only be able to read and update their own profile
        self.assertEqual(self.client.get('/api/inventory/products/').status_code, 200)
        self.assertEqual(self.client.get(f'/api/inventory/products/{self.id}/').status_code, 200)

        # try to make a post request to create a product: should return 401 unauthorized
        # if the user is not an admin or manager return 403 forbidden
        response = self.client.post('/api/users/login/', {
            'username': 'admin',
            'password': 'SecurePass',
        })
        token = response.data['access']

        self.assertEqual(self.client.post('/api/inventory/products/').status_code, 401)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(self.client.post('/api/inventory/products/', data ={
            "name": "New Product",
            "category": "New Category",
            "quantity_in_stock": 10,
            "unit_price": 29.99,
            "reorder_level": 5
        }).status_code, 201)

        # try to update a product as an admin, should return 201 created
        self.assertEqual(self.client.put(f'/api/inventory/products/{self.id}/', data ={
            "name": "New Product",
            "category": "New Category",
            "quantity_in_stock": 109,
            "unit_price": 29.99,
            "reorder_level": 5
        }).status_code, 200)

        # try to delete a product as an admin, should return 201 created
        self.assertEqual(self.client.delete(f'/api/inventory/products/{self.id}/').status_code, 204)