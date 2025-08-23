import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const productService = {
    fetchAdminProducts: async () => {
        const response = await axios.get(`${API_BASE_URL}/api/products/admin`, {
            withCredentials: true
        });
        return response.data;
    },

    fetchPublicProducts: async () => {
        const response = await axios.get(`${API_BASE_URL}/api/products/public`);
        return response.data;
    },

    fetchFeaturedProducts: async () => {
        const response = await axios.get(`${API_BASE_URL}/api/products/featured`);
        return response.data;
    },

    fetchProductById: async (productId) => {
        const response = await axios.get(`${API_BASE_URL}/api/products/find/${productId}`);
        return response.data;
    },

    createProduct: async (productData) => {
        const response = await axios.post(`${API_BASE_URL}/api/products/create`, productData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true
        });
        return response.data;
    },

    updateProduct: async (id, updatedData) => {
        const response = await axios.put(`${API_BASE_URL}/api/products/update/${id}`, updatedData, {
            withCredentials: true
        });
        return response.data;
    },

    deleteProduct: async (productId) => {
        const response = await axios.delete(`${API_BASE_URL}/api/products/delete/${productId}`, {
            withCredentials: true
        });
        return response.data;
    },

    restoreProduct: async (productId) => {
        const response = await axios.patch(`${API_BASE_URL}/api/products/restore/${productId}`, {}, {
            withCredentials: true
        });
        return response.data;
    }
};

export default productService;
