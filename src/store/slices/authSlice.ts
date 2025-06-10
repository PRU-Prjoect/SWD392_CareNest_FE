// src/store/slices/authSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/config/axios";
import { jwtDecode } from "jwt-decode";

// Interfaces
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  username?: string;
}

interface UserState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: {
    code: number;
    message: string;
  } | null;
}

interface DecodedToken {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
  iss: string;
  aud: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface ErrorResponse {
  error: number;
  message: string;
}

// Initial state
const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
  loading: false,
};

// Helper functions
const saveAuthData = (data: AuthResponse) => {
  localStorage.setItem("authToken", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
};

const clearAuthData = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("user");
};

const createUserFromToken = (token: string): User => {
  try {
    const decoded: DecodedToken = jwtDecode(token);

    return {
      id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      email:
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ],
      name: decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
      ],
      username:
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      role: decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ],
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    throw new Error("Token không hợp lệ");
  }
};

// ✅ ASYNC THUNKS với GET request và query parameters
// ✅ ASYNC THUNKS với GET request và query parameters
export const Login = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: ErrorResponse }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    console.log("🚀 Sending login request:", credentials);

    // ✅ Tạo URLSearchParams theo spec backend
    const formData = new URLSearchParams();
    formData.append("username", credentials.username); // snake_case
    formData.append("password", credentials.password);

    console.log("📦 Form data:", formData.toString());
    console.log("🌐 API URL:", api.defaults.baseURL + "account/login");

    // In the Login thunk
    const res = await api.get(`account/login?${formData.toString()}`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log("✅ Login response:", res.data);
    console.log("🌐 Request URL:", res.config.url); // Để xem URL được tạo

    // ✅ Kiểm tra response theo structure mới
    if (!res.data || !res.data.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    const token = res.data.data;
    const user = createUserFromToken(token);

    return { user, token };
  } catch (err: any) {
    console.error("Login error:", err);
    console.error("Error response:", err.response?.data);

    if (err.response && err.response.data) {
      return rejectWithValue({
        error: 1,
        message: err.response.data.message || "Đăng nhập thất bại",
      });
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

export const LoginNoRemember = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: ErrorResponse }
>("authNoRemember/login", async (credentials, { rejectWithValue }) => {
  try {
    // ✅ Tương tự cho LoginNoRemember
    const formData = new URLSearchParams();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const res = await api.get(`account/login?${formData.toString()}`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log("✅ Response status:", res.status);

    if (!res.data || !res.data.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    const token = res.data.data;
    const user = createUserFromToken(token);

    return { user, token };
  } catch (err: any) {
    console.error("❌ Error status:", err.response?.status);
    console.error("❌ Error data:", err.response?.data);

    if (err.response && err.response.data) {
      return rejectWithValue({
        error: 1,
        message: err.response.data.message || "Đăng nhập thất bại",
      });
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// Slice (giữ nguyên)
const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      Object.assign(state, initialState);
      clearAuthData();
    },
    restoreAuth(state) {
      const token = localStorage.getItem("authToken");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          state.isAuthenticated = true;
          state.token = token;
          state.user = user;
        } catch (error) {
          console.error("Error restoring auth:", error);
          clearAuthData();
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        Login.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          saveAuthData(action.payload);
          state.error = null;
        }
      )
      .addCase(Login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        if (action.payload) {
          state.error = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.error = {
            code: 1,
            message: action.error.message || "Đăng nhập thất bại",
          };
        }
      })
      .addCase(LoginNoRemember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        LoginNoRemember.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.error = null;
        }
      )
      .addCase(LoginNoRemember.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        if (action.payload) {
          state.error = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.error = {
            code: 1,
            message: action.error.message || "Đăng nhập thất bại",
          };
        }
      });
  },
});

export const { logout, restoreAuth } = userSlice.actions;
export default userSlice.reducer;
