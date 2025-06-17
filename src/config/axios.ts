// src/config/axios.ts
import axios, { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { toast } from "react-toastify";

// ✅ Global state management
let currentToken: string | null = null;
let logoutCallback: (() => void) | null = null;
let isLoggingOut = false; // ✅ Prevent multiple logout calls

// ✅ Export functions để control từ bên ngoài
export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};
export const updateStateToken = (token: string | null) => {
  currentToken = token;
  console.log("🔧 Token updated:", token ? "✅ Token set" : "❌ Token cleared");
};

// ✅ Get current token helper
export const getCurrentToken = (): string | null => {
  return currentToken || localStorage.getItem("authToken");
};

// ✅ Create axios instance
const api = axios.create({
  baseURL: "https://carenest-api.lighttail.com/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*", // ✅ Match với API requirements
  },
});

// ✅ Request interceptor - Tự động thêm token
const handleRequest = (config: InternalAxiosRequestConfig) => {
  const token = getCurrentToken();

  // ✅ Chỉ thêm token nếu có
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  // ✅ Debug logging
  console.log("🚀 API Request:", {
    method: config.method?.toUpperCase(),
    url: config.url,
    hasToken: !!token,
    headers: config.headers["Authorization"] ? "Bearer ***" : "None",
  });

  return config;
};

// ✅ Request error handler
const handleRequestError = (error: AxiosError) => {
  console.error("❌ Request Error:", {
    message: error.message,
    code: error.code,
    config: {
      method: error.config?.method,
      url: error.config?.url,
    },
  });

  // ✅ Show user-friendly error
  toast.error("Lỗi kết nối. Vui lòng thử lại!");
  return Promise.reject(error);
};

// ✅ Response success handler
const handleResponse = (response: AxiosResponse) => {
  console.log("✅ API Response:", {
    status: response.status,
    statusText: response.statusText,
    url: response.config.url,
    method: response.config.method?.toUpperCase(),
  });

  return response;
};

// ✅ Logout user helper
const logoutUser = () => {
  if (isLoggingOut) {
    console.warn("⚠️ Logout already in progress, skipping...");
    return;
  }

  isLoggingOut = true;
  console.log("🚪 Logging out user due to authentication error");

  // ✅ Clear all auth data
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("user");

  // ✅ Update global state
  updateStateToken(null);

  // ✅ Call logout callback if exists
  if (logoutCallback) {
    try {
      logoutCallback();
    } catch (error) {
      console.error("❌ Error in logout callback:", error);
    }
  }

  // ✅ Show notification
  toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");

  // ✅ Redirect to login after a short delay
  setTimeout(() => {
    window.location.href = "/login";
    isLoggingOut = false;
  }, 1000);
};

// ✅ Response error handler
const handleResponseError = (error: AxiosError) => {
  const status = error.response?.status;
  const url = error.config?.url;
  const method = error.config?.method?.toUpperCase();

  console.error("❌ API Response Error:", {
    status,
    statusText: error.response?.statusText,
    method,
    url,
    message: error.message,
    data: error.response?.data,
  });

  // ✅ Handle different error statuses
  switch (status) {
    case 401:
      console.warn("🔐 Unauthorized access - logging out user");
      logoutUser();
      break;

    case 403:
      toast.error("Bạn không có quyền thực hiện hành động này!");
      break;

    case 404:
      toast.error("Không tìm thấy tài nguyên yêu cầu!");
      break;

    case 409:
      toast.error("Dữ liệu đã tồn tại hoặc xung đột!");
      break;

    case 422:
      toast.error("Dữ liệu không hợp lệ!");
      break;

    case 429:
      toast.error("Quá nhiều yêu cầu. Vui lòng thử lại sau!");
      break;

    case 500:
    case 502:
    case 503:
    case 504:
      toast.error("Lỗi máy chủ. Vui lòng thử lại sau!");
      break;

    default:
      // ✅ Handle network errors
      if (!error.response) {
        if (error.code === "ECONNABORTED") {
          toast.error("Timeout! Kết nối quá chậm.");
        } else if (error.code === "ERR_NETWORK") {
          toast.error("Lỗi mạng. Kiểm tra kết nối internet!");
        } else {
          toast.error("Không thể kết nối đến máy chủ!");
        }
      } else {
        toast.error(
          `Lỗi ${status}: ${error.response?.statusText || "Unknown error"}`
        );
      }
      break;
  }

  console.error("Response error:", error);
  return Promise.reject(error);
};

// ✅ Setup interceptors
api.interceptors.request.use(handleRequest, handleRequestError);
api.interceptors.response.use(handleResponse, handleResponseError);

// ✅ Export utilities
export { logoutUser };
export default api;
