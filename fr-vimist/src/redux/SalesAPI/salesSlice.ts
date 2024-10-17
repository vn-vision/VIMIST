// salesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSales } from './salesAPI';

export const fetchSales = createAsyncThunk('sales/fetchSales', async () => {
  const response = await getSales();
  return response;
});

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default salesSlice.reducer;
