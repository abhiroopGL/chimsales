// frontend/src/redux/slices/cartSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios-instance.js";

const initialState = {
    items: [],
    loading: false,
    error: null,
    lastSynced: null,
};

// Fetch cart from backend
export const fetchCart = createAsyncThunk(
    "cart/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/api/cart");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Add to cart (backend)
export const addToCart = createAsyncThunk(
    "cart/add",
    async (productId, { rejectWithValue }) => {
        try {
            console.log("product:", productId);
            const response = await axiosInstance.post("/api/cart/add", {
                productId: productId,
                quantity: 1,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Remove from cart (backend)
export const removeFromCart = createAsyncThunk(
    "cart/remove",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/api/cart/remove/${productId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateCart = createAsyncThunk(
    "cart/updateQuantity",
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch("/api/cart/update", {
                productId,
                quantity,
            });
            console.log("Update cart response:", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const clearCart = createAsyncThunk(
    "cart/clear",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete("/api/cart/clear");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.items = action.payload.data || [];
                state.loading = false;
                state.lastSynced = Date.now();
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                console.log("Add to cart response:", action.payload.item);
                const newItem = action.payload.item;
                const existing = state.items.find(i => i.productId === newItem.productId);
                if (existing) {
                    existing.quantity = newItem.quantity;
                } else {
                    state.items.push(newItem);
                }
                state.loading = false;
                state.lastSynced = Date.now();
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Remove
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = state.items.filter(
                    item => item.productId !== action.payload.data.items[0]._id
                );
                state.loading = false;
                state.lastSynced = Date.now();
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCart.fulfilled, (state, action) => {
                const updatedItem = action.payload.data.items[0];
                const existing = state.items.find(i => i.productId === updatedItem.productId);
                if (existing) {
                    existing.quantity = updatedItem.quantity;
                }
                state.loading = false;
                state.lastSynced = Date.now();
            })
            .addCase(updateCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(clearCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.items = [];
                state.loading = false;
                state.lastSynced = Date.now();
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export default cartSlice.reducer;
