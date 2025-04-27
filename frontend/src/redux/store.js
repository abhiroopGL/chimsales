import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice.jsx";
import productSlice from "./slices/productSlice.jsx";

const store = configureStore({
    reducer: {
        authorization: authSlice,
        products: productSlice
    }
})

export default store;