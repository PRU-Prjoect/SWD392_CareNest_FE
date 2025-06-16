// store/slices/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
  user: any | null;
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
export const Login = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: ErrorResponse }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    console.log("🚀 Login request payload:", credentials); // Debug log

    const res = await api.post(
      "account/login",
      // Request body directly
      {
        username: credentials.username,
        password: credentials.password,
      },
      // Request config as third parameter
      {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      }
    );

    console.log("✅ Response:", res.data); // Debug log

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

// ✅ Define LoginNoRemember async thunk (same as Login but without saving to localStorage)
export const LoginNoRemember = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: ErrorResponse }
>("authNoRemember/login", async (credentials, { rejectWithValue }) => {
  try {
    console.log("🚀 Login request payload:", credentials); // Debug log

    const res = await api.post(
      "account/login",
      // Request body directly
      {
        username: credentials.username,
        password: credentials.password,
      },
      // Request config as third parameter
      {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      }
    );

    console.log("✅ Response:", res.data); // Debug log

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
          console.log("✅ Auth restored:", {
            username: user.username,
            role: user.role,
          });
        } catch (error) {
          console.error("Error restoring auth:", error);
          clearAuthData();
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Login cases
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
          saveAuthData(action.payload); // ✅ Lưu vào localStorage
          state.error = null;

          console.log("✅ Login successful with user:", {
            username: action.payload.user.username,
            role: action.payload.user.role,
            id: action.payload.user.id,
          });
        }
      )
      .addCase(Login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
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
      // ✅ LoginNoRemember cases
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
          // ✅ LoginNoRemember không lưu vào localStorage

          console.log("✅ LoginNoRemember successful with user:", {
            username: action.payload.user.username,
            role: action.payload.user.role,
            id: action.payload.user.id,
          });
        }
      )
      .addCase(LoginNoRemember.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
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
