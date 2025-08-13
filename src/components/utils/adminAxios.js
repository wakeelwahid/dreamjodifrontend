// utils/adminAxios.js
import axios from "axios";

// Vite env variable se baseURL lo
const ADMIN_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/";

const adminAxios = axios.create({
  baseURL: ADMIN_API_BASE_URL,
});

adminAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for auto-refresh
adminAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If 401 error and not already retried
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("adminRefreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post(`${ADMIN_API_BASE_URL}token/refresh/`, {
            refresh: refreshToken,
          });
          const newAccessToken = res.data.access;
          localStorage.setItem("adminToken", newAccessToken);
          // Update header and retry original request
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return adminAxios(originalRequest);
        } catch (refreshError) {
          // Refresh token expired or invalid, force logout
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminRefreshToken");
          window.location.href = "/aarizmaan"; // Change as per your route
        }
      } else {
        // No refresh token, force logout
        localStorage.removeItem("adminToken");
        window.location.href = "/aarizmaan"; // Change as per your route
      }
    }
    return Promise.reject(error);
  }
);

export default adminAxios;
