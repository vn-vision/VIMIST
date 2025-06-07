from django.test import TestCase
from inventory.models import Product, Inventory, Category
from purchases.models import Purchase, PurchaseItem
from purchases.services import process_purchase
from core.models import User, Company

class PurchaseServiceTest(TestCase):
    def setUp(self):
        # create a company, admin user, category and product
        self.company = Company.objects.create(name='ShopCo', subdomain='shopco')
        self.admin = User.objects.create_user(
            email='admin@shopco.com',
            password='secure',
            role='Admin',
            company=self.company
        )

        cat = Category.objects.create(name='Cereals')
        self.prod = Product.objects.create(name='Beans', unit_price=100.00, category=cat, reorder_level=10)
        # set initial quantity to 5
        Inventory.objects.create(product=self.prod, quantity=5)

    def test_process_purchase_increments_inventory_and_creates_payment(self):
        # simulate purchase with quantity=10 cost_price=50
        purchase = Purchase.objects.create(
            supplier = None,
            total_amount=10 * 50.00,
            payment_type='Cash',
            created_by=self.admin,
            updated_by=self.admin
        )

        PurchaseItem.objects.create(
            purchase=purchase,
            product=self.prod,
            quantity=10,
            cost_price=50.00,
            created_by=self.admin,
            updated_by=self.admin
        )

        # initial inventory is 5, after purchase it should be 15
        process_purchase(purchase)
        inv = Inventory.objects.get(product=self.prod)
        self.assertEqual(inv.quantity, 15)
    
    def test_process_purchase_mpesa_marks_pending(self):
        purchase = Purchase.objects.create(
            supplier=None,
            total_amount=200.00,
            payment_type='Mpesa',
            created_by=self.admin,
            updated_by=self.admin
        )

        PurchaseItem.objects.create(
            purchase=purchase,
            product=self.prod,
            quantity=2,
            cost_price=100.00,
            created_by=self.admin,
            updated_by=self.admin
        )

        process_purchase(purchase)
        from payments.models import Payment
        payment = Payment.objects.get(purchase=purchase)
        self.assertEqual(payment.status, 'Pending')