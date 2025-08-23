import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productService from "../../services/productService.js";

const initialState = {
    adminProducts: [],
    publicProducts: [],
    featuredProducts: [],
    product: null,
    isLoading: true,
    error: null,
    filter: "all"
};

// Fetch all products
export const fetchAdminProducts = createAsyncThunk(
    "/products/fetchAll",
    async () => {
        const response = await productService.fetchAdminProducts();
        return response;
    }
);

export const fetchPublicProducts = createAsyncThunk(
    "products/fetchPublic",
    async () => {
        const response = await productService.fetchPublicProducts();
        return response;
    }
);

export const fetchFeaturedProducts = createAsyncThunk(
    "products/fetchFeatured",
    async () => {
        const response = await productService.fetchFeaturedProducts();
        return response;
    }
);

// Fetch single product by ID
export const fetchProductById = createAsyncThunk(
    "/products/fetchById",
    async (productId) => {
        const response = await productService.fetchProductById(productId);
        return response;
    }
);

// Create a new product (for Admin or Manager)
export const createProduct = createAsyncThunk(
    "/products/create",
    async (productData, { dispatch }) => {
        const response = await productService.createProduct(productData);
        await dispatch(fetchAdminProducts());
        return response;
    }
);

// Update a product
export const updateProduct = createAsyncThunk(
    "/products/update",
    async ({ id, updatedData }) => {
        const response = await productService.updateProduct(id, updatedData);
        return response;
    }
);

// Delete a product
export const deleteProduct = createAsyncThunk(
    "/products/delete",
    async (productId) => {
        const response = await productService.deleteProduct(productId);
        return response;
    }
);

export const restoreProduct = createAsyncThunk(
    "/products/restore",
    async (productId, { dispatch }) => {
        const response = await productService.restoreProduct(productId);
        // Refresh the product list after successful restore
        await dispatch(fetchAdminProducts());
        return response;
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
                console.log("Public products fetched:", action.payload);
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
                // const index = state.adminProducts.findIndex(p => p._id === action.payload.id);
                // if (index !== -1) {
                //     state.adminProducts[index].deleted = false;
                //     state.adminProducts[index].deletedAt = null;
                //     state.adminProducts[index].status = "draft";
                // }
                state.isLoading = false;
            })
            .addCase(restoreProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
                state.featuredProducts = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchFeaturedProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { setFilter } = productSlice.actions; // Add this line to export the action

export default productSlice.reducer;
