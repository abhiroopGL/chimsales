import {configureStore} from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice.jsx";

const store = configureStore({
    reducer: {
        authorization: authSlice
    }
})

export default store;