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

// ✅ Hàm tạo thông báo lỗi người dùng từ lỗi kỹ thuật
export const getUserFriendlyErrorMessage = (error: unknown): string => {
  // Nếu không có error object
  if (!error) {
    return "Đã xảy ra lỗi, vui lòng thử lại";
  }

  // Chuyển đổi error sang dạng có thể truy cập thuộc tính
  const err = error as {
    message?: string;
    code?: string;
    response?: {
      status?: number;
      data?: {
        message?: string;
      }
    }
  };

  // Xử lý trường hợp message từ backend có pattern cụ thể
  const errorMessage = err.message || (err.response?.data?.message) || "";
  
  // Xử lý các trường hợp lỗi cụ thể
  if (errorMessage.includes("entity changes") || errorMessage.includes("saving")) {
    return "Không thể tạo mục mới do trùng lặp dữ liệu. Vui lòng kiểm tra lại thông tin.";
  }
  
  if (errorMessage.includes("password") && errorMessage.includes("incorrect")) {
    return "Mật khẩu không chính xác";
  }

  if (errorMessage.includes("Email") && errorMessage.includes("already in use")) {
    return "Email này đã được sử dụng";
  }
  
  if (errorMessage.includes("validation")) {
    return "Thông tin không hợp lệ. Vui lòng kiểm tra lại dữ liệu nhập vào.";
  }

  if (errorMessage.includes("Permission denied") || errorMessage.includes("not authorized")) {
    return "Bạn không có quyền thực hiện hành động này";
  }

  if (errorMessage.includes("not found") || errorMessage.includes("404")) {
    return "Không tìm thấy dữ liệu yêu cầu";
  }

  if (errorMessage.includes("timeout") || errorMessage.includes("timed out")) {
    return "Kết nối mạng quá chậm, vui lòng thử lại sau";
  }
  
  // Xử lý status code từ response
  if (err.response) {
    switch (err.response.status) {
      case 400:
        return "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại dữ liệu.";
      case 401:
        return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
      case 403:
        return "Bạn không có quyền thực hiện hành động này.";
      case 404:
        return "Không tìm thấy dữ liệu yêu cầu.";
      case 409:
        return "Dữ liệu đã tồn tại hoặc xung đột.";
      case 422:
        return "Dữ liệu không hợp lệ.";
      case 429:
        return "Quá nhiều yêu cầu. Vui lòng thử lại sau.";
      case 500:
      case 502:
      case 503:
      case 504:
        return "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.";
    }
  }

  // Xử lý các lỗi mạng
  if (err.code === "ECONNABORTED") {
    return "Kết nối quá chậm. Vui lòng thử lại sau.";
  }
  if (err.code === "ERR_NETWORK") {
    return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
  }

  // Trả về message mặc định nếu không nhận diện được lỗi
  return "Đã xảy ra lỗi, vui lòng thử lại";
};

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
      toast.error("Không tìm thấy dữ liệu yêu cầu!");
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
      toast.error("Hệ thống đang gặp sự cố. Vui lòng thử lại sau!");
      break;

    default:
      // ✅ Handle network errors
      if (!error.response) {
        if (error.code === "ECONNABORTED") {
          toast.error("Kết nối quá chậm. Vui lòng thử lại sau.");
        } else if (error.code === "ERR_NETWORK") {
          toast.error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng!");
        } else {
          toast.error("Không thể kết nối đến máy chủ!");
        }
      } else {
        // Sử dụng hàm getUserFriendlyErrorMessage để hiển thị lỗi thân thiện hơn
        toast.error(getUserFriendlyErrorMessage(error));
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
