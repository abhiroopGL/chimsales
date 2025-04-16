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

export const fetchLoggedInUser = async () => {
    try {
        const res = await axiosInstance.get("/api/auth/check-auth");
        console.log("Result is:", res);
        return res.user;
    } catch (error) {
        console.log(error);
    }
}

