import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/config/axios";

// Interfaces được cập nhật theo API thực tế
interface RegisterShopState {
  loading: boolean;
  success: boolean;
  error: {
    code: number;
    message: string;
  } | null;
  shopData: any | null; // ✅ Thêm để lưu shop data
}

interface RegisterShopRequest {
  account_id: string;
  name: string; // ✅ Đổi từ shop_name
  description: string; // ✅ Đổi từ shop_description
  status: boolean; // ✅ Thêm mới
  working_day: string[]; // ✅ Thêm mới
  phone: string; 
}

interface RegisterShopResponse {
  message: string;
  data: {
    account_id: string;
    name: string;
    description: string;
    status: boolean;
    working_day: string[];
  };
}

interface ErrorResponse {
  error: number;
  message: string;
}

// Initial state
const initialState: RegisterShopState = {
  loading: false,
  success: false,
  error: null,
  shopData: null, // ✅ Thêm vào initial state
};

// ✅ Async thunk được sửa lại hoàn toàn
export const registerShop = createAsyncThunk<
  RegisterShopResponse,
  RegisterShopRequest,
  { rejectValue: ErrorResponse }
>("registerShop/create", async (data, { rejectWithValue }) => {
  try {
    // ✅ Sử dụng endpoint đúng và structure đúng
    const response = await api.post(
      "Shop/register", // ✅ Endpoint đúng
      {
        account_id: data.account_id,
        name: data.name, // ✅ Tên field đúng
        phone: data.phone,
        description: data.description, // ✅ Tên field đúng
        status: data.status, // ✅ Thêm status
        working_day: data.working_day, // ✅ Thêm working_day
      },
      {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          // ✅ Authorization sẽ được thêm tự động bởi axios interceptor
          // hoặc bạn có thể lấy token từ store nếu cần
        },
      }
    );

    console.log("✅ Create Shop Response:", response.data);

    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return response.data;
  } catch (err: any) {
    console.error("❌ Create Shop Error status:", err.response?.status);
    console.error("❌ Create Shop Error data:", err.response?.data);

    if (err.response && err.response.data) {
      return rejectWithValue({
        error: 1,
        message: err.response.data.message || "Tạo hồ sơ cửa hàng thất bại",
      });
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// Register shop slice
const registerShopSlice = createSlice({
  name: "registerShop",
  initialState,
  reducers: {
    resetRegisterShopState: (state) => {
      Object.assign(state, initialState);
    },
    clearRegisterShopError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerShop.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        registerShop.fulfilled,
        (state, action: PayloadAction<RegisterShopResponse>) => {
          state.loading = false;
          state.success = true;
          state.error = null;
          state.shopData = action.payload.data; // ✅ Lưu shop data

          console.log(
            "✅ Shop profile created successfully:",
            action.payload.message
          );
        }
      )
      .addCase(registerShop.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.shopData = null; // ✅ Reset khi lỗi
        if (action.payload) {
          state.error = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.error = {
            code: 1,
            message: action.error.message || "Tạo hồ sơ cửa hàng thất bại",
          };
        }
      });
  },
});

export const { resetRegisterShopState, clearRegisterShopError } =
  registerShopSlice.actions;
export default registerShopSlice.reducer;
