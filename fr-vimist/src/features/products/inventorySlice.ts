import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProducts,
  postProduct,
  updateProduct,
  deleteProduct,
  Product,
  getProductbyId,
} from "../../utils/api/inventoryAPI";

// Define a type for the slice state
interface ProductState {
  products: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  message: string;
  error: string | null;
}

export const loadProducts = createAsyncThunk<Product[], void>(
  // load all products
  "products/loadProducts",
  async () => {
    try {
      const response = await getProducts();
      return response.Product;
    } catch (error: any) {
      console.log("Error:", error);
      return error || "Failed to load products";
    }
  }
);

export const fetchProductById = createAsyncThunk<
  Product,
  number,
  { rejectValue: string }
>("products/fetchProductById", async (id, { rejectWithValue }) => {
  try {
    const response = await getProductbyId(id);
    console.log("Product by id:", response);
    return response;
  } catch (error: any) {
    console.log("Error:", error);
    return rejectWithValue(
      error.response?.request.statusText || "An error occurred"
    );
  }
});

// Add a new product
export const addNewProduct = createAsyncThunk<
  Product,
  FormData,
  { rejectValue: string }
>("products/addNewProduct", async (product, { rejectWithValue }) => {
  try {
    const response = await postProduct(product);
    console.log("New Product:", response);
    return response;
  } catch (error: any) {
    console.log("Error:", error);
    return rejectWithValue(
      error.response?.request.statusText || "An error occurred"
    );
  }
});

// Modify a product
export const modifyProduct = createAsyncThunk<
  Product,
  Product,
  { rejectValue: string }
>("products/updateProduct", async (product, { rejectWithValue }) => {
  try {
    const response = await updateProduct(product);
    console.log("Updated Product:", response);
    return response;
  } catch (error: any) {
    console.log("Error:", error);
    return rejectWithValue(
      error.response?.request.statusText || "An error occurred"
    );
  }
});

// Remove a product
export const removeProduct = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("products/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    const response = await deleteProduct(id);
    console.log("Deleted Product:", response);
    return response;
  } catch (error: any) {
    console.log("Error:", error);
    return rejectWithValue(
      error.response?.request.statusText || "An error occurred"
    );
  }
});

// clear messages
export const clearMessages = createAsyncThunk<void, void>(
  "settings/clearMessages",
  async () => {
      return;
  }
);

// Define the initial state using that type
const initialState: ProductState = {
  products: [] as Product[],
  status: "idle",
  message: "",
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle loading products
      .addCase(loadProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        if (state.products){
          state.status = "succeeded";
          state.message = "success";
        }
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load products";
      })

      // Handle geting a specific product
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product === action.payload
        );
        if (state.products){
        state.status = "succeeded";
        state.message = "success";
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch the product";
      })

      // Handle creating product
      .addCase(addNewProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
        state.message = "success";
      })
      .addCase(addNewProduct.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to add product";
      })

      // Handle updating product
      .addCase(modifyProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(modifyProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.products){state.message = "success";}
      })
      .addCase(modifyProduct.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to update product";
      })

      // Handle deleting product
      .addCase(removeProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
        if (state.products){state.message = "success";}
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to delete product";
      })

      // handle clear messages
      .addCase(clearMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(clearMessages.fulfilled, (state) => {
        state.status = "idle";
        state.message = "";
        state.error = "";
      })
      .addCase(clearMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Could not clear Messages";
      });
  },
});

export default productsSlice.reducer;
