import axios from "axios";

export interface Product {
  id: number;
  name: string;
  category: string;
  unit_price: number;
  quantity_in_stock: number;
  reorder_level: number;
}

const baseUrl = "http://localhost:8000/inventory/products";

// fetch all products
export const getProducts = async () => {
  try {
    const response = await axios.get(`${baseUrl}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products: ", error);
    throw error;
  }
};

// fetch a single product
export const getProductbyId = async (id: number) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product: ", error);
    throw error;
  }
};

// post a product
export const postProduct = async (product: Product) => {
  try {
    const response = await axios.post(`${baseUrl}/`, product);
    return response.data;
  } catch (error) {
    console.error("Error adding product", error);
    throw error;
  }
};

// update a product
export const updateProduct = async (product: Product) => {
  try {
    const response = await axios.put(`${baseUrl}/${product.id}/`, product);
    return response.data;
  } catch (error) {
    console.error("Error updating product", error);
  }
};

// delete a product
export const deleteProduct = async (id: number) => {
  try {
    const response = await axios.delete(`${baseUrl}/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product", error);
  }
};