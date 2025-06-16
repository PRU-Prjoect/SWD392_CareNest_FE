// store/slices/registerCustomerSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/config/axios";

// Interfaces - giữ nguyên
interface RegisterCustomerState {
  loading: boolean;
  success: boolean;
  error: {
    code: number;
    message: string;
  } | null;
  customerData: any | null; // ✅ Thêm để lưu customer data
}

interface RegisterCustomerRequest {
  account_id: string;
  full_name: string;
  gender: string;
  birthday: string; // ISO string format
}

interface RegisterCustomerResponse {
  message: string;
  data: {
    account_id: string;
    full_name: string;
    gender: string;
    birthday: string;
  };
}

interface ErrorResponse {
  error: number;
  message: string;
}

// Initial state
const initialState: RegisterCustomerState = {
  loading: false,
  success: false,
  error: null,
  customerData: null, // ✅ Thêm vào initial state
};

// ✅ Async thunk được sửa lại
export const registerCustomer = createAsyncThunk<
  RegisterCustomerResponse,
  RegisterCustomerRequest,
  { rejectValue: ErrorResponse }
>("registerCustomer/create", async (data, { rejectWithValue, getState }) => {
  try {
    // ✅ Lấy token từ Redux store nếu có
    const state = getState() as any;
    const token = state.auth?.token || localStorage.getItem("token");

    const response = await api.post(
      `Customer/${data.account_id}`, // ✅ Endpoint giống curl
      {
        account_id: data.account_id,
        full_name: data.full_name,
        gender: data.gender,
        birthday: data.birthday,
      },
      {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          // ✅ Thêm Authorization header
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    console.log("✅ Create Customer Response:", response.data);

    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return response.data;
  } catch (err: any) {
    console.error("❌ Create Customer Error status:", err.response?.status);
    console.error("❌ Create Customer Error data:", err.response?.data);

    // ✅ Xử lý lỗi chi tiết hơn
    if (err.response) {
      const status = err.response.status;
      const errorData = err.response.data;

      switch (status) {
        case 401:
          return rejectWithValue({
            error: 401,
            message: "Không có quyền truy cập. Vui lòng đăng nhập lại.",
          });
        case 400:
          return rejectWithValue({
            error: 400,
            message: errorData?.message || "Dữ liệu không hợp lệ",
          });
        case 404:
          return rejectWithValue({
            error: 404,
            message: "Không tìm thấy endpoint",
          });
        case 500:
          return rejectWithValue({
            error: 500,
            message: "Lỗi server nội bộ",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Tạo hồ sơ khách hàng thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ Register customer slice với customerData
const registerCustomerSlice = createSlice({
  name: "registerCustomer",
  initialState,
  reducers: {
    resetRegisterCustomerState: (state) => {
      Object.assign(state, initialState);
    },
    clearRegisterCustomerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        registerCustomer.fulfilled,
        (state, action: PayloadAction<RegisterCustomerResponse>) => {
          state.loading = false;
          state.success = true;
          state.error = null;
          state.customerData = action.payload.data; // ✅ Lưu customer data
          console.log(
            "✅ Customer profile created successfully:",
            action.payload.message
          );
        }
      )
      .addCase(registerCustomer.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.customerData = null; // ✅ Reset khi lỗi
        if (action.payload) {
          state.error = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.error = {
            code: 1,
            message: action.error.message || "Tạo hồ sơ khách hàng thất bại",
          };
        }
      });
  },
});

export const { resetRegisterCustomerState, clearRegisterCustomerError } =
  registerCustomerSlice.actions;
export default registerCustomerSlice.reducer;
