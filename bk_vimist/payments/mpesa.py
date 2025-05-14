import requests
import base64
import datetime
from .models import Payment
from django.conf import settings


class MpesaAPI:
    def __init__(self):
        self.base_url = settings.MPESA_BASE_URL
        self.consumer_key = settings.MPESA_CONSUMER_KEY
        self.consumer_secret = settings.MPESA_CONSUMER_SECRET
        self.shortcode = settings.MPESA_SHORTCODE
        self.passkey = settings.MPESA_PASSKEY
        self.callback_url = settings.MPESA_CALLBACK_URL

    def get_access_token(self):
        """ Generate an access token for M-pesa API"""
        url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
        response = requests.get(url, auth=(
            self.consumer_key, self.consumer_secret))
        response.raise_for_status()
        return response.json()["access_token"]

    def stk_push(self, phone_number, amount, reference=Payment):
        """ Trigger an STK push request."""
        access_token = self.get_access_token()
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        password = base64.b64encode(
            f"{self.shortcode}{self.passkey}{timestamp}".encode()).decode()
        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone_number,
            "PartyB": self.shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": self.callback_url,
            "AccountReference": "VIMIST",
            "TransactionDesc": "Purchases from VIMIST"
        }
        
        headers = {"Authorization":f"Bearer {access_token}"}
        url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"

        response = requests.post(url, json=payload, headers=headers)
        return response.json()