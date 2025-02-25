import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  Payment,
  MpesaPaymentRequest,
  MpesaPaymentResponse,
  getPayments,
  getPaymentById,
  postPayment,
  updatePayment,
  deletePayment,
  initiateMpesaPayment,
} from "../../utils/api/paymentsAPI";

// Define the type for initial state
interface PaymentState {
  Payments: Payment[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  message: string;
  MpesaResponse: MpesaPaymentResponse | null;
}

//  create thunks to get payments,
export const fetchPayments = createAsyncThunk<Payment[], void>(
  "Payments/fetchPayments",
  async () => {
    try {
      const response = await getPayments();
      return response;
    } catch (error: any) {
      return error.message || "Failed to fetch payments";
    }
  }
);

// get a single payment
export const fetchPaymentById = createAsyncThunk<
  Payment,
  number,
  { rejectValue: string }
>("Payments/fetchPaymentById", async (id, { rejectWithValue }) => {
  try {
    const response = await getPaymentById(id);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch payment");
  }
});

//   add a payment
export const addNewPayment = createAsyncThunk<
  Payment,
  Payment,
  { rejectValue: string }
>("Payments/addNewPayment", async (Payment, { rejectWithValue }) => {
  try {
    const response = await postPayment(Payment);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to add payment");
  }
});

// initiate Mpesa Payment
export const initiateMobilePayment = createAsyncThunk<
  MpesaPaymentResponse,
  MpesaPaymentRequest,
  { rejectValue: string }
>("Payments/initiateMobilePayment", async (payment, { rejectWithValue }) => {
  try {
    const response = await initiateMpesaPayment(payment);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to initiate payment");
  }
});

// update a payment
export const modifyPayment = createAsyncThunk<
  Payment,
  Payment,
  { rejectValue: string }
>("Payments/updatePayment", async (payment, { rejectWithValue }) => {
  try {
    const response = await updatePayment(payment);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update payment");
  }
});

// delete a payment
export const removePayment = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("Payments/removePayment", async (id, { rejectWithValue }) => {
  try {
    const response = await deletePayment(id);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to delete payment");
  }
});

// clear the status message
export const clearMessages = createAsyncThunk(
  "Payments/clearMessages",
  async () => {
    return;
  }
);

// create the initial state
const initialState: PaymentState = {
  Payments: [],
  status: "idle",
  error: null,
  message: "",
  MpesaResponse: null,
};

// create the payments slice

const paymentSlice = createSlice({
  name: "Payments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Handle status payments
      .addCase(fetchPayments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.Payments = action.payload;
        if (state.Payments) {
          state.status = "succeeded";
          state.message = "Payments loaded";
        }
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load payments";
      })

      // handle status a single payment
      .addCase(fetchPaymentById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.Payments = [action.payload];
        if (state.Payments) {
          state.status = "succeeded";
          state.message = "Payment loaded";
        }
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load payment";
      })

      // handle adding a payment
      .addCase(addNewPayment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNewPayment.fulfilled, (state, action) => {
        state.Payments.push(action.payload);
        state.status = "succeeded";
        state.message = "Payment added";
      })
      .addCase(addNewPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to add payment";
      })

      // handle updating a payment
      .addCase(modifyPayment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(modifyPayment.fulfilled, (state, action) => {
        const index = state.Payments.findIndex(
          (Payment) => Payment.id === action.payload.id
        );
        if (index !== -1) {
          state.Payments[index] = action.payload;
        }
        if (state.Payments) {
          state.status = "succeeded";
          state.message = "Payment updated";
        }
      })
      .addCase(modifyPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to update payment";
      })

      // handle deleting a payment
      .addCase(removePayment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removePayment.fulfilled, (state, action) => {
        state.Payments = state.Payments.filter(
          (Payment) => Payment.id !== action.payload
        );
        if (state.Payments) {
          state.status = "succeeded";
          state.message = "Payment deleted";
        }
      })
      .addCase(removePayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to delete payment";
      })

      // handle initiating a payment
      .addCase(initiateMobilePayment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initiateMobilePayment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = "Payment initiated";
        state.MpesaResponse = action.payload;
      })
      .addCase(initiateMobilePayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to initiate payment";
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

export default paymentSlice.reducer;
