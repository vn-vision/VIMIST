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
        admin = User.objects.create(username='testAdmin2', email='test2@admin.com', is_superadmin=True, password='SecurePass')

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
        self.assertEqual(response.status_code, 404) 
        self.assertIn('User does not exist', response.content.decode())

    def test_user_login_empty_fields(self):
        response = self.client.post(self.path, {
            'username': '',
            'password': '',
        })
        self.assertEqual(response.status_code, 404)  
        self.assertIn('User does not exist', response.content.decode())