import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const authService = {
    checkAuth: async () => {
        const response = await axios.get(`${API_BASE_URL}/api/auth/check-auth`, {
            withCredentials: true
        });
        return response.data;
    },

    login: async (userData) => {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, userData, {
            withCredentials: true
        });
        return response.data;
    },

    register: async (userData) => {
        const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData, {
            withCredentials: true
        });
        return response.data;
    },

    logout: async () => {
        const response = await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
            withCredentials: true
        });
        return response.data;
    }
};

export default authService;
