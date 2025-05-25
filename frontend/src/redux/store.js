import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice.jsx";
import productSlice from "./slices/productSlice.jsx";
import notificationSlice from "./slices/notificationSlice.js";

const store = configureStore({
    reducer: {
        authorization: authSlice,
        products: productSlice,
        notification: notificationSlice,
    }
})

export default store;