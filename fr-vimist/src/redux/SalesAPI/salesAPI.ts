import axios from 'axios';

const baseUrl = 'http://localhost:8000/api/sales/sales';

export interface Sale {
    id: number;
    product: number;
    quantity_sold: number;
    sale_price: number;
    sale_date: string;
    customer: string;
    payment_type: string;
}

export const getSales = async () => {
    const response = await axios.get(`${baseUrl}/`);
    return response.data;
};

export const addSale = async (sale: Sale) => {
    const response = await axios.post(`${baseUrl}/`, sale);
    return response.data;
};

export const updateSale = async (sale: Sale) => {
    const response = await axios.put(`${baseUrl}/${sale.id}/`, sale);
    return response.data;
};

export const deleteSale = async (sale: Sale) => {
    const response = await axios.delete(`${baseUrl}/${sale.id}/`);
    return response.data;
}; 