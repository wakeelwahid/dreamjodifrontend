// utils/adminAxios.js
import axios from "axios";

const adminAxios = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
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
          const res = await axios.post(
            "http://127.0.0.1:8000/api/token/refresh/",
            {
              refresh: refreshToken,
            }
          );
          const newAccessToken = res.data.access;
          localStorage.setItem("adminToken", newAccessToken);
          // Update header and retry original request
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return adminAxios(originalRequest);
        } catch (refreshError) {
          // Refresh token expired or invalid, force logout
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminRefreshToken");
          window.location.href = "/admin-login"; // Change as per your route
        }
      } else {
        // No refresh token, force logout
        localStorage.removeItem("adminToken");
        window.location.href = "/admin-login";
      }
    }
    return Promise.reject(error);
  }
);

export default adminAxios;
