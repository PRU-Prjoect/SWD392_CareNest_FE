// store/slices/serviceShopSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/config/axios";

// Interfaces
interface serviceTypeShopState {
  loading: boolean;
  updating: boolean;
  searching: boolean;
  deleting: boolean;
  creating: boolean;
  serviceTypes: ServiceTypeData[];
  currentServiceType: ServiceTypeData | null;
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

interface ServiceTypeData {
  id: string;
  name: string;
  description: string;
  img_url: string | null;
  is_public: boolean;
}

// Request interfaces
interface SearchServiceTypeRequest {
  name?: string;
}

interface CreateServiceTypeRequest {
  name: string;
  description: string;
  img?: File | null;
  is_public: boolean;
}

interface UpdateServiceTypeRequest {
  id: string;
  name: string;
  description: string;
  img?: File | null;
  is_public: boolean;
}

// Response interfaces
interface ServiceTypeResponse {
  message: string;
  data: ServiceTypeData;
}

interface ServiceTypeListResponse {
  data: ServiceTypeData[];
}

type ServiceTypeDetailResponse = ServiceTypeData;

interface SimpleResponse {
  message: string;
}

interface ErrorResponse {
  error: number;
  message: string;
}

// Initial state
const initialState: serviceTypeShopState = {
  loading: false,
  updating: false,
  searching: false,
  deleting: false,
  creating: false,
  serviceTypes: [],
  currentServiceType: null,
  error: null,
  searchError: null,
  updateError: null,
  deleteError: null,
  createError: null,
};

// ✅ 1. Search Service Types
export const searchServiceTypes = createAsyncThunk<
  ServiceTypeListResponse,
  SearchServiceTypeRequest | void,
  { rejectValue: ErrorResponse }
>("serviceTypeShop/search", async (params = {}, { rejectWithValue }) => {
  try {
    // ✅ Sử dụng type guard để kiểm tra params
    const queryParams = new URLSearchParams();

    // ✅ Kiểm tra params không phải void và có property name
    if (
      params &&
      typeof params === "object" &&
      "name" in params &&
      params.name
    ) {
      queryParams.append("name", params.name);
    }

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `Service_Type?${queryString}`
      : "Service_Type";

    const response = await api.get(endpoint, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Search Service Types Response:", response.data);

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
    console.error("❌ Search Service Types Error:", err.response?.data);

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
            message: "Không tìm thấy loại dịch vụ nào",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Tìm kiếm loại dịch vụ thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 2. Create Service Type
export const createServiceType = createAsyncThunk<
  ServiceTypeResponse,
  CreateServiceTypeRequest,
  { rejectValue: ErrorResponse }
>("serviceTypeShop/create", async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("is_public", data.is_public.toString());

    if (data.img) {
      formData.append("img", data.img);
    } else {
      formData.append("img", "");
    }

    const response = await api.post("Service_Type", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "*/*",
      },
    });

    console.log("✅ Create Service Type Response:", response.data);

    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return response.data;
  } catch (err: any) {
    console.error("❌ Create Service Type Error:", err.response?.data);

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
              errorData?.message || "Dữ liệu tạo loại dịch vụ không hợp lệ",
          });
        case 403:
          return rejectWithValue({
            error: 403,
            message: "Không có quyền tạo loại dịch vụ",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Tạo loại dịch vụ thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 3. Get Service Type by ID
export const getServiceTypeById = createAsyncThunk<
  ServiceTypeDetailResponse,
  string, // service_type_id
  { rejectValue: ErrorResponse }
>("serviceTypeShop/getById", async (serviceTypeId, { rejectWithValue }) => {
  try {
    const response = await api.get(`Service_Type/${serviceTypeId}`, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Get Service Type By ID Response:", response.data);

    // ✅ API trả về object trực tiếp
    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return response.data;
  } catch (err: any) {
    console.error("❌ Get Service Type By ID Error:", err.response?.data);

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
            message: "Không tìm thấy thông tin loại dịch vụ",
          });
        case 400:
          return rejectWithValue({
            error: 400,
            message: errorData?.message || "ID loại dịch vụ không hợp lệ",
          });
        default:
          return rejectWithValue({
            error: status,
            message:
              errorData?.message || "Lấy thông tin loại dịch vụ thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 4. Update Service Type
export const updateServiceType = createAsyncThunk<
  SimpleResponse,
  UpdateServiceTypeRequest,
  { rejectValue: ErrorResponse }
>("serviceTypeShop/update", async (data, { rejectWithValue }) => {
  try {
    const { id, ...updateData } = data;

    const formData = new FormData();
    formData.append("name", updateData.name);
    formData.append("description", updateData.description);
    formData.append("is_public", updateData.is_public.toString());

    if (updateData.img) {
      formData.append("img", updateData.img);
    } else {
      formData.append("img", "");
    }

    const response = await api.put(`Service_Type/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "*/*",
      },
    });

    console.log("✅ Update Service Type Response:", response.data);

    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return response.data;
  } catch (err: any) {
    console.error("❌ Update Service Type Error:", err.response?.data);

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
            message: "Không tìm thấy loại dịch vụ để cập nhật",
          });
        case 403:
          return rejectWithValue({
            error: 403,
            message: "Không có quyền cập nhật loại dịch vụ này",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Cập nhật loại dịch vụ thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 5. Delete Service Type
export const deleteServiceType = createAsyncThunk<
  SimpleResponse,
  string, // service_type_id
  { rejectValue: ErrorResponse }
>("serviceTypeShop/delete", async (serviceTypeId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`Service_Type/${serviceTypeId}`, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Delete Service Type Response:", response.data);

    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return response.data;
  } catch (err: any) {
    console.error("❌ Delete Service Type Error:", err.response?.data);

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
            message: "Không tìm thấy loại dịch vụ để xóa",
          });
        case 403:
          return rejectWithValue({
            error: 403,
            message: "Không có quyền xóa loại dịch vụ này",
          });
        case 409:
          return rejectWithValue({
            error: 409,
            message: "Không thể xóa loại dịch vụ này do có dữ liệu liên quan",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Xóa loại dịch vụ thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// Service Shop slice
const serviceTypeShopSlice = createSlice({
  name: "serviceShop",
  initialState,
  reducers: {
    clearServiceTypeShopError: (state) => {
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
    clearAllServiceTypeShopErrors: (state) => {
      state.error = null;
      state.searchError = null;
      state.updateError = null;
      state.deleteError = null;
      state.createError = null;
    },
    resetServiceTypeShopState: (state) => {
      Object.assign(state, initialState);
    },
    clearServiceTypesList: (state) => {
      state.serviceTypes = [];
    },
    setCurrentServiceType: (
      state,
      action: PayloadAction<ServiceTypeData | null>
    ) => {
      state.currentServiceType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Search service types cases
      .addCase(searchServiceTypes.pending, (state) => {
        state.searching = true;
        state.searchError = null;
      })
      .addCase(
        searchServiceTypes.fulfilled,
        (state, action: PayloadAction<ServiceTypeListResponse>) => {
          state.searching = false;
          state.serviceTypes = action.payload.data;
          state.searchError = null;
          console.log(
            `✅ Retrieved ${action.payload.data.length} service types`
          );
        }
      )
      .addCase(searchServiceTypes.rejected, (state, action) => {
        state.searching = false;
        if (action.payload) {
          state.searchError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.searchError = {
            code: 1,
            message: action.error.message || "Tìm kiếm loại dịch vụ thất bại",
          };
        }
      })

      // ✅ Create service type cases
      .addCase(createServiceType.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(
        createServiceType.fulfilled,
        (state, action: PayloadAction<ServiceTypeResponse>) => {
          state.creating = false;
          state.currentServiceType = action.payload.data;
          state.createError = null;
          console.log(
            "✅ Create service type successful:",
            action.payload.message
          );
        }
      )
      .addCase(createServiceType.rejected, (state, action) => {
        state.creating = false;
        if (action.payload) {
          state.createError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.createError = {
            code: 1,
            message: action.error.message || "Tạo loại dịch vụ thất bại",
          };
        }
      })

      // ✅ Get service type by ID cases
      .addCase(getServiceTypeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getServiceTypeById.fulfilled,
        (state, action: PayloadAction<ServiceTypeDetailResponse>) => {
          state.loading = false;
          state.currentServiceType = action.payload;
          state.error = null;
          console.log("✅ Retrieved service type:", action.payload.name);
        }
      )
      .addCase(getServiceTypeById.rejected, (state, action) => {
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
              action.error.message || "Lấy thông tin loại dịch vụ thất bại",
          };
        }
      })

      // ✅ Update service type cases
      .addCase(updateServiceType.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(
        updateServiceType.fulfilled,
        (state, action: PayloadAction<SimpleResponse>) => {
          state.updating = false;
          state.updateError = null;
          console.log(
            "✅ Update service type successful:",
            action.payload.message
          );
        }
      )
      .addCase(updateServiceType.rejected, (state, action) => {
        state.updating = false;
        if (action.payload) {
          state.updateError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.updateError = {
            code: 1,
            message: action.error.message || "Cập nhật loại dịch vụ thất bại",
          };
        }
      })

      // ✅ Delete service type cases
      .addCase(deleteServiceType.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(
        deleteServiceType.fulfilled,
        (state, action: PayloadAction<SimpleResponse>) => {
          state.deleting = false;
          state.deleteError = null;

          console.log(
            "✅ Delete service type successful:",
            action.payload.message
          );

          // ✅ Reset currentServiceType nếu nó đã được xóa
          state.currentServiceType = null;
        }
      )
      .addCase(deleteServiceType.rejected, (state, action) => {
        state.deleting = false;
        if (action.payload) {
          state.deleteError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.deleteError = {
            code: 1,
            message: action.error.message || "Xóa loại dịch vụ thất bại",
          };
        }
      });
  },
});

export const {
  clearServiceTypeShopError,
  clearSearchError,
  clearUpdateError,
  clearDeleteError,
  clearCreateError,
  clearAllServiceTypeShopErrors,
  resetServiceTypeShopState,
  clearServiceTypesList,
  setCurrentServiceType,
} = serviceTypeShopSlice.actions;

export default serviceTypeShopSlice.reducer;
///số lượng người đặt cuộc hẹn = purchase
// hôm nay đẫ fetch được những api liên quan đến thông tin của shop
// cũng như là điều chỉnh lại side bar cho đẹp
// ĐANG BỊ TRỄ
