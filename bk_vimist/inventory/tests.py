from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Product

class ProductAPITests(APITestCase):
    """Test suite for the Product API endpoints."""

    def setUp(self):
        """Set up a test product and a valid payload for use in tests."""
        # Create a test product
        self.product = Product.objects.create(
            name="Test Product",
            category="Test Category",
            quantity_in_stock=10,
            unit_price=99.99,
            reorder_level=5
        )

        # Define a valid payload for creating/updating a product
        self.valid_payload = {
            'name': 'Updated Product',
            'category': 'Updated Category',
            'quantity_in_stock': 20,
            'unit_price': 49.99,
            'reorder_level': 10
        }

    def test_get_all_products(self):
        """
        Test retrieving a list of all products.

        This test ensures that the API can successfully return a list of all
        products in the database.
        """
        # Send a GET request to the product-list endpoint
        response = self.client.get(reverse('product-list'))

        # Assert that the response status is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_product(self):
        """
        Test creating a new product.

        This test verifies that a product can be successfully created
        using the API.
        """
        # Send a POST request with the valid payload to create a new product
        response = self.client.post(reverse('product-list'), self.valid_payload, format='json')

        # Assert that the response status is 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_product(self):
        """
        Test retrieving a single product by ID.

        This test checks if a specific product can be retrieved using its
        primary key (ID).
        """
        # Send a GET request to retrieve the product by its primary key
        response = self.client.get(reverse('product-detail', kwargs={'pk': self.product.pk}))

        # Assert that the response status is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_product(self):
        """
        Test updating an existing product.

        This test ensures that a product's details can be successfully
        updated using the API.
        """
        # Send a PUT request with the valid payload to update the product
        response = self.client.put(reverse('product-detail', kwargs={'pk': self.product.pk}),
                                   data=self.valid_payload, format='json')

        # Assert that the response status is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_product(self):
        """
        Test deleting a product.

        This test checks if a product can be successfully deleted using the API.
        """
        # Send a DELETE request to delete the product by its primary key
        response = self.client.delete(reverse('product-detail', kwargs={'pk': self.product.pk}))

        # Assert that the response status is 204 No Content
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
