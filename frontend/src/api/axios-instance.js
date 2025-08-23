import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    withCredentials: true,
    timeout: 30000, // 30 seconds timeout
});

// Custom event system for loading state
const loadingEvents = {
    start: (text = 'Loading...') => {
        window.dispatchEvent(new CustomEvent('loading:start', { detail: { text } }));
    },
    stop: () => {
        window.dispatchEvent(new CustomEvent('loading:stop'));
    }
};

// Request interceptor to show loader
axiosInstance.interceptors.request.use(
    (config) => {
        // Don't show loader for certain requests
        const skipLoader = config.headers?.skipLoader;
        if (!skipLoader) {
            loadingEvents.start(config.loadingText || 'Loading...');
        }
        return config;
    },
    (error) => {
        loadingEvents.stop();
        return Promise.reject(error);
    }
);

// Response interceptor to hide loader
axiosInstance.interceptors.response.use(
    (response) => {
        loadingEvents.stop();
        return response;
    },
    (error) => {
        loadingEvents.stop();
        return Promise.reject(error);
    }
);

export default axiosInstance;