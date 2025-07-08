import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/config/axios";

interface ServiceState {
  loading: boolean;
  updating: boolean;
  searching: boolean;
  deleting: boolean;
  creating: boolean;
  services: ServiceData[];
  currentService: ServiceData | null;
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

export interface ServiceData {
  id: string;
  name: string;
  is_active: boolean;
  shop_id: string;
  description: string;
  discount_percent: number;
  price: number;
  limit_per_hour: number;
  duration_type: number;
  star: number;
  purchases: number;
  service_type_id: string;
}

// Request interfaces
interface SearchServiceRequest {
  name?: string;
  serviceTypeId?: string;
  sortBy?: string;
  limit?: number;
  offset?: number;
  shopId?: string; // ✅ Thêm trường shopId
}

interface CreateServiceRequest {
  id: string;
  name: string;
  is_active: boolean;
  shop_id: string;
  description: string;
  discount_percent: number;
  price: number;
  limit_per_hour: number;
  duration_type: number;
  star: number;
  purchases: number;
  service_type_id: string;
}

interface UpdateServiceRequest {
  id: string;
  name: string;
  is_active: boolean;
  shop_id: string;
  description: string;
  discount_percent: number;
  price: number;
  limit_per_hour: number;
  duration_type: number;
  star: number;
  purchases: number;
  service_type_id: string;
}

// Response interfaces
interface ServiceResponse {
  data: ServiceData;
}

interface ServicesListResponse {
  data: ServiceData[];
}

interface SimpleResponse {
  message: string;
}

interface ErrorResponse {
  error: number;
  message: string;
}

// Initial state
const initialState: ServiceState = {
  loading: false,
  updating: false,
  searching: false,
  deleting: false,
  creating: false,
  services: [],
  currentService: null,
  error: null,
  searchError: null,
  updateError: null,
  deleteError: null,
  createError: null,
};

// ✅ 1. Get all services (with optional search parameters)
export const getAllServices = createAsyncThunk<
  ServicesListResponse,
  SearchServiceRequest | void , 
  { rejectValue: ErrorResponse }
>("service/getAll", async (params = {}, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.shopId) queryParams.append("shopId", params.shopId);
    if (params?.name) queryParams.append("name", params.name);
    if (params?.serviceTypeId)
      queryParams.append("serviceTypeId", params.serviceTypeId);
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());
    if (params?.shopId) queryParams.append("shopId", params.shopId); // ✅ Thêm shopId vào query params

    const queryString = queryParams.toString();
    const endpoint = queryString ? `Service?${queryString}` : "Service";

