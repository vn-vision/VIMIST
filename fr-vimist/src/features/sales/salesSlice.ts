import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import {
  Sale,
  getSales,
  getSaleById,
  postSale,
  updateSale,
  deleteSale,
} from "../../api/salesAPI";

// create type for the initial state
interface SalesState {
  sales: Sale[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// create different thunks for the sales
// get all sales
export const fetchSales = createAsyncThunk<Sale[], void>(
  "sales/fetchSales",
  async () => {
    try {
      const response = await getSales();
      return response;
    } catch (error: any) {
      return error || "Failed to load Sales";
    }
  }
);

// get a sale by id
export const fetchSaleById = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("sales/fetchSaleById", async (id, { rejectWithValue }) => {
  try {
    const response = await getSaleById(id);
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "An error occurred loading sale"
    );
  }
});

// add a new sale
export const addNewSale = createAsyncThunk<Sale, Sale, { rejectValue: string }>(
  "sales/addNewSale",
  async (sale, { rejectWithValue }) => {
    try {
      const response = await postSale(sale);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "An error occured adding Sale"
      );
    }
  }
);

// modify a sale
export const modifySale = createAsyncThunk<Sale, Sale, { rejectValue: string }>(
  "sales/updateSale",
  async (sale, { rejectWithValue }) => {
    try {
      const response = await updateSale(sale);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "An error occured making Purchase"
      );
    }
  }
);

// remove a sale
export const removeSale = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  "sales/deleteSale",
  async (id, {rejectWithValue}) => {
  try {
    const response = await deleteSale(id);
    return response;
  } catch (error: any) {
    return rejectWithValue(error || "Failed to delete item");
  }
});


// define initial state for sale
const initialState: SalesState ={
  sales:[],
  status: 'idle',
  error: null,
};
// create slice
const salesSlice = createSlice({
  name: 'Sales',
  initialState,
  reducers: {},
  extraReducers: (builder) =>{
    builder
    // Handle loading Sales
    .addCase(fetchSales.pending, (state) =>{
      state.status = 'loading';
    })
    .addCase(fetchSales.fulfilled, (state, action) =>{
      state.status = 'succeeded';
      state.sales = action.payload;
    })
    .addCase(fetchSales.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || 'Failed to load sales';
    })

    // get a product by Id
    .addCase(fetchSaleById.pending, (state)=>{
      state.status = 'loading';
    })
    .addCase(fetchSaleById.fulfilled, (state, action) =>{
      state.status = 'succeeded';
      state.sales = state.sales.filter((sale) => sale.id === action.payload);
    })
    .addCase(fetchSaleById.rejected, (state, action)=>{
      state.status = 'failed';
      state.error = action.error.message || 'Failed to fetch the sale'
    })

    // add a sale
    .addCase(addNewSale.pending, (state) => {
      state.status = "loading";
    })
    .addCase(addNewSale.fulfilled, (state, action) => {
      state.sales.push(action.payload);
    })
    .addCase(addNewSale.rejected, (state, action) => {
      state.error = (action.payload as string) || "Failed to add sale";
    })

    // Handle updating sale
    .addCase(modifySale.pending, (state) => {
      state.status = "loading";
    })
    .addCase(modifySale.fulfilled, (state, action) => {
      const index = state.sales.findIndex(
        (sale) => sale.id === action.payload.id
      );
      if (index !== -1) {
        state.sales[index] = action.payload;
      }
    })
    .addCase(modifySale.rejected, (state, action) => {
      state.error = (action.payload as string) || "Failed to update sale";
    })

    // Handle deleting sale
    .addCase(removeSale.pending, (state) => {
      state.status = "loading";
    })
    .addCase(removeSale.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.sales = state.sales.filter(
        (sale) => sale.id !== action.payload
      );
    })
    .addCase(removeSale.rejected, (state, action) => {
      state.error = (action.payload as string) || "Failed to delete sale";
    });
  }

});

export default salesSlice.reducer;