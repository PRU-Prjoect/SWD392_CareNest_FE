// store/slices/registerCustomerSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/config/axios";

// Interfaces
interface RegisterCustomerState {
  loading: boolean;
  success: boolean;
  error: {
    code: number;
    message: string;
  } | null;
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
};

// Async thunk for creating customer profile
export const registerCustomer = createAsyncThunk<
  RegisterCustomerResponse,
  RegisterCustomerRequest,
  { rejectValue: ErrorResponse }
>("registerCustomer/create", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post(
      `Customer/${data.account_id}`,
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
    console.error("❌ Create Customer Error:", err.response?.data);

    if (err.response && err.response.data) {
      return rejectWithValue({
        error: 1,
        message: err.response.data.message || "Tạo hồ sơ khách hàng thất bại",
      });
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// Register customer slice
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
          console.log(
            "✅ Customer profile created successfully:",
            action.payload.message
          );
        }
      )
      .addCase(registerCustomer.rejected, (state, action) => {
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
            message: action.error.message || "Tạo hồ sơ khách hàng thất bại",
          };
        }
      });
  },
});

export const { resetRegisterCustomerState, clearRegisterCustomerError } =
  registerCustomerSlice.actions;
export default registerCustomerSlice.reducer;
