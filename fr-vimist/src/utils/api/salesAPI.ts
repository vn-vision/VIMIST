import axios from "axios";

const baseUrl = "http://localhost:8000/api/sales/sales";

export interface Sale {
  id: number;
  product: number;
  quantity_sold: number;
  sale_price: number;
  sale_date: string;
  customer: string | null;
  payment_type: string;
}


export const getSales = async () => {
  try {
    const response = await axios.get(`${baseUrl}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sales", error);
    throw error;
  }
};

//  get a sale by id
export const getSaleById = async (id: number) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error while getting the sale", error);
    throw error;
  }
};

export const postSale = async (sale: Sale) => {
  try {
    const myToken = sessionStorage.getItem("accessToken");
    const response = await axios.post(`${baseUrl}/`, sale, {
      headers: {
        Authorization: `Bearer ${myToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while adding the sale", error);
    throw error;
  }
};

export const updateSale = async (sale: Sale) => {
  try {
    const myToken = sessionStorage.getItem("accessToken");
    const response = await axios.put(`${baseUrl}/${sale.id}/`, sale, {
      headers: {
        Authorization: `Bearer ${myToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while updating the sale", error);
    throw error;
  }
};

export const deleteSale = async (id: number) => {
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
    console.error("Error while deleting the sale", error);
    throw error;
  }
};

export const periodicSales = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/sales/total_sales/');
    return response.data;
   } catch (error){
    console.error("Error while getting the total sales", error);
    throw error;
   }
};
