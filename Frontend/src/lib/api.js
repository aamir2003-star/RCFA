import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor for adding JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("spectra-ai-token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling 401s
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle logout or token refresh here
            localStorage.removeItem("spectra-ai-token");
            localStorage.removeItem("spectra-ai-user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
