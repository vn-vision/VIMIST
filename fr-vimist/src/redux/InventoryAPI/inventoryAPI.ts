import axios from 'axios';

export interface Product {
    id: number,
    name: string,
    category: string,
    unit_price: number,
    quantity_in_stock: number,
    reorder_level: number,
}

const baseUrl = 'http://localhost:8000/inventory/products';

export const getInventory = async () => {
    const response = await axios.get(`@{baseURL}/`);
    return response.data;
};

export const addProduct = async(product: Product) =>{
    const response = await axios.post(`${baseUrl}/`, product);
    return response.data;
};

export const updateProduct = async (product: Product) => {
    const response = await axios.put(`${baseUrl}/${product.id}/`, product);
    return response.data;
};

export const deleteProduct = async (product: Product) => {
    const response = await axios.delete(`${baseUrl}/${product.id}/`);
    return response.data;
};