// store/slices/subAddressSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/config/axios";

// Interfaces
interface SubAddressState {
  loading: boolean;
  updating: boolean;
  searching: boolean;
  deleting: boolean;
  creating: boolean;
  subAddresses: SubAddressData[];
  currentSubAddress: SubAddressData | null;
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
  createError: {
    code: number;
    message: string;
  } | null;
}

interface SubAddressData {
  id: string;
  name: string;
  shop_id: string;
  phone: string | number;
  address_name: string;
  is_default: boolean;
}

// Request interfaces
interface SearchSubAddressRequest {
  shopId?: string;
  addressName?: string;
}

interface CreateSubAddressRequest {
  id: string;
  name: string;
  shop_id: string;
  phone: string;
  address_name: string;
  is_default: boolean;
}

interface UpdateSubAddressRequest {
  id: string;
  name: string;
  shop_id: string;
  phone: string;
  address_name: string;
  is_default: boolean;
}

// Response interfaces
interface SubAddressResponse {
  data: SubAddressData;
}

interface SubAddressListResponse {
  data: SubAddressData[];
}

interface SimpleResponse {
  message: string;
}

interface ErrorResponse {
  error: number;
  message: string;
}

// Initial state
const initialState: SubAddressState = {
  loading: false,
  updating: false,
  searching: false,
  deleting: false,
  creating: false,
  subAddresses: [],
  currentSubAddress: null,
  error: null,
  searchError: null,
  updateError: null,
  deleteError: null,
  createError: null,
};

// ✅ 1. Search Sub Addresses with query parameters
export const searchSubAddresses = createAsyncThunk<
  SubAddressListResponse,
  SearchSubAddressRequest | void,
  { rejectValue: ErrorResponse }
