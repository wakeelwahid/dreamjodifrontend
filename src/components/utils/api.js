// src/utils/api.js
import axios from "axios";
// Add response interceptor for auto-refresh (user)
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const res = await axios.post(
            "http://127.0.0.1:8000/api/token/refresh/",
            { refresh: refreshToken }
          );
          const newAccessToken = res.data.access;
          localStorage.setItem("access_token", newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login"; // Change as per your route
        }
      } else {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

const BASE_URL = "https://stproject1.onrender.com/api";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

export const getWalletBalance = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/wallet/balance/`, authHeaders());
    return res.data.wallet_balance;
  } catch {
    return null;
  }
};

export const depositRequest = async (amount) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/wallet/deposit/`,
      { amount },
      authHeaders()
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || { detail: "Deposit failed." };
  }
};

export const withdrawRequest = async (amount) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/wallet/withdraw/`,
      { amount },
      authHeaders()
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || { detail: "Withdraw failed." };
  }
};

export const fetchTransactions = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}/wallet/transactions/`,
      authHeaders()
    );
    return res.data;
  } catch {
    return [];
  }
};

// utils/api.js

export const submitUTR = async (transaction_id, utr_number) => {
  const token = localStorage.getItem("access_token");
  return await axios.post(
    "http://127.0.0.1:8000/api/wallet/submit-utr/",
    { transaction_id, utr_number },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
