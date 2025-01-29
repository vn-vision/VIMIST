import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Customer, getCustomerById, getCustomers, postCustomer, updateCustomer, deleteCustomer } from "../../utils/api/customerAPI";

// define type for initial state
interface CustomerState {
    customers: Customer[];
    status: "idle" | "loading" | "failed" | "succeeded";
    error: string | null;
}

//  create thunks to get customers,
export const fetchCustomers = createAsyncThunk<Customer[], void>(
    "customers/fetchCustomers",
    async () => {
      try {
        const response = await getCustomers();
        return response.Customer;
      } catch (error: any) {
        return error.message || "Failed to fetch customers";
      }
    }
  );
  
  // get a single customer
  export const fetchCustomerById = createAsyncThunk<
    Customer,
    number,
    { rejectValue: string }
    >(
      "customers/fetchCustomerById",
      async (id, { rejectWithValue }) => {
        try {
          const response = await getCustomerById(id);
          return response;
        } catch (error: any) {
          return rejectWithValue(error.message || "Failed to fetch customer");
        }
      }
    );
  
  //   add a customer
  export const addNewCustomer = createAsyncThunk<Customer, Customer, { rejectValue: string }>(
      "customers/addNewCustomer",
      async (customeer, { rejectWithValue }) => {
          try {
          const response = await postCustomer(customeer);
          return response;
          } catch (error: any) {
          return rejectWithValue(error.message || "Failed to add customer");
          }
      }
  );
  
  // update a customer
  export const modifyCustomer = createAsyncThunk<Customer, Customer, { rejectValue: string }>(
      "customers/updateCustomer",
      async (customeer, { rejectWithValue }) => {
          try {
          const response = await updateCustomer(customeer);
          return response;
          } catch (error: any) {
          return rejectWithValue(error.message || "Failed to update customer");
          }
      }
  );
  
  // delete a customer
  export const removeCustomer = createAsyncThunk<number, number, { rejectValue: string }>(
      "customers/removeCustomer",
      async (id, { rejectWithValue }) => {
          try {
          const response = await deleteCustomer(id);
          return response;
          } catch (error: any) {
          return rejectWithValue(error.message || "Failed to delete customer");
          }
      }
  );
  
  
  // create the initial state
  const initialState: CustomerState = {
    customers: [],
    status: 'idle',
    error: null,
  };
  
  // create the customers slice
  
  const customerSlice = createSlice({
      name:'customers',
      initialState,
      reducers: {},
      extraReducers: (builder) => {
          builder
  
          // Handle status customers
          .addCase(fetchCustomers.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(fetchCustomers.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.customers = action.payload;
          })
          .addCase(fetchCustomers.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.error.message || 'Failed to load customers';
          })
  
          // handle status a single customer
          .addCase(fetchCustomerById.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(fetchCustomerById.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.customers = [action.payload];
          })
          .addCase(fetchCustomerById.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.error.message || 'Failed to load customer';
          })
  
          // handle adding a customer
          .addCase(addNewCustomer.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(addNewCustomer.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.customers.push(action.payload);
          })
          .addCase(addNewCustomer.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.error.message || 'Failed to add customer';
          })
  
          // handle updating a customer
          .addCase(modifyCustomer.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(modifyCustomer.fulfilled, (state, action) => {
              state.status = 'succeeded';
              const index = state.customers.findIndex((customeer) => customeer.id === action.payload.id);
              if (index !== -1) {
                  state.customers[index] = action.payload;
              }
          })
          .addCase(modifyCustomer.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.error.message || 'Failed to update customer';
          })
  
          // handle deleting a customer
          .addCase(removeCustomer.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(removeCustomer.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.customers = state.customers.filter((customeer) => customeer.id !== action.payload);
          })
          .addCase(removeCustomer.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.error.message || 'Failed to delete customer';
          })
      }
  });
  
  export default customerSlice.reducer;