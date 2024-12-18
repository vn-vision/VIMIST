import axios from "axios";

//  define interface for customer
export interface Customer {
  id: number;
  name: string;
  contact: string;
}

const baseUrl = "http://localhost:8000/api/customers/customers/";

// get all customers
export const getCustomers = async () => {
  try {
    const response = await axios.get(`${baseUrl}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customers", error);
    throw error;
  }
};

//  get a customer by id
export const getCustomerById = async (id: number) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error while getting the customer", error);
    throw error;
  }
};

export const postCustomer = async (customer: Customer) => {
  try {
    const response = await axios.post(`${baseUrl}/`, customer, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while adding the customer", error);
    throw error;
  }
};

export const updateCustomer = async (customer: Customer) => {
  try {
    const response = await axios.put(`${baseUrl}/${customer.id}/`, customer, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while updating the customer", error);
    throw error;
  }
};

export const deleteCustomer = async (id: number) => {
  try {
    const response = await axios.delete(`${baseUrl}/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while deleting the customer", error);
    throw error;
  }
};
