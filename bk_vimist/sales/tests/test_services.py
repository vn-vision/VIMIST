from django.test import TestCase
from inventory.models import Category, Product, Inventory
from sales.models import Sale, SaleItem, Customer
from sales.services import process_sale
from django.core.exceptions import ValidationError
from core.models import Company, User
from credit.models import CreditAccount, CreditTransaction

class SaleServiceTest(TestCase):
    def setUp(self):
        self.company = Company.objects.create(name='ShopCo', subdomain='shopco')
        self.admin = User.objects.create_user(
            email='admin@shopco.com',
            password='secure',
            role='Admin',
            company=self.company
        )

        # Customer and credit account # defualt credit limit = 500
        self.customer = Customer.objects.create(
            name='customer',
            phone='254123456789'
        )

        self.cred = CreditAccount.objects.create(
            customer=self.customer,
            current_balance=0.00
        )

        # inventory $ product
        cat = Category.objects.create(name='Food')
        self.prod = Product.objects.create(
            name='Bread', unit_price=70.00, category=cat, reorder_level=5
        )
        Inventory.objects.create(product=self.prod, quantity=5)

    
    def test_process_sale_decrements_inventory_and_creates_cash_payment(self):
        sale = Sale.objects.create(customer=self.customer,
                                   total_amount=2 * 50.00,
                                   payment_type='Cash',
                                   created_by=self.admin,
                                   updated_by=self.admin)
        
        SaleItem.objects.create(
            sale=sale,
            product=self.prod,
            quantity=2,
            unit_price=50.00,
            total_price=100.00,
            created_by=self.admin,
            updated_by=self.admin
        )
        process_sale(sale)
        inv = Inventory.objects.get(product=self.prod)
        self.assertEqual(inv.quantity, 3) # 5 - 2

        from payments.models import Payment
        payment = Payment.objects.get(sale=sale)
        self.assertEqual(payment.amount, 100.00)
        self.assertEqual(payment.status, 'Success')

    def test_process_sale_credit_updated_credit_account(self):
        # Customer's CreditAccount default credit = 500
        acct = CreditAccount.objects.get(customer=self.customer)
        sale = Sale.objects.create(
            customer=self.customer,
            total_amount=100.00,
            payment_type='Credit',
            created_by=self.admin,
            updated_by=self.admin
        )
        SaleItem.objects.create(
            sale=sale,
            product=self.prod,
            quantity=2,
            unit_price=50.00,
            total_price=100.00,
            created_by=self.admin,
            updated_by=self.admin
        )
        # should not exceed limit
        process_sale(sale)
        acct.refresh_from_db()
        self.assertEqual(acct.current_balance, 100.00)
        txn = CreditTransaction.objects.get(sale=sale)
        self.assertEqual(txn.amount, 100.00)
        self.assertEqual(txn.type, 'debit')

    def test_process_sale_insufficient_stock_raises(self):
        sale = Sale.objects.create(
            customer=self.customer,
            total_amount=10 * 50.00,
            payment_type='Cash',
            created_by=self.admin,
            updated_by=self.admin
        )
        SaleItem.objects.create(
            sale=sale,
            product=self.prod,
            quantity=10,
            unit_price=50.00,
            total_price=500.00,
            created_by=self.admin,
            updated_by=self.admin
        )

        with self.assertRaises(ValidationError):
            process_sale(sale)