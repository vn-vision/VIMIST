from users.models import User

admin = User.objects.create_user(username='admin', password='adminpass', role='Admin')
manager = User.objects.create_user(username='manager', password='managerpass', role='Manager')
customer = User.objects.create_user(username='customer', password='customerpass', role='Customer')
