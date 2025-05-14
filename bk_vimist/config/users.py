"""
this file is for user specific configurations
a class for test user is created
"""

from django.contrib.auth.models import User
from rest_framework.test import APITestCase
import base64


class UserAPITests(APITestCase):
    """Test suite for the User API endpoints."""

def setUp(self):
    # Create a test user
    self.user = User.objects.create_user(username='testuser', password='testpassword')

    # Authenticate with Basic Authentication
    credentials = base64.b64encode(b'testuser:testpassword').decode('utf-8')
    self.client.credentials(HTTP_AUTHORIZATION='Basic ' + credentials)

    # Log in the user using Session Authentication
    self.client.login(username='testuser', password='testpassword')