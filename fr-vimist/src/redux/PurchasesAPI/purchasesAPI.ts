// purchasesAPI.ts
import axios from 'axios';

export interface Purchase {
  id: number;
  product: number;
  quantity_purchased: number;
  purchase_price: number;
  purchase_date: string;
  supplier: string;
  payment_type: string;
}

const baseUrl = 'http://localhost:8000/api/purchases/purchases';

export const getPurchases = async () => {
  const response = await axios.get(`${baseUrl}/`);
  return response.data;
};

export const addPurchase = async (purchase: Purchase) => {
  const response = await axios.post(`${baseUrl}/`, purchase);
  return response.data;
};

export const updatePurchase = async (purchase: Purchase) => {
  const response = await axios.put(`${baseUrl}/${purchase.id}/`, purchase);
  return response.data;
};

export const deletePurchase = async (purchase: Purchase) => {
  const response = await axios.delete(`${baseUrl}/${purchase.id}/`);
  return response.data;
};
