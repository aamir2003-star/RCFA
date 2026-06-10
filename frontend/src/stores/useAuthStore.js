import { create } from "zustand";
import api from "../lib/api";

const storedUser = localStorage.getItem("spectra-ai-user");
const storedToken = localStorage.getItem("spectra-ai-token");
const storedRefreshToken = localStorage.getItem("spectra-ai-refresh-token");

let parsedUser = null;
try {
    parsedUser = storedUser ? JSON.parse(storedUser) : null;
} catch (e) {
    localStorage.removeItem("spectra-ai-user");
}

const useAuthStore = create((set) => ({
    user: parsedUser,
    token: storedToken,
    refreshToken: storedRefreshToken,
    isAuthenticated: !!storedToken && !!parsedUser,

    login: async (email, password) => {
        try {
            const response = await api.post("/auth/login", { email, password });
            const { user, accessToken, refreshToken } = response.data;

            localStorage.setItem("spectra-ai-token", accessToken);
            localStorage.setItem("spectra-ai-refresh-token", refreshToken);
            localStorage.setItem("spectra-ai-user", JSON.stringify(user));

            set({ user, token: accessToken, refreshToken, isAuthenticated: true });
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
            const { user, accessToken, refreshToken } = response.data;

            localStorage.setItem("spectra-ai-token", accessToken);
            localStorage.setItem("spectra-ai-refresh-token", refreshToken);
            localStorage.setItem("spectra-ai-user", JSON.stringify(user));

            set({ user, token: accessToken, refreshToken, isAuthenticated: true });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed"
            };
        }
    },

    logout: async () => {
        const refreshToken = localStorage.getItem("spectra-ai-refresh-token");
        try {
            if (refreshToken) {
                await api.post("/auth/logout", { refreshToken });
            }
        } catch (_) {
            // Ignore errors — we always clear locally
        } finally {
            localStorage.removeItem("spectra-ai-token");
            localStorage.removeItem("spectra-ai-refresh-token");
            localStorage.removeItem("spectra-ai-user");
            set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
            window.location.href = "/login";
        }
    },

    updateUser: (user) => {
        localStorage.setItem("spectra-ai-user", JSON.stringify(user));
        set({ user });
    },

    updateProfile: async (profileData) => {
        try {
            const response = await api.put("/auth/profile", profileData);
            const { user } = response.data;
            localStorage.setItem("spectra-ai-user", JSON.stringify(user));
            set({ user });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Profile update failed"
            };
        }
    },

    updateAvatar: async (formData) => {
        try {
            const response = await api.post("/uploads/avatar", formData);
            const { user } = response.data;
            localStorage.setItem("spectra-ai-user", JSON.stringify(user));
            set({ user });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Avatar update failed"
            };
        }
    },

    updateCover: async (formData) => {
        try {
            const response = await api.post("/uploads/cover", formData);
            const { user } = response.data;
            localStorage.setItem("spectra-ai-user", JSON.stringify(user));
            set({ user });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Cover update failed"
            };
        }
    }
}));

export default useAuthStore;
