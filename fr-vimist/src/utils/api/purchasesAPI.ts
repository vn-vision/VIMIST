// purchasesAPI.ts
import axios from "axios";

export interface Purchase {
  id: number;
  product: number;
  quantity_purchased: number;
  purchase_price: number;
  purchase_date: string;
  supplier: string;
  payment_type: string;
}

const baseUrl = "http://localhost:8000/api/purchases/purchases";

// get all purchases
export const getPurchases = async () => {
  try {
    const response = await axios.get(`${baseUrl}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching purchases", error);
    throw error;
  }
};

// get a purchase by id
export const getPurchaseById = async (id: number) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error while geting the product", error);
  }
};

// add a new purchase
export const postPurchase = async (purchase: Purchase) => {
  try {
    const myToken = sessionStorage.getItem("accessToken");
    const response = await axios.post(`${baseUrl}/`, purchase, {
      headers: {
        Authorization: `Bearer ${myToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while adding the purchase", error);
    throw error;
  }
};

// update an existing purchase
export const updatePurchase = async (purchase: Purchase) => {
  try {
    const myToken = sessionStorage.getItem("accessToken");
    const response = await axios.put(`${baseUrl}/${purchase.id}/`, purchase, {
      headers: {
        Authorization: `Bearer ${myToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while updating the purchase", error);
    throw error;
  }
};

// delete an existing purchase
export const deletePurchase = async (id: number) => {
  try {
    const myToken = sessionStorage.getItem("accessToken");
    const response = await axios.delete(`${baseUrl}/${id}/`, {
      headers: {
        Authorization: `Bearer ${myToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting the purchase", error);
    throw error;
  }
};

// fetch all purchase by period
export const periodicPurchases = async () =>{
  try {
    const response = await axios.get('http://localhost:8000/api/purchases/total_purchases/');
    return response.data;
  } catch (error){
    console.error("Error while getting the total purchases ", error);
    throw error;
  }
};