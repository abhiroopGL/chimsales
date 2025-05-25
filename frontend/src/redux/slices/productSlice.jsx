import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios-instance.js";

const initialState = {
    adminProducts: [],
    publicProducts: [],
    product: null,
    isLoading: true,
    error: null,
    filter: "all"
};

// Fetch all products
export const fetchAdminProducts = createAsyncThunk(
    "/products/fetchAll",
    async () => {
        const response = await axiosInstance.get("/api/products/admin");
        return response.data;
    }
);

export const fetchPublicProducts = createAsyncThunk(
    "products/fetchPublic",
    async () => {
        const response = await axiosInstance.get("/api/products/public");
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
        const response = await axiosInstance.delete(`/api/products/delete/${productId}`);
        return response.data;
    }
);

export const restoreProduct = createAsyncThunk(
    "/products/restore",
    async (productId) => {
        const response = await axiosInstance.patch(`/api/products/restore/${productId}`);
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
            .addCase(fetchPublicProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchPublicProducts.fulfilled, (state, action) => {
                state.publicProducts = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchAdminProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.adminProducts = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
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
                state.adminProducts.push(action.payload);
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
                const index = state.adminProducts.findIndex(p => p._id === action.payload.product._id);
                if (index !== -1) {
                    state.adminProducts[index] = action.payload.product;
                }
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
                const index = state.adminProducts.findIndex(p => p._id === action.payload.id);
                if (index !== -1) {
                    state.adminProducts[index] = {
                        ...state.adminProducts[index],
                        deleted: true,
                        deletedAt: new Date().toISOString(),
                        status: "deleted"
                    };
                }
                state.isLoading = false;

            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(restoreProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(restoreProduct.fulfilled, (state, action) => {
                const index = state.adminProducts.findIndex(p => p._id === action.payload.id);
                if (index !== -1) {
                    state.adminProducts[index].deleted = false;
                    state.adminProducts[index].deletedAt = null;
                }
                state.isLoading = false;
            });

    },
});

export const { setFilter } = productSlice.actions; // Add this line to export the action

export default productSlice.reducer;
