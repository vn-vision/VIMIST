// purchasesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPurchases } from './purchasesAPI';

export const fetchPurchases = createAsyncThunk('purchases/fetchPurchases', async () => {
  const response = await getPurchases();
  return response;
});

const purchasesSlice = createSlice({
  name: 'purchases',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchases.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default purchasesSlice.reducer;
