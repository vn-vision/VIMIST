import axios from "axios";

export interface Product {
  id: number;
  name: string;
  category: string;
  unit_price: number;
  quantity_in_stock: number;
  reorder_level: number;
  image?: File | null | string; // Optional property
}

const baseUrl = "http://127.0.0.1:8000/api/inventory/products";

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
export const postProduct = async (product: FormData) => {
  try {
    const myToken = sessionStorage.getItem("accessToken");
    const response = await axios.post(`${baseUrl}/`, product, {
      headers: {
        Authorization: `Bearer ${myToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding product", error);
    throw error;
  }
};

// update a product
export const updateProduct = async (product: Product) => {
  try {
    const myToken = sessionStorage.getItem("accessToken");
    const response = await axios.put(`${baseUrl}/${product.id}/`, product, {
      headers: {
        Authorization: `Bearer ${myToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product", error);
  }
};

// delete a product
export const deleteProduct = async (id: number) => {
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
    console.error("Error deleting product", error);
  }
};
