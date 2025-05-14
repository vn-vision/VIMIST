from django.test import TestCase
from sales.models import Sale
from customers.models import Customer
from inventory.models import Product
from payments.models import Payment
from credit_sales.models import Credit_Sale
from users.models import User
from django.utils.timezone import now
from rest_framework.test import APIClient
# Create your tests here.

class SaleTestCase(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username='admin', role='Admin', is_superadmin=True, email='admin@gmail.com', password='superPass')
        self.manager = User.objects.create_user(username='manager', role='Manager', contact='0712345678', password='superPass')
        self.cashier = User.objects.create_user(username='cashier', role='Cashier', contact='0712345678', password='superPass')
        self.user = User.objects.create_user(username='user', role='Customer', contact='0712345678', password='superPass')
        self.customer = Customer.objects.create(name='customer', contact_info='0712345678')
        self.product = Product.objects.create(name='product', category='category', quantity_in_stock=10, unit_price=1000, reorder_level=5)

        self.admin_token = self.client.post('/api/users/login/', data={'username': 'admin', 'password': 'superPass'}).data['access']
        self.manager_token = self.client.post('/api/users/login/', data={'username': 'manager', 'password': 'superPass'}).data['access']
        self.cashier_token = self.client.post('/api/users/login/', data={'username': 'cashier', 'password': 'superPass'}).data['access']
        self.user_token = self.client.post('/api/users/login/', data={'username': 'user', 'password': 'superPass'}).data['access']

        self.client = APIClient()



    def test_sale_creation(self):
        # assert that the sale object is created successfully
        # Only admin and manager can change the sale details,
        # Cashier can only view the sale details
        response = self.client.post('/api/sales/sales/', data={
            'product': self.product.id,
            'customer': self.customer.id,
            'quantity_sold': 2,
            'total_price': 2000,
            'sale_date': now().date(),
            'payment_type': 'Cash'
        })
        return response
    
    def test_sale_update(self):
        # assert that the sale object is updated successfully
        # Only admin and manager can change the sale details,
        # Cashier can only view the sale details
        sale = Sale.objects.create(
            product=self.product,
            customer=self.customer,
            quantity_sold=2,
            total_price=2000,
            sale_date= now().date(),
            payment_type='Cash')
          
        response = self.client.put(f'/api/sales/sales/{sale.id}/', data={
            'product': self.product.id,
            'customer': self.customer.id,
            'quantity_sold': 2,
            'total_price': 2000,
            'sale_date': now().date(),
            'payment_type': 'Cash'
        })
        return response
    
    def test_sale_delete(self):
        # only admins can delete a particular sale
        response = self.client.delete('/api/sales/sales/1/',)
        return response
    
    def test_sale_list(self):
        # sales can be viewed by all users with privileges
        sale = Sale.objects.create(
            product=self.product,
            customer=self.customer,
            quantity_sold=2,
            total_price=2000,
            sale_date= now().date(),
            payment_type='Cash')
        
        response = self.client.get('/api/sales/sales/')
        response1 = self.client.get(f'/api/sales/sales/{sale.id}/')
        self.assertEqual(response1.status_code, 200)
        return response

    def test_sale_update_inventory(self):
        """ if a sale  is made, the inventory should be updated accordingly """
        Sale.objects.create(
            product=self.product,
            customer=self.customer,
            quantity_sold=2,
            total_price=2000,
            sale_date = now().date(),
            payment_type='Cash')
        
        self.product.refresh_from_db()
        self.assertEqual(self.product.quantity_in_stock, 8)
    
    def test_sale_payment(self):
        sale = Sale.objects.create(
            product=self.product,
            customer=self.customer,
            quantity_sold=2,
            total_price=2000,
            sale_date = now().date(),
            payment_type='Cash')
        
        sale2 = Sale.objects.create(
            product=self.product,
            customer=self.customer,
            quantity_sold=2,
            total_price=2000,
            sale_date = now().date(),
            payment_type='Mpesa')
        
        payment = Payment.objects.get(related=sale.id)
        self.assertEqual(payment.amount_paid, 2000)
        self.assertEqual(payment.payment_for, 'Sale')
        self.assertEqual(payment.payment_method, 'Cash')

        payment2 = Payment.objects.get(related=sale2.id)
        self.assertEqual(payment2.amount_paid, 2000)
        self.assertEqual(payment2.payment_for, 'Sale')
        self.assertEqual(payment2.payment_method, 'Mpesa')

    def test_sale_onCredit(self):
        sale = Sale.objects.create(
            product=self.product,
            customer=self.customer,
            quantity_sold=2,
            total_price=2000,
            sale_date= now().date(),
            payment_type='Credit')
        
        payment = Payment.objects.get(related=sale.id)
        
        self.assertEqual(payment.amount_paid, 2000)
        self.assertEqual(payment.payment_for, 'Sale')
        self.assertEqual(payment.payment_method, 'Credit')

        credit_sale = Credit_Sale.objects.get(sale=sale.id)
        self.assertEqual(credit_sale.sale, sale)
        self.assertEqual(credit_sale.customer, self.customer)

    def test_user_permissions(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.user_token)
        test_sale = self.test_sale_creation()
        self.assertEqual(test_sale.status_code, 403)

        test_sale_update = self.test_sale_update()
        self.assertEqual(test_sale_update.status_code, 403)

        test_sale_delete = self.test_sale_delete()
        self.assertEqual(test_sale_delete.status_code, 403)

        test_sale_list = self.test_sale_list()
        self.assertEqual(test_sale_list.status_code, 200)
    
    def test_manager_permissions(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.manager_token)
        test_sale = self.test_sale_creation()
        self.assertEqual(test_sale.status_code, 201)

        test_sale_update = self.test_sale_update()
        self.assertEqual(test_sale_update.status_code, 200)

        test_sale_delete = self.test_sale_delete()
        self.assertEqual(test_sale_delete.status_code, 403)

        test_sale_list = self.test_sale_list()
        self.assertEqual(test_sale_list.status_code, 200)
    
    def test_cashier_permissions(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.cashier_token)
        test_sale = self.test_sale_creation()
        self.assertEqual(test_sale.status_code, 403)

        test_sale_update = self.test_sale_update()
        self.assertEqual(test_sale_update.status_code, 403)

        test_sale_delete = self.test_sale_delete()
        self.assertEqual(test_sale_delete.status_code, 403)

        test_sale_list = self.test_sale_list()
        self.assertEqual(test_sale_list.status_code, 200)
    
    def test_admin_permissions(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.admin_token)
        test_sale = self.test_sale_creation()
        self.assertEqual(test_sale.status_code, 201)

        test_sale_update = self.test_sale_update()
        self.assertEqual(test_sale_update.status_code, 200)

        test_sale_delete = self.test_sale_delete()
        self.assertEqual(test_sale_delete.status_code, 204)

        test_sale_list = self.test_sale_list()
        self.assertEqual(test_sale_list.status_code, 200)

