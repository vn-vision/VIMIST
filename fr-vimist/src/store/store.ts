import { configureStore } from "@reduxjs/toolkit";
import inventorySlice from "../features/products/inventorySlice";
import purchasesSlice from "../features/purchases/purchasesSlice";
import salesSlice from "../features/sales/salesSlice";
import paymentsSlice from "../features/payments/paymentsSlice";
import notificationsSlice from "../features/notifications/notificationsSlice";
import creditSlice from "../features/creditsales/creditSlice";
import customersSlice from "../features/customers/customersSlice";
import authSlice from "../features/authentication/authSlice";

const store = configureStore({
    reducer: {
        auth:authSlice,
        inventory: inventorySlice,
        purchases: purchasesSlice,
        sales: salesSlice,
        payments: paymentsSlice,
        notifications: notificationsSlice,
        credit: creditSlice,
        customers: customersSlice,
    },
});


export default store;