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
    async (product, { rejectWithValue }) => {
        try {
            console.log("product:", product);
            const response = await axiosInstance.post("/api/cart/add", {
                productId: product._id,
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
            const response = await axiosInstance.delete(`/api/cart/${productId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Sync entire cart (optional, on checkout or login)
export const syncCart = createAsyncThunk(
    "cart/sync",
    async (items, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put("/api/cart", { items });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find(item => item.productId === productId);
            if (item) {
                item.quantity = quantity;
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
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
                    item => item.productId !== action.payload.productId
                );
                state.loading = false;
                state.lastSynced = Date.now();
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Sync
            .addCase(syncCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(syncCart.fulfilled, (state, action) => {
                state.items = action.payload.items || [];
                state.loading = false;
                state.lastSynced = Date.now();
            })
            .addCase(syncCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
