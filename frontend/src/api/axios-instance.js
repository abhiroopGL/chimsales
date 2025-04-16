import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,  // Important to include cookies
    // headers: {
    //     "cache-control": "no-cache, no-store, must-revalidate, proxy-revalidate",
    // }
})

export default axiosInstance;