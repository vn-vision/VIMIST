// purchasesSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getPurchases,
  getPurchaseById,
  postPurchase,
  updatePurchase,
  deletePurchase,
  periodicPurchases,
  Purchase,
} from "../../utils/api/purchasesAPI";
import { Period } from "../sales/salesSlice";

// load all purchases
export const fetchPurchases = createAsyncThunk<Purchase[], void>(
  "purchases/fetchPurchases",
  async () => {
    try {
      const response = await getPurchases();
      return response.Purchases;
    } catch (error: any) {
      return error.response.request.statusText|| "An error occurred";
    }
  }
);

export const fetchPurchaseById = createAsyncThunk<
  Purchase,
  number,
  { rejectValue: string }
>("purchases/fetchPurchaseById", async (id, { rejectWithValue }) => {
  try {
    const response = await getPurchaseById(id);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.request.statusText || "An error occurred");
  }
});

// Add a new purchase
export const addNewPurchase = createAsyncThunk<
  Purchase,
  Purchase,
  { rejectValue: string }
>("purchases/addNewPurchase", async (purchase, { rejectWithValue }) => {
  try {
    const response = await postPurchase(purchase);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.request.statusText || "An error occurred");
  }
});

// Modify a purchase
export const modifyPurchase = createAsyncThunk<
  Purchase,
  Purchase,
  { rejectValue: string }
>("purchases/updatePurchase", async (purchase, { rejectWithValue }) => {
  try {
    const response = await updatePurchase(purchase);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.request.statusText|| "An error occurred");
  }
});

// Delete a purchase
export const removePurchase = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("purchases/deletePurchase", async (id, { rejectWithValue }) => {
  try {
    const response = await deletePurchase(id);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.request.statusText || "An error occurred");
  }
});


// fetch purchases by period
export const fetchPeriodicPurchases = createAsyncThunk<Period[], void>(
  "Purchases/fetchPeriodPurchases",
  async () => {
    try {
      const response = await periodicPurchases();
      return response;
    } catch (error: any) {
      return error || "Failed to load Sales"
    }
  }
)

// clear  Messages
export const clearMessages = createAsyncThunk(
  "Purchases/clearMessages",
  async () => {
    return;
  }
);

// Define type for the slice state
interface PurchasesState {
  purchases: Purchase[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  period: Period[];
  message: string;
}

const initialState: PurchasesState = {
  purchases: [],
  status: "idle",
  error: null,
  period: [],
  message: ""
};

const purchasesSlice = createSlice({
  name: "purchases",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // load all purchases
      .addCase(fetchPurchases.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.purchases = action.payload;
        if (state.purchases) {
          state.status = "succeeded";
          state.message = "Purchases loaded";
        }
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load purchases";
      })

      // get a purchase by id
      .addCase(fetchPurchaseById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPurchaseById.fulfilled, (state, action) => {
        state.purchases = [action.payload];
        if (state.purchases) {
          state.status = "succeeded";
          state.message = "Purchase loaded";
        }
      })
      .addCase(fetchPurchaseById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load purchase";
      })

      // Add a new purchase
      .addCase(addNewPurchase.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNewPurchase.fulfilled, (state, action) => {
        state.purchases.push(action.payload);
        state.status = "succeeded";
        state.message = "Purchase added";
      })
      .addCase(addNewPurchase.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to add purchase";
      })

      // Modify a purchase
      .addCase(modifyPurchase.pending, (state) => {
        state.status = "loading";
      })
      .addCase(modifyPurchase.fulfilled, (state, action) => {
        const index = state.purchases.findIndex(
          (purchase) => purchase.id === action.payload.id
        );
        if (index !== -1) {
          state.purchases[index] = action.payload;
        }
        if (state.purchases) {
          state.status = "succeeded";
          state.message = "Purchase updated";
        }
      })
      .addCase(modifyPurchase.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to update purchase";
      })

      // Delete a purchase
      .addCase(removePurchase.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removePurchase.fulfilled, (state, action) => {
        state.purchases = state.purchases.filter(
          (purchase) => purchase.id !== action.payload
        );
        if (state.purchases) {
          state.status = "succeeded";
          state.message = "Purchase deleted";
        }
      })
      .addCase(removePurchase.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string|| "Failed to delete purchase";
      })

      // fetch purchases by Period
      .addCase(fetchPeriodicPurchases.pending, (state)=>{
        state.status = "loading";
      })
      .addCase(fetchPeriodicPurchases.fulfilled, (state, action) =>{
        state.period = action.payload;
        if (state.period){
          state.status = "succeeded";
          state.message = "Periodic Purchases loaded";
        }
      })
      .addCase(fetchPeriodicPurchases.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch Purchases by period';
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

export default purchasesSlice.reducer;