    const response = await api.get(endpoint, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Get All Services Response:", response.data);

    // API trả về array trực tiếp
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
    console.error("❌ Get All Services Error:", err.response?.data);
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
            message: "Không tìm thấy dịch vụ nào",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Lấy danh sách dịch vụ thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 2. Get service by ID
export const getServiceById = createAsyncThunk<
  ServiceResponse,
  string, // service_id
  { rejectValue: ErrorResponse }
>("service/getById", async (serviceId, { rejectWithValue }) => {
  try {
    const response = await api.get(`Service/${serviceId}`, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Get Service By ID Response:", response.data);

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
    console.error("❌ Get Service By ID Error:", err.response?.data);
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
            message: "Không tìm thấy thông tin dịch vụ",
          });
        case 400:
          return rejectWithValue({
            error: 400,
            message: errorData?.message || "ID dịch vụ không hợp lệ",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Lấy thông tin dịch vụ thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 3. Create service
export const createService = createAsyncThunk<
  SimpleResponse,
  CreateServiceRequest,
  { rejectValue: ErrorResponse }
>("service/create", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post("Service", data, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });

    console.log("✅ Create Service Response:", response.data);

    return {
      message: response.data || "Service created successfully",
    };
  } catch (err: any) {
    console.error("❌ Create Service Error:", err.response?.data);
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
            message: errorData?.message || "Dữ liệu tạo dịch vụ không hợp lệ",
          });
        case 409:
          return rejectWithValue({
            error: 409,
            message: "Dịch vụ đã tồn tại",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Tạo dịch vụ thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 4. Update service
export const updateService = createAsyncThunk<
  SimpleResponse,
  UpdateServiceRequest,
  { rejectValue: ErrorResponse }
>("service/update", async (data, { rejectWithValue }) => {
  try {
    const response = await api.put("Service", data, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });

    console.log("✅ Update Service Response:", response.data);

    return {
      message: response.data || "Service updated successfully",
    };
  } catch (err: any) {
    console.error("❌ Update Service Error:", err.response?.data);
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
            message: "Không tìm thấy dịch vụ để cập nhật",
          });
        case 409:
          return rejectWithValue({
            error: 409,
            message: "Thông tin dịch vụ đã tồn tại",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Cập nhật dịch vụ thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 5. Delete service
export const deleteService = createAsyncThunk<
  SimpleResponse,
  string, // service_id
  { rejectValue: ErrorResponse }
>("service/delete", async (serviceId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`Service/${serviceId}`, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Delete Service Response:", response.data);

    return {
      message: response.data || "Service deleted successfully",
    };
  } catch (err: any) {
    console.error("❌ Delete Service Error:", err.response?.data);
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
            message: "Không tìm thấy dịch vụ để xóa",
          });
        case 400:
          return rejectWithValue({
            error: 400,
            message: errorData?.message || "ID dịch vụ không hợp lệ",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Xóa dịch vụ thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// Service slice
const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    clearServiceError: (state) => {
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
    clearAllServiceErrors: (state) => {
      state.error = null;
      state.searchError = null;
      state.updateError = null;
      state.deleteError = null;
      state.createError = null;
    },
    resetServiceState: (state) => {
      Object.assign(state, initialState);
    },
    clearServicesList: (state) => {
      state.services = [];
    },
    setCurrentService: (state, action: PayloadAction<ServiceData>) => {
      state.currentService = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Get all services cases
      .addCase(getAllServices.pending, (state) => {
        state.searching = true;
        state.searchError = null;
      })
      .addCase(
        getAllServices.fulfilled,
        (state, action: PayloadAction<ServicesListResponse>) => {
          state.searching = false;
          state.services = action.payload.data;
          state.searchError = null;
          console.log(`✅ Retrieved ${action.payload.data.length} services`);
        }
      )
      .addCase(getAllServices.rejected, (state, action) => {
        state.searching = false;
        if (action.payload) {
          state.searchError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.searchError = {
            code: 1,
            message: action.error.message || "Lấy danh sách dịch vụ thất bại",
          };
        }
      })

      // ✅ Get service by ID cases
      .addCase(getServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getServiceById.fulfilled,
        (state, action: PayloadAction<ServiceResponse>) => {
          state.loading = false;
          state.currentService = action.payload.data;
          state.error = null;
          console.log("✅ Retrieved service:", action.payload.data.name);
        }
      )
      .addCase(getServiceById.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.error = {
            code: 1,
            message: action.error.message || "Lấy thông tin dịch vụ thất bại",
          };
        }
      })

      // ✅ Create service cases
      .addCase(createService.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(
        createService.fulfilled,
        (state, action: PayloadAction<SimpleResponse>) => {
          state.creating = false;
          state.createError = null;
          console.log("✅ Create service successful:", action.payload.message);
        }
      )
      .addCase(createService.rejected, (state, action) => {
        state.creating = false;
        if (action.payload) {
          state.createError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.createError = {
            code: 1,
            message: action.error.message || "Tạo dịch vụ thất bại",
          };
        }
      })

      // ✅ Update service cases
      .addCase(updateService.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(
        updateService.fulfilled,
        (state, action: PayloadAction<SimpleResponse>) => {
          state.updating = false;
          state.updateError = null;
          console.log("✅ Update service successful:", action.payload.message);
          // Sau khi update thành công, cần fetch lại data mới
        }
      )
      .addCase(updateService.rejected, (state, action) => {
        state.updating = false;
        if (action.payload) {
          state.updateError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.updateError = {
            code: 1,
            message: action.error.message || "Cập nhật dịch vụ thất bại",
          };
        }
      })

      // ✅ Delete service cases
      .addCase(deleteService.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(deleteService.fulfilled, (state, { payload, meta }) => {
        state.deleting = false;
        state.deleteError = null;

        // Reset currentService nếu đã bị xóa
        if (state.currentService && meta.arg === state.currentService.id) {
          state.currentService = null;
        }

        // Remove from services list
        state.services = state.services.filter(
          (service) => service.id !== meta.arg
        );

        console.log("✅ Delete service successful:", payload.message);
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.deleting = false;
        if (action.payload) {
          state.deleteError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.deleteError = {
            code: 1,
            message: action.error.message || "Xóa dịch vụ thất bại",
          };
        }
      });
  },
});

export const {
  clearServiceError,
  clearSearchError,
  clearUpdateError,
  clearDeleteError,
  clearCreateError,
  clearAllServiceErrors,
  resetServiceState,
  clearServicesList,
  setCurrentService,
} = serviceSlice.actions;

export default serviceSlice.reducer;
