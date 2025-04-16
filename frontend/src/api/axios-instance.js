import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true   // Important to include cookies
})

export default axiosInstance;