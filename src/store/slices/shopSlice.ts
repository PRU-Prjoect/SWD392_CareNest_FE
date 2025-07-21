// store/slices/shopSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/config/axios";

// Interfaces
interface ShopState {
  loading: boolean;
  updating: boolean;
  searching: boolean;
  deleting: boolean;
  registering: boolean; 
  shops: ShopProfile[];
  currentShop: ShopProfile | null;
  error: {
    code: number;
    message: string;
  } | null;
  searchError: {
    code: number;
    message: string;
  } | null;
  updateError: {
    code: number;
    message: string;
  } | null;
  deleteError: {
    code: number;
    message: string;
  } | null;
  registerError: { // ✅ Thêm registerError
    code: number;
    message: string;
  } | null;
}

interface ShopProfile {
  account_id: string;
  name: string;
  description: string;
  phone: string; // ✅ Thêm trường phone
  status: boolean;
  working_day: string[];
  sub_address: any[];
}

// ✅ Search shops request
interface SearchShopsRequest {
  name?: string;
  limit?: number;
  offset?: number;
}

// ✅ Update shop request
interface UpdateShopRequest {
  account_id: string;
  name: string;
  description: string;
  phone: string; // ✅ Thêm trường phone
  status: boolean;
  working_day: string[];
}

// Response interfaces
interface ShopResponse {
  data: ShopProfile;
}

interface ShopsListResponse {
  data: ShopProfile[];
}

interface UpdateShopResponse {
  message: string;
}

interface DeleteShopResponse {
  message: string;
}

interface ErrorResponse {
  error: number;
  message: string;
}

// Initial state
const initialState: ShopState = {
  loading: false,
  updating: false,
  searching: false,
  deleting: false,
  registering: false, // ✅ Thêm state cho register
  shops: [],
  currentShop: null,
  error: null,
  searchError: null,
  updateError: null,
  deleteError: null,
  registerError: null, // ✅ Thêm error state cho register
};

// ✅ 1. Search shops with query parameters
export const searchShops = createAsyncThunk<
  ShopsListResponse,
  SearchShopsRequest | void,
  { rejectValue: ErrorResponse }
>("shop/search", async (params = {}, { rejectWithValue }) => {
  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();
    
    if (params && typeof params === 'object') {
      if ('name' in params && params.name) queryParams.append("name", params.name);
      if ('limit' in params && params.limit) queryParams.append("limit", params.limit.toString());
      if ('offset' in params && params.offset) queryParams.append("offset", params.offset.toString());
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `Shop?${queryString}` : "Shop";

    const response = await api.get(endpoint, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Search Shops Response:", response.data);

    // ✅ API trả về array trực tiếp
    if (!Array.isArray(response.data)) {
      return rejectWithValue({
        error: 1,
        message: "Định dạng dữ liệu từ server không hợp lệ",
      });
    }

    return {
      data: response.data,
    };
  } catch (err: any) {
    console.error("❌ Search Shops Error:", err.response?.data);
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
            message: errorData?.message || "Tham số tìm kiếm không hợp lệ",
          });
        case 404:
          return rejectWithValue({
            error: 404,
            message: "Không tìm thấy cửa hàng nào",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Tìm kiếm cửa hàng thất bại",
          });
      }
    }
    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 2. Get shop by ID
export const getShopById = createAsyncThunk<
  ShopResponse,
  string, // account_id
  { rejectValue: ErrorResponse }
