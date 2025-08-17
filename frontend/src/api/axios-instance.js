import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://chimneystorebackend.onrender.com',
    withCredentials: true,  // Important to include cookies
    // headers: {
    //     "cache-control": "no-cache, no-store, must-revalidate, proxy-revalidate",
    // }
})

export default axiosInstance;