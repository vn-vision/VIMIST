import axios from "axios";

//  define type for payment

export interface Payment {
  id: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  service: string;
}

const baseUrl = "http://localhost:8000/api/payments/payments";

// get all payments
export const getPayments = async (): Promise<Payment[]> => {
  try {
    const response = await axios.get(baseUrl);
    return response.data.Payment;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};

// get payment by id
export const getPaymentById = async (id: number): Promise<Payment> => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};

// post a payment
export const postPayment = async (payment: Payment): Promise<Payment> => {
  try {
    const myToken = sessionStorage.getItem("accessToken");
    const response = await axios.post(`${baseUrl}/`, payment, {
      headers: {
        Authorization: `Bearer ${myToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};

// update a payment
export const updatePayment = async (payment: Payment): Promise<Payment> => {
  try {
    const myToken = sessionStorage.getItem("accessToken");
    const response = await axios.put(`${baseUrl}/${payment.id}/`, payment, {
      headers: {
        Authorization: `Bearer ${myToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};

// delete a payment
export const deletePayment = async (id: number) => {
  try {
    const myToken = sessionStorage.getItem("accessToken");
    const response = await axios.delete(`${baseUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${myToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data);
  }
};
