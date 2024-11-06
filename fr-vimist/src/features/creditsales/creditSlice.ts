import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCreditSales,
  getCreditSaleById,
  postCreditSale,
  updateCreditSale,
  deleteCreditSale,
  CreditSale,
} from "../../api/creditAPI";

// create the type for the initial state
interface CreditState {
  creditSales: CreditSale[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

//  create thunks to get credit sales,
export const fetchCreditSales = createAsyncThunk<CreditSale[], void>(
  "creditSales/fetchCreditSales",
  async () => {
    try {
      const response = await getCreditSales();
      return response;
    } catch (error: any) {
      return error.message || "Failed to fetch credit sales";
    }
  }
);

// get a single credit sale
export const fetchCreditSaleById = createAsyncThunk<
  CreditSale,
  number,
  { rejectValue: string }
  >(
    "creditSales/fetchCreditSaleById",
    async (id, { rejectWithValue }) => {
      try {
        const response = await getCreditSaleById(id);
        return response;
      } catch (error: any) {
        return rejectWithValue(error.message || "Failed to fetch credit sale");
      }
    }
  );

//   add a credit sale
export const addNewCreditSale = createAsyncThunk<CreditSale, CreditSale, { rejectValue: string }>(
    "creditSales/addNewCreditSale",
    async (creditSale, { rejectWithValue }) => {
        try {
        const response = await postCreditSale(creditSale);
        return response;
        } catch (error: any) {
        return rejectWithValue(error.message || "Failed to add credit sale");
        }
    }
);

// update a credit sale
export const modifyCreditSale = createAsyncThunk<CreditSale, CreditSale, { rejectValue: string }>(
    "creditSales/updateCreditSale",
    async (creditSale, { rejectWithValue }) => {
        try {
        const response = await updateCreditSale(creditSale);
        return response;
        } catch (error: any) {
        return rejectWithValue(error.message || "Failed to update credit sale");
        }
    }
);

// delete a credit sale
export const removeCreditSale = createAsyncThunk<number, number, { rejectValue: string }>(
    "creditSales/removeCreditSale",
    async (id, { rejectWithValue }) => {
        try {
        const response = await deleteCreditSale(id);
        return response;
        } catch (error: any) {
        return rejectWithValue(error.message || "Failed to delete credit sale");
        }
    }
);


// create the initial state
const initialState: CreditState = {
  creditSales: [] as CreditSale[],
  status: 'idle',
  error: null,
};

// create the credit sales slice

const creditSlice = createSlice({
    name:'creditSales',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

        // Handle status credit sales
        .addCase(fetchCreditSales.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchCreditSales.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.creditSales = action.payload;
        })
        .addCase(fetchCreditSales.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || 'Failed to load credit sales';
        })

        // handle status a single credit sale
        .addCase(fetchCreditSaleById.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchCreditSaleById.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.creditSales = [action.payload];
        })
        .addCase(fetchCreditSaleById.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || 'Failed to load credit sale';
        })

        // handle adding a credit sale
        .addCase(addNewCreditSale.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(addNewCreditSale.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.creditSales.push(action.payload);
        })
        .addCase(addNewCreditSale.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || 'Failed to add credit sale';
        })

        // handle updating a credit sale
        .addCase(modifyCreditSale.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(modifyCreditSale.fulfilled, (state, action) => {
            state.status = 'succeeded';
            const index = state.creditSales.findIndex((creditSale) => creditSale.id === action.payload.id);
            if (index !== -1) {
                state.creditSales[index] = action.payload;
            }
        })
        .addCase(modifyCreditSale.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || 'Failed to update credit sale';
        })

        // handle deleting a credit sale
        .addCase(removeCreditSale.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(removeCreditSale.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.creditSales = state.creditSales.filter((creditSale) => creditSale.id !== action.payload);
        })
        .addCase(removeCreditSale.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message || 'Failed to delete credit sale';
        })
    }
});

export default creditSlice.reducer;