>("shop/getById", async (accountId, { rejectWithValue }) => {
  try {
    const response = await api.get(`Shop/${accountId}`, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Get Shop By ID Response:", response.data);

    // ✅ API trả về object trực tiếp
    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return {
      data: response.data,
    };
  } catch (err: any) {
    console.error("❌ Get Shop By ID Error:", err.response?.data);
    if (err.response) {
      const status = err.response.status;
      const errorData = err.response.data;
      switch (status) {
        case 401:
          return rejectWithValue({
            error: 401,
            message: "Không có quyền truy cập. Vui lòng đăng nhập lại.",
          });
        case 404:
          return rejectWithValue({
            error: 404,
            message: "Không tìm thấy thông tin cửa hàng",
          });
        case 400:
          return rejectWithValue({
            error: 400,
            message: errorData?.message || "ID cửa hàng không hợp lệ",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Lấy thông tin cửa hàng thất bại",
          });
      }
    }
    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 3. Update shop
export const updateShop = createAsyncThunk<
  UpdateShopResponse,
  UpdateShopRequest,
  { rejectValue: ErrorResponse }
>("shop/update", async (data, { rejectWithValue }) => {
  try {
    const response = await api.put("Shop", data, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });

    console.log("✅ Update Shop Response:", response.data);

    // ✅ API chỉ trả về message string
    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return {
      message: response.data, // response.data is the success message
    };
  } catch (err: any) {
    console.error("❌ Update Shop Error:", err.response?.data);
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
            message: errorData?.message || "Dữ liệu cập nhật không hợp lệ",
          });
        case 404:
          return rejectWithValue({
            error: 404,
            message: "Không tìm thấy cửa hàng để cập nhật",
          });
        case 403:
          return rejectWithValue({
            error: 403,
            message: "Không có quyền cập nhật cửa hàng này",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Cập nhật thông tin cửa hàng thất bại",
          });
      }
    }
    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 4. Delete shop
export const deleteShop = createAsyncThunk<
  DeleteShopResponse,
  string, // account_id
  { rejectValue: ErrorResponse }
>("shop/delete", async (accountId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`Shop/${accountId}`, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Delete Shop Response:", response.data);

    // ✅ API chỉ trả về message string
    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return {
      message: response.data, // response.data is the success message
    };
  } catch (err: any) {
    console.error("❌ Delete Shop Error:", err.response?.data);
    if (err.response) {
      const status = err.response.status;
      const errorData = err.response.data;
      switch (status) {
        case 401:
          return rejectWithValue({
            error: 401,
            message: "Không có quyền truy cập. Vui lòng đăng nhập lại.",
          });
        case 404:
          return rejectWithValue({
            error: 404,
            message: "Không tìm thấy cửa hàng để xóa",
          });
        case 403:
          return rejectWithValue({
            error: 403,
            message: "Không có quyền xóa cửa hàng này",
          });
        case 409:
          return rejectWithValue({
            error: 409,
            message: "Không thể xóa cửa hàng này do có dữ liệu liên quan",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Xóa cửa hàng thất bại",
          });
      }
    }
    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});



// Shop slice
const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    clearShopError: (state) => {
      state.error = null;
    },
    clearSearchError: (state) => {
      state.searchError = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    clearRegisterError: (state) => { // ✅ Thêm clear register error
      state.registerError = null;
    },
    clearAllShopErrors: (state) => {
      state.error = null;
      state.searchError = null;
      state.updateError = null;
      state.deleteError = null;
      state.registerError = null; // ✅ Thêm vào clear all
    },
    resetShopState: (state) => {
      Object.assign(state, initialState);
    },
    clearShopsList: (state) => {
      state.shops = [];
    },
    setCurrentShop: (state, action: PayloadAction<ShopProfile | null>) => {
      state.currentShop = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Search shops cases
      .addCase(searchShops.pending, (state) => {
        state.searching = true;
        state.searchError = null;
      })
      .addCase(
        searchShops.fulfilled,
        (state, action: PayloadAction<ShopsListResponse>) => {
          state.searching = false;
          state.shops = action.payload.data;
          state.searchError = null;
          console.log(`✅ Retrieved ${action.payload.data.length} shops`);
        }
      )
      .addCase(searchShops.rejected, (state, action) => {
        state.searching = false;
        if (action.payload) {
          state.searchError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.searchError = {
            code: 1,
            message: action.error.message || "Tìm kiếm cửa hàng thất bại",
          };
        }
      })
      // ✅ Get shop by ID cases
      .addCase(getShopById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getShopById.fulfilled,
        (state, action: PayloadAction<ShopResponse>) => {
          state.loading = false;
          state.currentShop = action.payload.data;
          state.error = null;
          console.log("✅ Retrieved shop:", action.payload.data.name);
        }
      )
      .addCase(getShopById.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.error = {
            code: 1,
            message: action.error.message || "Lấy thông tin cửa hàng thất bại",
          };
        }
      })
      // ✅ Update shop cases
      .addCase(updateShop.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(
        updateShop.fulfilled,
        (state, action: PayloadAction<UpdateShopResponse>) => {
          state.updating = false;
          state.updateError = null;
          console.log("✅ Update shop successful:", action.payload.message);
          // ✅ Sau khi update thành công, cần fetch lại data mới
          // Component sẽ handle việc này bằng cách gọi getShopById
        }
      )
      .addCase(updateShop.rejected, (state, action) => {
        state.updating = false;
        if (action.payload) {
          state.updateError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.updateError = {
            code: 1,
            message: action.error.message || "Cập nhật thông tin cửa hàng thất bại",
          };
        }
      })
      // ✅ Delete shop cases
      .addCase(deleteShop.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(
        deleteShop.fulfilled,
        (state, action: PayloadAction<DeleteShopResponse>) => {
          state.deleting = false;
          state.deleteError = null;
          console.log("✅ Delete shop successful:", action.payload.message);
          // ✅ Reset currentShop nếu nó đã được xóa
          state.currentShop = null;
        }
      )
      .addCase(deleteShop.rejected, (state, action) => {
        state.deleting = false;
        if (action.payload) {
          state.deleteError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.deleteError = {
            code: 1,
            message: action.error.message || "Xóa cửa hàng thất bại",
          };
        }
      });
  },
});

export const {
  clearShopError,
  clearSearchError,
  clearUpdateError,
  clearDeleteError,
  clearRegisterError, 
  clearAllShopErrors,
  resetShopState,
  clearShopsList,
  setCurrentShop,
} = shopSlice.actions;

export default shopSlice.reducer;
