'''
Shared default values for company configurations
'''
DEFAULT_CONFIG = {
    'system_name':'Vimist',
    'primary_color': '#FF5C00',
    'secondary_color': '#39FF14'
}

# PAYMENT TYPE ALLOWED
PAYMENT_TYPE = [
        ('Mpesa', 'Mpesa'),
        ('Cash', 'Cash'),
        ('Credit', 'Credit')
        ]

# CREDIT STATUS PER CUSTOMER
STATUS_CREDIT = [
    ('Active', 'Active'),
    ('Overdue', 'Overdue'),
    ('Closed', 'Closed')
    ]

# NOTIFICATION TYPES
NOTIFICATION_TYPE = [
    ('low_stock', 'low_stock'),
    ('overdue_payment', 'overdue_payment'),
    ('system_alert', 'system_alert')
]

# GROUPS AND THEIR ROLES
ROLE_GROUP_MAP = {
    'Admin': ['add_sale','change_sale','delete_sale'],
    'Clerk': ['add_sale','view_sale']
}