// src/store/slices/registerSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/config/axios";
import { jwtDecode } from "jwt-decode";

// Interfaces (sử dụng chung với authSlice)
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  username?: string;
}

interface RegisterState {
  loading: boolean;
  success: boolean;
  error: {
    code: number;
    message: string;
  } | null;
  // Thêm user và token nếu API trả về (cho trường hợp auto login)
  user: User | null;
  token: string | null;
}

interface DecodedToken {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
  iss: string;
  aud: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface RegisterResponse {
  message: string;
  data: {
    username: string;
    password: string;
    email: string;
    img_url: string | null;
    img_url_id: string | null;
  };
}

interface ErrorResponse {
  error: number;
  message: string;
}

// Initial state
const initialState: RegisterState = {
  loading: false,
  success: false,
  error: null,
  user: null,
  token: null,
};

// Helper functions (giống authSlice)
const saveAuthData = (token: string, user: User) => {
  localStorage.setItem("authToken", token);
  localStorage.setItem("user", JSON.stringify(user));
};

// Async thunk for registration
// Cập nhật async thunk
export const register = createAsyncThunk<
  RegisterResponse,
  RegisterRequest,
  { rejectValue: ErrorResponse }
>("register/submit", async (data, { rejectWithValue }) => {
  try {
    // Create FormData object
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("img", "undefined"); // Added as per swagger spec
    if (data.role) {
      formData.append("role", data.role);
    }

    const response = await api.post("account/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "*/*",
      },
    });

    console.log("✅ Register Response:", response.data);

    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return response.data; // Trả về { message, data }
  } catch (err: any) {
    console.error("❌ Register Error status:", err.response?.status);
    console.error("❌ Register Error data:", err.response?.data);

    if (err.response && err.response.data) {
      return rejectWithValue({
        error: 1,
        message: err.response.data.message || "Đăng ký thất bại",
      });
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// Register slice
const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    resetRegisterState: (state) => {
      Object.assign(state, initialState);
    },
    clearRegisterError: (state) => {
      state.error = null;
    },
  },
  // Cập nhật extraReducers
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<RegisterResponse>) => {
          state.loading = false;
          state.success = true;
          state.error = null;

          console.log("✅ Registration successful:", action.payload.message);
          // Không auto login, chỉ hiển thị thông báo thành công
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        if (action.payload) {
          state.error = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.error = {
            code: 1,
            message: action.error.message || "Đăng ký thất bại",
          };
        }
      });
  },
});

export const { resetRegisterState, clearRegisterError } = registerSlice.actions;
export default registerSlice.reducer;
