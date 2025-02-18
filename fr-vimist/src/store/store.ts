import { configureStore } from "@reduxjs/toolkit";
import inventorySlice from "../features/products/inventorySlice";
import purchasesSlice from "../features/purchases/purchasesSlice";
import salesSlice from "../features/sales/salesSlice";
import paymentsSlice from "../features/payments/paymentsSlice";
import notificationsSlice from "../features/notifications/notificationsSlice";
import creditSlice from "../features/creditsales/creditSlice";
import customersSlice from "../features/customers/customersSlice";
import authSlice from "../features/authentication/authSlice";
import settingsSlice from "../features/settings/settingsSlice";

const store = configureStore({
    reducer: {
        auth:authSlice,
        inventory: inventorySlice,
        purchases: purchasesSlice,
        sales: salesSlice,
        creditSales: creditSlice,
        payments: paymentsSlice,
        notifications: notificationsSlice,
        credit: creditSlice,
        customers: customersSlice,
        config: settingsSlice,
    },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;