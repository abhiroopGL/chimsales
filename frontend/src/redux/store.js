import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice.jsx";
import productSlice from "./slices/productSlice.jsx";
import notificationSlice from "./slices/notificationSlice.js";
import cartSlice from "./slices/cartSlice.js";

const store = configureStore({
    reducer: {
        authorization: authSlice,
        products: productSlice,
        notification: notificationSlice,
        cart: cartSlice,
    }
})

export default store;