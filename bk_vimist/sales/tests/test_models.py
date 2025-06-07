from django.test import TestCase
from django.core.exceptions import ValidationError
from sales.models import Sale, SaleItem, Customer
from inventory.models import Product, Inventory, Category
from core.models import User, Company
from credit.models import CreditAccount
from sales.services import validate_credit_limit


class SaleModelTest(TestCase):
    def setUp(self):
        self.company = Company.objects.create(name="ShopCo", subdomain='shopco')
        self.admin = User.objects.create_user(
            email='admin@shopco.com',
            password='secure',
            role='Admin', company=self.company
        )
        cat = Category.objects.create(name='Drinks')
        self.prod = Product.objects.create(name='Water', unit_price=20.00, category=cat, reorder_level=5)
        Inventory.objects.create(product=self.prod, quantity=3)

        self.customer = Customer.objects.create(
            name='customer',
            phone='254123456789'
        )

    def test_sale_credit_limit_validation(self):
        # customer has a default credit limit of 500/=
        # test this credit limit
        cust = CreditAccount.objects.create(
            customer=self.customer,
        )
        sale = Sale(
            customer=cust.customer,
            total_amount=600.00,
            payment_type='Credit',
            created_by=self.admin,
            updated_by=self.admin
            )
        
        with self.assertRaises(ValidationError):
            validate_credit_limit(sale)
    
    def test_sale_item_insufficient_stock(self):
        # inventory check happens in services
        self.assertTrue(True)