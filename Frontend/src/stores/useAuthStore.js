import { create } from "zustand";
import api from "../lib/api";

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("rcfa-user")) || null,
    token: localStorage.getItem("rcfa-token") || null,
    isAuthenticated: !!localStorage.getItem("rcfa-token"),

    login: async (email, password) => {
        try {
            const response = await api.post("/auth/login", { email, password });
            const { user, accessToken } = response.data;

            localStorage.setItem("rcfa-token", accessToken);
            localStorage.setItem("rcfa-user", JSON.stringify(user));

            set({ user, token: accessToken, isAuthenticated: true });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Login failed"
            };
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post("/auth/register", userData);
            const { user, accessToken } = response.data;

            localStorage.setItem("rcfa-token", accessToken);
            localStorage.setItem("rcfa-user", JSON.stringify(user));

            set({ user, token: accessToken, isAuthenticated: true });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed"
            };
        }
    },

    logout: () => {
        localStorage.removeItem("rcfa-token");
        localStorage.removeItem("rcfa-user");
        set({ user: null, token: null, isAuthenticated: false });
        window.location.href = "/";
    },

    updateUser: (user) => {
        localStorage.setItem("rcfa-user", JSON.stringify(user));
        set({ user });
    }
}));

export default useAuthStore;
