from django.test import TestCase
from inventory.models import Product
from payments.models import Payment
from purchases.models import Purchases
from users.models import User
from django.utils.timezone import now
from rest_framework.test import APIClient

# Create your tests here.
class PurchasesTests(TestCase):
    def setUp(self):
        self.product = Product.objects.create(name='product', category='category', quantity_in_stock=10, unit_price=1000, reorder_level=5)
        self.admin = User.objects.create_user(username='admin', role='Admin', is_superadmin=True, email='admin@gmail.com', password='SecurePass')
        self.manager = User.objects.create_user(username='manager', role='Manager', contact='0712345678', password='SecurePass')
        self.cashier = User.objects.create_user(username='cashier', role='Cashier', contact='0712345678', password='SecurePass')
        self.user = User.objects.create_user(username='user', role='Customer', contact='0712345678', password='SecurePass')
        self.client = APIClient()

        self.admin_token = self.client.post('/api/users/login/', data={'username': 'admin', 'password': 'SecurePass'}).data['access']
        self.manager_token = self.client.post('/api/users/login/', data={'username': 'manager', 'password': 'SecurePass'}).data['access']
        self.cashier_token = self.client.post('/api/users/login/', data={'username': 'cashier', 'password': 'SecurePass'}).data['access']
        self.user_token = self.client.post('/api/users/login/', data={'username': 'user', 'password': 'SecurePass'}).data['access']


    def test_purchase_creation(self):
        # assert that the purchase object is created successfully
        response = self.client.post('/api/purchases/purchases/', data={
            'product': self.product.id,
            'quantity_purchased': 2,
            'purchase_price': 2000,
            'purchase_date': now().date(),
            'supplier': 'supplier',
            'payment_type': 'Cash'
        })
        return response
    
    def test_purchase_update(self):
        # assert that the purchase object is updated successfully
        purchase = Purchases.objects.create(
            product=self.product,
            quantity_purchased=3,
            purchase_price=2000,
            purchase_date= now().date(),
            supplier='supplier',
            payment_type='Cash')
          
        response = self.client.put(f'/api/purchases/purchases/{purchase.id}/', data={
            'product': self.product.id,
            'quantity_purchased': 2,
            'purchase_price': 2000,
            'purchase_date': now().date(),
            'supplier': 'supplier',
            'payment_type': 'Cash'
        })
        return response
    
    def test_purchase_deletion(self):
        # assert that the purchase object is deleted successfully
        purchase = Purchases.objects.create(
            product=self.product,
            quantity_purchased=3,
            purchase_price=2000,
            purchase_date= now().date(),
            supplier='supplier',
            payment_type='Cash')
          
        response = self.client.delete(f'/api/purchases/purchases/{purchase.id}/')
        return response
    
    def test_purchase_list(self):
        # assert that the purchase object is listed successfully
        response = self.client.get('/api/purchases/purchases/')
        return response
    
    def test_purchase_retrieval(self):
        # assert that the purchase object is retrieved successfully
        purchase = Purchases.objects.create(
            product=self.product,
            quantity_purchased=3,
            purchase_price=2000,
            purchase_date= now().date(),
            supplier='supplier',
            payment_type='Cash')
          
        response = self.client.get(f'/api/purchases/purchases/{purchase.id}/')
        return response
    
    def test_purchase_update_inventory(self):
        """ if a purchase is made, the inventory should be updated accordingly """
        Purchases.objects.create(
            product=self.product,
            quantity_purchased=2,
            purchase_price=2000,
            purchase_date = now().date(),
            supplier='supplier',
            payment_type='Cash')
        
        product = Product.objects.get(id=self.product.id)
        self.assertEqual(product.quantity_in_stock, 12)

    def test_purchase_payment(self):
        purchase = Purchases.objects.create(
            product=self.product,
            quantity_purchased=2,
            purchase_price=2000,
            purchase_date = now().date(),
            supplier='supplier',
            payment_type='Cash')
        
        purchase2 = Purchases.objects.create(
            product=self.product,
            quantity_purchased=2,
            purchase_price=2000,
            purchase_date = now().date(),
            supplier='supplier',
            payment_type='Mpesa')
        
        payment = Payment.objects.get(related=purchase.id)
        self.assertEqual(payment.amount_paid, 2000) and self.assertEqual(payment.payment_method, 'Cash')
        payment2 = Payment.objects.get(related=purchase2.id)
        self.assertEqual(payment2.amount_paid, 2000) and self.assertEqual(payment2.payment_method, 'Mpesa')
    
    def test_customer_purchase_permissions(self):
        # only managers and admin can create a purchase
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.user_token)

        test_purchase_creation = self.test_purchase_creation()
        self.assertEqual(test_purchase_creation.status_code, 403)

        test_purchase_update = self.test_purchase_update()
        self.assertEqual(test_purchase_update.status_code, 403)

        test_purchase_deletion = self.test_purchase_deletion()
        self.assertEqual(test_purchase_deletion.status_code, 403)

        test_purchase_list = self.test_purchase_list()
        self.assertEqual(test_purchase_list.status_code, 200)

        test_purchase_retrieval = self.test_purchase_retrieval()
        self.assertEqual(test_purchase_retrieval.status_code, 200)

    def test_cashier_purchase_permissions(self):
        # only managers and admin can create a purchase
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.cashier_token)

        test_purchase_creation = self.test_purchase_creation()
        self.assertEqual(test_purchase_creation.status_code, 403)

        test_purchase_update = self.test_purchase_update()
        self.assertEqual(test_purchase_update.status_code, 403)

        test_purchase_deletion = self.test_purchase_deletion()
        self.assertEqual(test_purchase_deletion.status_code, 403)

        test_purchase_list = self.test_purchase_list()
        self.assertEqual(test_purchase_list.status_code, 200)

        test_purchase_retrieval = self.test_purchase_retrieval()
        self.assertEqual(test_purchase_retrieval.status_code, 200)

    def test_manager_purchase_permissions(self):
        # only managers and admin can create a purchase
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.manager_token)

        test_purchase_creation = self.test_purchase_creation()
        self.assertEqual(test_purchase_creation.status_code, 201)

        test_purchase_update = self.test_purchase_update()
        self.assertEqual(test_purchase_update.status_code, 200)

        test_purchase_deletion = self.test_purchase_deletion()
        self.assertEqual(test_purchase_deletion.status_code, 403)

        test_purchase_list = self.test_purchase_list()
        self.assertEqual(test_purchase_list.status_code, 200)

        test_purchase_retrieval = self.test_purchase_retrieval()
        self.assertEqual(test_purchase_retrieval.status_code, 200)

    def test_admin_purchase_permissions(self):
        # only managers and admin can create a purchase
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.admin_token)

        test_purchase_creation = self.test_purchase_creation()
        self.assertEqual(test_purchase_creation.status_code, 201)

        test_purchase_update = self.test_purchase_update()
        self.assertEqual(test_purchase_update.status_code, 200)

        test_purchase_deletion = self.test_purchase_deletion()
        self.assertEqual(test_purchase_deletion.status_code, 204)

        test_purchase_list = self.test_purchase_list()
        self.assertEqual(test_purchase_list.status_code, 200)

        test_purchase_retrieval = self.test_purchase_retrieval()
        self.assertEqual(test_purchase_retrieval.status_code, 200)