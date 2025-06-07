from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from core.models import User, Company, Config
from inventory.models import Category, Product, Inventory
from purchases.models import Purchase, PurchaseItem
from sales.models import Sale, SaleItem, Customer
from payments.models import Payment
from credit.models import CreditAccount


class FullWorkFlowTest(TestCase):
    '''
    full workflow test that simulates:

    1. Register a new company & admin via /api/register/.
    2. Log in with token.
    3. Create a category and a product.
    4. Make a purchase of that product (nested).
    5. Make a sale of that product.
    6. Make a credit sale and then repay via /api/payments/.
    7. Verify the inventory, credit balances, and notifications.
    '''

    def setUp(self):
        self.client = APIClient()
    
    def test_end_to_end_purchase_sale_credit(self):
        # 1. register first admin & Company
        register_url = reverse('register')
        payload = {
            'email':'admin@shopco.com',
            'password':'SecurePass',
            'first_name':'First',
            'second_name':'admin',
            'company_name':'FullCo',
            'subdomain':'fullco',
            'role':'Admin'
        }

        resp = self.client.post(register_url, payload, format='multipart')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        token = resp.data['token']

        # 2. AUTHENTICATE
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)

        # 3. CREATE CATEGORY
        cat_url = reverse('category-list')
        cat_data  = {'name':'Cereals'}
        resp = self.client.post(cat_url, cat_data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        cat_id = resp.data['id']

        # 4. CREATE PRODUCT
        prod_url = reverse('product-list')
        prod_data = {
            'name':'Maize',
            'unit_price':100.00,
            'category':cat_id,
            'reorder_level':5
        }
        resp = self.client.post(prod_url, prod_data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        prod_id = resp.data['id']


        # 5. Purchase 10 Units(CASH)
        purchase_url = reverse('purchase-list')
        purchase_payload = {
            'supplier':None,
            'payment_type':'Cash',
            'purchase_item':[
                {
                    'product_id':prod_id,
                    'quantity':10,
                    'cost_price':'80.00',
                }
            ]
        }
        resp = self.client.post(purchase_url, purchase_payload, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

        # Verify inventory incremented
        inv = Inventory.objects.get(product_id=prod_id)
        self.assertEqual(inv.quantity, 10)

        # 6. Make a sale of 3 units
        sale_url = reverse('sale-list')
        sale_payload = {
            'customer':None,
            'payment_type':'Cash',
            'sale_item':[{
                'product_id':prod_id,
                'quantity': 3,
                'unit_price':'100.00',
            }]
        }
        resp = self.client.post(sale_url, sale_payload, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

        # Check inventoy is decremented
        inv = Inventory.objects.get(product=prod_id)
        self.assertEqual(inv.quantity, 7)

        # 7 . MAKE A CREDIT SALE 5 UNITS
        # Create a customer and their credit account
        cust = Customer.objects.create(name='Customer1', phone='254123456789')
        # Credit Account
        acct = CreditAccount.objects.create(customer=cust)


        sale_payload = {
            'customer':cust.id,
            'payment_type':'Credit',
            'sale_item':[{
                'product_id':prod_id,
                'quantity':5,
                'unit_price':'100.00',
            }]
        }
        resp = self.client.post(sale_url, sale_payload, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        inv.refresh_from_db()
        acct.refresh_from_db()

        # inventory should be down by 5
        self.assertEqual(inv.quantity, 2)
        self.assertEqual(acct.current_balance, 500.00)
        
        # 8) CREDIT REPAYMENT (Mpesa)
        # Customer pays 200
        payment_url = reverse('payment-list')
        payment_payload = {
            "amount": "200.00",
            "method": "Mpesa",
            "credit_account_id": acct.id,
            "reference_code": "ABC123"
        }
        resp = self.client.post(payment_url, payment_payload, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

        # Simulate external callback marking payment as 'Success'
        from payments.models import Payment
        pay = Payment.objects.get(reference_code="ABC123")
        pay.status = 'Success'
        pay.save()  # Triggers signal → apply_credit_payment

        acct.refresh_from_db()
        self.assertEqual(acct.current_balance, 300.00)

        # 9) CHECK NOTIFICATIONS 
        notif_url = reverse('notification-list')
        resp = self.client.get(notif_url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # There should be at least one notification (welcome + maybe others)
        self.assertTrue(len(resp.data['results']) >= 1)