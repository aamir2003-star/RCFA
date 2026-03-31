import { create } from "zustand";
import api from "../lib/api";

const storedUser = localStorage.getItem("spectra-ai-user");
const storedToken = localStorage.getItem("spectra-ai-token");

let parsedUser = null;
try {
    parsedUser = storedUser ? JSON.parse(storedUser) : null;
} catch (e) {
    localStorage.removeItem("spectra-ai-user");
}

const useAuthStore = create((set) => ({
    user: parsedUser,
    token: storedToken,
    isAuthenticated: !!storedToken && !!parsedUser,

    login: async (email, password) => {
        try {
            const response = await api.post("/auth/login", { email, password });
            const { user, accessToken } = response.data;

            localStorage.setItem("spectra-ai-token", accessToken);
            localStorage.setItem("spectra-ai-user", JSON.stringify(user));

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

            localStorage.setItem("spectra-ai-token", accessToken);
            localStorage.setItem("spectra-ai-user", JSON.stringify(user));

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
        localStorage.removeItem("spectra-ai-token");
        localStorage.removeItem("spectra-ai-user");
        set({ user: null, token: null, isAuthenticated: false });
        window.location.href = "/";
    },

    updateUser: (user) => {
        localStorage.setItem("spectra-ai-user", JSON.stringify(user));
        set({ user });
    }
}));

export default useAuthStore;
