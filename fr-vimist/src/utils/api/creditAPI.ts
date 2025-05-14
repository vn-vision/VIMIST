import axios from "axios";

// Define the CreditSale interface
export interface CreditSale {
  id: number;
  customer: number;
  sale: number;
  total_credit: number;
  outstanding_balance: number;
  due_date: string;
}

const baseUrl = "http://localhost:8000/api/credit_sales/credit_sales/";

// fetch all credit sales
export const getCreditSales = async () => {
  try {
    const response = await axios.get(`${baseUrl}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching credit sales: ", error);
    throw error;
  }
};

// fetch single credit sale
export const getCreditSaleById = async (id: number) => {
  try {
    const response = await axios.get(`${baseUrl}${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching credit sale: ", error);
    throw error;
  }
};

// add a credit sale
export const postCreditSale = async (creditSale: CreditSale) => {
  try {
    const myToken = sessionStorage.getItem("accessToken");
    const response = await axios.post(`${baseUrl}`, creditSale, {
      headers: {
        Authorization: `Bearer ${myToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding credit sale", error);
    throw error;
  }
};

// update a credit sale
export const updateCreditSale = async (creditSale: CreditSale) => {
  try {
    const myToken = sessionStorage.getItem("accessToken");
    const response = await axios.put(
      `${baseUrl}${creditSale.id}/`,
      creditSale,
      {
        headers: {
          Authorization: `Bearer ${myToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating credit sale", error);
    throw error;
  }
};

// delete a credit sale
export const deleteCreditSale = async (id: number) => {
  try {
    const myToken = sessionStorage.getItem("accessToken");
    const response = await axios.delete(`${baseUrl}${id}/`, {
      headers: {
        Authorization: `Bearer ${myToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting credit sale", error);
    throw error;
  }
};
