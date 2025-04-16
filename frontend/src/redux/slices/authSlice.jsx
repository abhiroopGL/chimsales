import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios-instance.js";

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
};


export const checkAuth = createAsyncThunk(
    "/auth/check-auth",
    async () => {
        console.log("Checking auth");
        const response = await axiosInstance.get("/api/auth/check-auth")
        console.log("CheckAuth Response: ", response.data);
        return response.data;
    }
);

export const loginUser =  createAsyncThunk(
    "/auth/login",
    async (userData) => {
        const response = await axiosInstance.post("/api/auth/login", userData);
        return response.data;
    }
)

const authSlice = createSlice({
    name: "authorization",
    initialState,
    reducers: {
        logoutSuccess: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.pending, (state) => {
            state.isLoading = true;
        })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = false;
            })
    }
})

export default authSlice.reducer;
export const {loginSuccess, logoutSuccess} = authSlice.actions;
