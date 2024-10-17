import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getInventory, addProduct, updateProduct, deleteProduct } from './inventoryAPI';

export const fetchInventory = createAsyncThunk('inventory/fetchInventory', async () => {
    const response = await getInventory();
    return response;
});

const inventorySlice = createSlice({
    name: 'inventory',
    initialState: {
        products: [],
        status: 'idle',
        error: null,
    },
    reducers:{},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInventory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchInventory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = state.products.concat(action.payload);
            })
            .addCase(fetchInventory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default inventorySlice.reducer;