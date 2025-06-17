// store/slices/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/config/axios";
import { jwtDecode } from "jwt-decode";

// Interfaces
export interface User {
  id: string; // ✅ Đây sẽ là nameidentifier (account_id thật)
  email: string;
  name?: string; // ✅ Đây là username
  role?: string;
  img_url?: string;
  img_url_id?: string;
  username?: string; // ✅ Đây cũng là username
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

// ✅ Updated DecodedToken interface
interface DecodedToken {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string; // ✅ Account ID thật
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

// ✅ Fixed createUserFromToken function
const createUserFromToken = (token: string): User => {
  try {
    const decoded: DecodedToken = jwtDecode(token);

    console.log("🔍 Decoded token:", decoded); // Debug log

    const user = {
      // ✅ ID thật từ nameidentifier
      id: decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ],
      email:
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ],
      // ✅ Name là username
      name: decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
      ],
      username:
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      role: decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ],
    };

    console.log("✅ Created user from token:", {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    return user;
  } catch (error) {
    console.error("Error decoding token:", error);
    throw new Error("Token không hợp lệ");
  }
};

// ✅ ASYNC THUNKS - Keep existing Login and LoginNoRemember as they are
export const Login = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: ErrorResponse }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    console.log("🚀 Login request payload:", credentials);

    const res = await api.post(
      "account/login",
      {
        username: credentials.username,
        password: credentials.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      }
    );

    console.log("✅ Login Response:", res.data);

    if (!res.data || !res.data.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    const token = res.data.data;
    const user = createUserFromToken(token); // ✅ Sẽ lấy đúng ID từ nameidentifier

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

export const LoginNoRemember = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: ErrorResponse }
>("authNoRemember/login", async (credentials, { rejectWithValue }) => {
  try {
    console.log("🚀 LoginNoRemember request payload:", credentials);

    const res = await api.post(
      "account/login",
      {
        username: credentials.username,
        password: credentials.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      }
    );

    console.log("✅ LoginNoRemember Response:", res.data);

    if (!res.data || !res.data.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    const token = res.data.data;
    const user = createUserFromToken(token); // ✅ Sẽ lấy đúng ID từ nameidentifier

    return { user, token };
  } catch (err: any) {
    console.error("❌ LoginNoRemember Error status:", err.response?.status);
    console.error("❌ LoginNoRemember Error data:", err.response?.data);

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

// ✅ Auth slice - Keep existing slice as is
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
            id: user.id, // ✅ Đây sẽ là account_id thật
            username: user.username,
            role: user.role,
          });
        } catch (error) {
          console.error("Error restoring auth:", error);
          clearAuthData();
        }
      }
    },
    updateAuthUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };

        // ✅ Cập nhật localStorage
        localStorage.setItem("user", JSON.stringify(state.user));

        console.log("✅ Auth user updated:", action.payload);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // Login cases
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

          console.log("✅ Login successful with user:", {
            id: action.payload.user.id, // ✅ Account ID thật
            username: action.payload.user.username,
            role: action.payload.user.role,
            email: action.payload.user.email,
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
      // LoginNoRemember cases
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

          console.log("✅ LoginNoRemember successful with user:", {
            id: action.payload.user.id, // ✅ Account ID thật
            username: action.payload.user.username,
            role: action.payload.user.role,
            email: action.payload.user.email,
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

export const { logout, restoreAuth, updateAuthUser } = userSlice.actions;
export default userSlice.reducer;