>("subAddress/search", async (params = {}, { rejectWithValue }) => {
  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();

    if (params.shopId) queryParams.append("shopId", params.shopId);
    if (params.addressName)
      queryParams.append("addressName", params.addressName);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `Sub_Address?${queryString}` : "Sub_Address";

    const response = await api.get(endpoint, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Search Sub Addresses Response:", response.data);

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
    console.error("❌ Search Sub Addresses Error:", err.response?.data);

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
            message: "Không tìm thấy địa chỉ phụ nào",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Tìm kiếm địa chỉ phụ thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 2. Create Sub Address
export const createSubAddress = createAsyncThunk<
  SimpleResponse,
  CreateSubAddressRequest,
  { rejectValue: ErrorResponse }
>("subAddress/create", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post("Sub_Address", data, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });

    console.log("✅ Create Sub Address Response:", response.data);

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
    console.error("❌ Create Sub Address Error:", err.response?.data);

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
            message:
              errorData?.message || "Dữ liệu tạo địa chỉ phụ không hợp lệ",
          });
        case 403:
          return rejectWithValue({
            error: 403,
            message: "Không có quyền tạo địa chỉ phụ",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Tạo địa chỉ phụ thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 3. Update Sub Address
export const updateSubAddress = createAsyncThunk<
  SimpleResponse,
  UpdateSubAddressRequest,
  { rejectValue: ErrorResponse }
>("subAddress/update", async (data, { rejectWithValue }) => {
  try {
    const response = await api.put("Sub_Address", data, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });

    console.log("✅ Update Sub Address Response:", response.data);

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
    console.error("❌ Update Sub Address Error:", err.response?.data);

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
            message: "Không tìm thấy địa chỉ phụ để cập nhật",
          });
        case 403:
          return rejectWithValue({
            error: 403,
            message: "Không có quyền cập nhật địa chỉ phụ này",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Cập nhật địa chỉ phụ thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 4. Get Sub Address by ID
export const getSubAddressById = createAsyncThunk<
  SubAddressResponse,
  string, // sub_address_id
  { rejectValue: ErrorResponse }
>("subAddress/getById", async (subAddressId, { rejectWithValue }) => {
  try {
    const response = await api.get(`Sub_Address/${subAddressId}`, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Get Sub Address By ID Response:", response.data);

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
    console.error("❌ Get Sub Address By ID Error:", err.response?.data);

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
            message: "Không tìm thấy thông tin địa chỉ phụ",
          });
        case 400:
          return rejectWithValue({
            error: 400,
            message: errorData?.message || "ID địa chỉ phụ không hợp lệ",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Lấy thông tin địa chỉ phụ thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 5. Delete Sub Address
export const deleteSubAddress = createAsyncThunk<
  SimpleResponse,
  string, // sub_address_id
  { rejectValue: ErrorResponse }
>("subAddress/delete", async (subAddressId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`Sub_Address/${subAddressId}`, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Delete Sub Address Response:", response.data);

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
    console.error("❌ Delete Sub Address Error:", err.response?.data);

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
            message: "Không tìm thấy địa chỉ phụ để xóa",
          });
        case 403:
          return rejectWithValue({
            error: 403,
            message: "Không có quyền xóa địa chỉ phụ này",
          });
        case 409:
          return rejectWithValue({
            error: 409,
            message: "Không thể xóa địa chỉ phụ này do có dữ liệu liên quan",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Xóa địa chỉ phụ thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// Sub Address slice
const subAddressSlice = createSlice({
  name: "subAddress",
  initialState,
  reducers: {
    clearSubAddressError: (state) => {
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
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearAllSubAddressErrors: (state) => {
      state.error = null;
      state.searchError = null;
      state.updateError = null;
      state.deleteError = null;
      state.createError = null;
    },
    resetSubAddressState: (state) => {
      Object.assign(state, initialState);
    },
    clearSubAddressList: (state) => {
      state.subAddresses = [];
    },
    setCurrentSubAddress: (
      state,
      action: PayloadAction<SubAddressData | null>
    ) => {
      state.currentSubAddress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Search sub addresses cases
      .addCase(searchSubAddresses.pending, (state) => {
        state.searching = true;
        state.searchError = null;
      })
      .addCase(
        searchSubAddresses.fulfilled,
        (state, action: PayloadAction<SubAddressListResponse>) => {
          state.searching = false;
          state.subAddresses = action.payload.data;
          state.searchError = null;
          console.log(
            `✅ Retrieved ${action.payload.data.length} sub addresses`
          );
        }
      )
      .addCase(searchSubAddresses.rejected, (state, action) => {
        state.searching = false;
        if (action.payload) {
          state.searchError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.searchError = {
            code: 1,
            message: action.error.message || "Tìm kiếm địa chỉ phụ thất bại",
          };
        }
      })

      // ✅ Create sub address cases
      .addCase(createSubAddress.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(
        createSubAddress.fulfilled,
        (state, action: PayloadAction<SimpleResponse>) => {
          state.creating = false;
          state.createError = null;
          console.log(
            "✅ Create sub address successful:",
            action.payload.message
          );
        }
      )
      .addCase(createSubAddress.rejected, (state, action) => {
        state.creating = false;
        if (action.payload) {
          state.createError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.createError = {
            code: 1,
            message: action.error.message || "Tạo địa chỉ phụ thất bại",
          };
        }
      })

      // ✅ Update sub address cases
      .addCase(updateSubAddress.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(
        updateSubAddress.fulfilled,
        (state, action: PayloadAction<SimpleResponse>) => {
          state.updating = false;
          state.updateError = null;
          console.log(
            "✅ Update sub address successful:",
            action.payload.message
          );
        }
      )
      .addCase(updateSubAddress.rejected, (state, action) => {
        state.updating = false;
        if (action.payload) {
          state.updateError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.updateError = {
            code: 1,
            message: action.error.message || "Cập nhật địa chỉ phụ thất bại",
          };
        }
      })

      // ✅ Get sub address by ID cases
      .addCase(getSubAddressById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getSubAddressById.fulfilled,
        (state, action: PayloadAction<SubAddressResponse>) => {
          state.loading = false;
          state.currentSubAddress = action.payload.data;
          state.error = null;
          console.log("✅ Retrieved sub address:", action.payload.data.name);
        }
      )
      .addCase(getSubAddressById.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.error = {
            code: 1,
            message:
              action.error.message || "Lấy thông tin địa chỉ phụ thất bại",
          };
        }
      })

      // ✅ Delete sub address cases
      .addCase(deleteSubAddress.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(
        deleteSubAddress.fulfilled,
        (state, action: PayloadAction<SimpleResponse>) => {
          state.deleting = false;
          state.deleteError = null;

          console.log(
            "✅ Delete sub address successful:",
            action.payload.message
          );

          // ✅ Reset currentSubAddress nếu nó đã được xóa
          state.currentSubAddress = null;
        }
      )
      .addCase(deleteSubAddress.rejected, (state, action) => {
        state.deleting = false;
        if (action.payload) {
          state.deleteError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.deleteError = {
            code: 1,
            message: action.error.message || "Xóa địa chỉ phụ thất bại",
          };
        }
      });
  },
});

export const {
  clearSubAddressError,
  clearSearchError,
  clearUpdateError,
  clearDeleteError,
  clearCreateError,
  clearAllSubAddressErrors,
  resetSubAddressState,
  clearSubAddressList,
  setCurrentSubAddress,
} = subAddressSlice.actions;

export default subAddressSlice.reducer;
