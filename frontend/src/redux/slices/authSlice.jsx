import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    user: null,
}


export const checkAuth = createAsyncThunk(
    "/auth/checkauth",

    async () => {
        const response = await axios.get(
            "http://localhost:8000/api/auth/check-auth",
            {
                withCredentials: true,
                headers: {
                    "Cache-Control":
                        "no-store, no-cache, must-revalidate, proxy-revalidate",
                },
            }
        );

        return response.data;
    }
);

const authSlice = createSlice({
    name: "authorization",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logoutSuccess: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
    }
})

export default authSlice.reducer;
export const {loginSuccess, logoutSuccess} = authSlice.actions;
