import { configureStore } from '@reduxjs/toolkit';
import inventorySlice from './InventoryAPI/inventorySlice';
import purchasesSlice from './PurchasesAPI/purchasesSlice';
import salesSlice from './SalesAPI/salesSlice';

export const store = configureStore({
  reducer: {
    inventory: inventorySlice,
    purchases: purchasesSlice,
    sales: salesSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
