from django.test import TestCase
from django.core.validators import MinValueValidator
from inventory.models import Product, Category, Inventory

class ProductModelTest(TestCase):
    '''
    Test model creation and fields behave as expected
    '''
    def setUp(self):
        self.cat = Category.objects.create(name='Cereals')
    
    def test_product_creation_and_str(self):
        p = Product.objects.create(
            name='Maize Flour',
            unit_price=50.00,
            category=self.cat,
            reorder_level=5
        )
        self.assertEqual(str(p), "Product (Maize Flour) category (Cereals)")
        self.assertEqual(p.unit_price, 50.00)
        self.assertEqual(p.reorder_level, 5)

class InventoryModelTest(TestCase):
    def setUp(self):
        cat = Category.objects.create(name='Beverages')
        self.prod = Product.objects.create(name='Soda', unit_price=30.00, category=cat, reorder_level=10)
        self.inv = Inventory.objects.create(product=self.prod, quantity=20)
    
    def test_inventory_negative_quantity_not_allowed(self):
        # minValValidator should prevent negatives
        self.inv.quantity = -5
        with self.assertRaises(Exception):
            self.inv.full_clean()
    
    def test_inventory_str(self):
        self.assertIn("Soda", str(self.inv))
        self.assertIn("20", str(self.inv))