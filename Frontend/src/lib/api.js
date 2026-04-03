import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Attach the current access token to every outgoing request
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

// ─── Silent Token Refresh Logic ───────────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const forceLogout = () => {
    localStorage.removeItem("spectra-ai-token");
    localStorage.removeItem("spectra-ai-refresh-token");
    localStorage.removeItem("spectra-ai-user");
    window.location.href = "/login";
};

// ─── Response Interceptor ─────────────────────────────────────────────────────
// On a 401, silently attempt to refresh the access token instead of logging out
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only attempt refresh on 401 errors, and only once per request
        if (error.response?.status === 401 && !originalRequest._retry) {
            const refreshToken = localStorage.getItem("spectra-ai-refresh-token");

            // If there is no refresh token available, force logout immediately
            if (!refreshToken) {
                forceLogout();
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // Queue this request until the refresh completes
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await axios.post(
                    `${api.defaults.baseURL}/auth/refresh`,
                    { refreshToken }
                );

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                // Update stored tokens
                localStorage.setItem("spectra-ai-token", accessToken);
                localStorage.setItem("spectra-ai-refresh-token", newRefreshToken);

                // Update the default header for future requests
                api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

                processQueue(null, accessToken);

                // Retry the original failed request with the new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                forceLogout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
