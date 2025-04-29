import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios-instance.js";

const initialState = {
    allProducts: [],
    product: null,
    isLoading: true,
    error: null,
    filter: "draft"
};

// Fetch all products
export const fetchProducts = createAsyncThunk(
    "/products/fetchAll",
    async () => {
        const response = await axiosInstance.get("/api/products");
        return response.data;
    }
);

// Fetch single product by ID
export const fetchProductById = createAsyncThunk(
    "/products/fetchById",
    async (productId) => {
        const response = await axiosInstance.get(`/api/products/find/${productId}`);
        return response.data;
    }
);

// Create a new product (for Admin or Manager)
export const createProduct = createAsyncThunk(
    "/products/create",
    async (productData) => {
        const response = await axiosInstance.post("/api/products/create", productData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        return response.data;
    }
);

// Update a product
export const updateProduct = createAsyncThunk(
    "/products/update",
    async ({ id, updatedData }) => {

        const response = await axiosInstance.put(`/api/products/update/${id}`, updatedData);
        return response.data;
    }
);

// Delete a product
export const deleteProduct = createAsyncThunk(
    "/products/delete",
    async (productId) => {
        const response = await axiosInstance.delete(`/api/products/${productId}`);
        return response.data;
    }
);

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setFilter: (state, action) => {
            state.filter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.allProducts = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })

            .addCase(fetchProductById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.product = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })

            .addCase(createProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.allProducts.push(action.payload);
                state.isLoading = false;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })

            .addCase(updateProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                // const index = state.products.findIndex(p => p.id === action.payload.id);
                // if (index !== -1) {
                //     state.allProducts[index] = action.payload;
                // }
                state.isLoading = false;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })

            .addCase(deleteProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.allProducts = state.products.filter(p => p.id !== action.payload.id);
                state.isLoading = false;
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export default productSlice.reducer;
