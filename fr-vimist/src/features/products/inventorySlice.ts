import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getProducts,
  postProduct,
  updateProduct,
  deleteProduct,
  Product,
  getProductbyId,
} from "../../api/inventoryAPI";

// Define a type for the slice state
interface ProductState {
  products: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
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
      return error || 'Failed to load products';
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
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "An error occurred");
  }
});

// Add a new product
export const addNewProduct = createAsyncThunk<
  Product,
  Product,
  { rejectValue: string }
>("products/addNewProduct", async (product, { rejectWithValue }) => {
  try {
    const response = await postProduct(product);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "An error occurred");
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
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "An error occurred");
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
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "An error occurred");
  }
});


// Define the initial state using that type
const initialState: ProductState = {
  products: [] as Product[],
  status: "idle",
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
        state.status = "succeeded";
        console.log("Inventory []:", action.payload);
        state.products = action.payload;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load products";
      })

      // Handle geting a specific product
      .addCase(fetchProductById.pending, (state)=>{
        state.status = 'loading';
      })
      .addCase(fetchProductById.fulfilled, (state, action)=>{
        state.status = 'succeeded';
        state.products = state.products.filter((product) => product === action.payload);
      })
      .addCase(fetchProductById.rejected, (state, action)=>{
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch the product';
      })

      // Handle creating product
      .addCase(addNewProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
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
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to delete product";
      });
  },
});

export default productsSlice.reducer;
