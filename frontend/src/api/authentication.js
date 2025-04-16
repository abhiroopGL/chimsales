import axiosInstance from './axios-instance.js'
import axios from "axios";

export const loginUser = async (credentials) => {
    try {
        const res = await axiosInstance.post("/api/auth/login", credentials);
        console.log(res)
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Login failed" };
    }
};

export const registerUser = async (userData) => {
    try {
        console.log("requesting to backend with", userData);
        const res = await axiosInstance.post("/api/auth/register", userData);
        console.log("Response from backend:", res);
        return res.data;
    } catch (error) {
        throw error.response?.data || { error: "Registration failed" };
    }
};

export const logoutUser = async () => {
    try {
        await axiosInstance.post("/api/auth/logout");
    } catch (error) {
        console.error("Logout error:", error);
    }
};

