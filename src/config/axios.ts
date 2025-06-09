// src/config/axios.ts
import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { toast } from "react-toastify";

let stateToken: string | null = null;
let logoutCallback: (() => void) | null = null;

// ✅ Export function này
export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

// ✅ Export function này
export const updateStateToken = (token: string | null) => {
  stateToken = token;
};

const api = axios.create({
  baseURL: "https://carenest-api.lighttail.com/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const handleBefore = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("authToken") || stateToken;

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
};

const handleRequestError = (error: AxiosError) => {
  console.error("Request error:", error);
  return Promise.reject(error);
};

const logoutUser = () => {
  localStorage.removeItem("authToken");
  updateStateToken(null);

  if (logoutCallback) {
    logoutCallback();
  }
};

const handleResponseError = (error: AxiosError) => {
  if (error.response?.status === 401) {
    logoutUser();
    toast.error(
      "Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại."
    );
    window.location.href = "/login";
  }

  console.error("Response error:", error);
  return Promise.reject(error);
};

api.interceptors.request.use(handleBefore, handleRequestError);
api.interceptors.response.use((response) => response, handleResponseError);

export { logoutUser };
export default api;
