import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice.jsx";
import productSlice from "./slices/productSlice.jsx";
import notificationSlice from "./slices/notificationSlice.js";
import cartSlice from "./slices/cartSlice.jsx";
import invoiceSlice from "./slices/invoiceSlice.jsx";
import orderSlice from "./slices/orderSlice.jsx";

const store = configureStore({
    reducer: {
        authorization: authSlice,
        products: productSlice,
        notification: notificationSlice,
        cart: cartSlice,
        invoices: invoiceSlice,
        orders: orderSlice
    }
})

export default store;