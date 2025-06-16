// store/slices/registerSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/config/axios";

// Interfaces
interface RegisterState {
  loading: boolean;
  success: boolean;
  error: {
    code: number;
    message: string;
  } | null;
  accountData: any | null;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

// ✅ Cập nhật interface để match với response thực tế
interface RegisterResponse {
  message: string;
  data: {
    id: string; // ✅ Thêm field id
    username: string;
    password: string; // ✅ Password đã được hash
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
  accountData: null,
};

// Async thunk for registration
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
    formData.append("img", "undefined");
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
          state.accountData = action.payload.data; // ✅ Lưu account data
          console.log("✅ Registration successful:", action.payload.message);
          console.log("✅ Account ID:", action.payload.data.id);
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.accountData = null;
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
