import { configureStore } from "@reduxjs/toolkit";
import inventorySlice from "../features/products/inventorySlice";
import purchasesSlice from "../features/purchases/purchasesSlice";
import salesSlice from "../features/sales/salesSlice";

const store = configureStore({
    reducer: {
        inventory: inventorySlice,
        purchases: purchasesSlice,
        sales: salesSlice
    },
});


export default store;