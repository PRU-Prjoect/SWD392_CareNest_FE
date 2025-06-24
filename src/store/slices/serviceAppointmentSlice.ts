// store/slices/serviceAppointmentSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/config/axios";

// Interfaces

interface ServiceAppointmentState {
  loading: boolean;
  updating: boolean;
  searching: boolean;
  deleting: boolean;
  creating: boolean;
  serviceAppointments: ServiceAppointmentData[];
  currentServiceAppointment: ServiceAppointmentData | null;
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

interface ServiceAppointmentData {
  id: string;
  service_id: string;
  appointment_id: string;
  rating_id: string | null; // ✅ Luôn null theo spec
}

// Request interfaces
interface SearchServiceAppointmentsRequest {
  serviceId?: string;
  appointmentId?: string;
  startDate?: string; // ISO date string
}

interface CreateServiceAppointmentRequest {
  id: string;
  service_id: string;
  appointment_id: string;
}

interface UpdateServiceAppointmentRequest {
  id: string;
  service_id: string;
  appointment_id: string;
}

// Response interfaces
interface ServiceAppointmentResponse {
  data: ServiceAppointmentData;
}

interface ServiceAppointmentsListResponse {
  data: ServiceAppointmentData[];
}

interface SimpleResponse {
  message: string;
}

interface ErrorResponse {
  error: number;
  message: string;
}

// Initial state
const initialState: ServiceAppointmentState = {
  loading: false,
  updating: false,
  searching: false,
  deleting: false,
  creating: false,
  serviceAppointments: [],
  currentServiceAppointment: null,
  error: null,
  searchError: null,
  updateError: null,
  deleteError: null,
  createError: null,
};

// ✅ 1. Get all service appointments with search
export const getAllServiceAppointments = createAsyncThunk<
  ServiceAppointmentsListResponse,
  SearchServiceAppointmentsRequest,
  { rejectValue: ErrorResponse }
>("serviceAppointment/getAll", async (params = {}, { rejectWithValue }) => {
  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();
    if (params.serviceId) queryParams.append("serviceId", params.serviceId);
    if (params.appointmentId)
      queryParams.append("appointmentId", params.appointmentId);
    if (params.startDate) queryParams.append("startDate", params.startDate);

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `Service_Appointment?${queryString}`
      : "Service_Appointment";

    const response = await api.get(endpoint, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Get All Service Appointments Response:", response.data);

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
    console.error("❌ Get All Service Appointments Error:", err.response?.data);
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
            message: "Không tìm thấy service appointment nào",
          });
        default:
          return rejectWithValue({
            error: status,
            message:
              errorData?.message ||
              "Lấy danh sách service appointment thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 2. Get service appointment by ID
export const getServiceAppointmentById = createAsyncThunk<
  ServiceAppointmentResponse,
  string,
  { rejectValue: ErrorResponse }
>(
  "serviceAppointment/getById",
  async (serviceAppointmentId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `Service_Appointment/${serviceAppointmentId}`,
        {
          headers: {
            accept: "*/*",
          },
        }
      );

      console.log("✅ Get Service Appointment By ID Response:", response.data);

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
      console.error(
        "❌ Get Service Appointment By ID Error:",
        err.response?.data
      );
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
              message: "Không tìm thấy thông tin service appointment",
            });
          case 400:
            return rejectWithValue({
              error: 400,
              message:
                errorData?.message || "ID service appointment không hợp lệ",
            });
          default:
            return rejectWithValue({
              error: status,
              message:
                errorData?.message ||
                "Lấy thông tin service appointment thất bại",
            });
        }
      }

      return rejectWithValue({
        error: 1,
        message: err.message || "Không thể kết nối đến máy chủ",
      });
    }
  }
);

// ✅ 3. Create service appointment
export const createServiceAppointment = createAsyncThunk<
  SimpleResponse,
  CreateServiceAppointmentRequest,
  { rejectValue: ErrorResponse }
>("serviceAppointment/create", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post("Service_Appointment", data, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });

    console.log("✅ Create Service Appointment Response:", response.data);

    return {
      message: response.data || "Service appointment created successfully",
    };
  } catch (err: any) {
    console.error("❌ Create Service Appointment Error:", err.response?.data);
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
              errorData?.message ||
              "Dữ liệu tạo service appointment không hợp lệ",
          });
        case 409:
          return rejectWithValue({
            error: 409,
            message: "Service appointment đã tồn tại hoặc xung đột",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Tạo service appointment thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 4. Update service appointment
export const updateServiceAppointment = createAsyncThunk<
  SimpleResponse,
  UpdateServiceAppointmentRequest,
  { rejectValue: ErrorResponse }
>("serviceAppointment/update", async (data, { rejectWithValue }) => {
  try {
    const response = await api.put("Service_Appointment", data, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });

    console.log("✅ Update Service Appointment Response:", response.data);

    return {
      message: response.data || "Service appointment updated successfully",
    };
  } catch (err: any) {
    console.error("❌ Update Service Appointment Error:", err.response?.data);
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
            message: "Không tìm thấy service appointment để cập nhật",
          });
        case 409:
          return rejectWithValue({
            error: 409,
            message: "Xung đột thông tin service appointment",
          });
        default:
          return rejectWithValue({
            error: status,
            message:
              errorData?.message || "Cập nhật service appointment thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 5. Delete service appointment
export const deleteServiceAppointment = createAsyncThunk<
  SimpleResponse,
  string,
  { rejectValue: ErrorResponse }
>(
  "serviceAppointment/delete",
  async (serviceAppointmentId, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `Service_Appointment/${serviceAppointmentId}`,
        {
          headers: {
            accept: "*/*",
          },
        }
      );

      console.log("✅ Delete Service Appointment Response:", response.data);

      return {
        message: response.data || "Service appointment deleted successfully",
      };
    } catch (err: any) {
      console.error("❌ Delete Service Appointment Error:", err.response?.data);
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
              message: "Không tìm thấy service appointment để xóa",
            });
          case 400:
            return rejectWithValue({
              error: 400,
              message:
                errorData?.message || "ID service appointment không hợp lệ",
            });
          default:
            return rejectWithValue({
              error: status,
              message: errorData?.message || "Xóa service appointment thất bại",
            });
        }
      }

      return rejectWithValue({
        error: 1,
        message: err.message || "Không thể kết nối đến máy chủ",
      });
    }
  }
);

// Service Appointment slice
const serviceAppointmentSlice = createSlice({
  name: "serviceAppointment",
  initialState,
  reducers: {
    clearServiceAppointmentError: (state) => {
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
    clearAllServiceAppointmentErrors: (state) => {
      state.error = null;
      state.searchError = null;
      state.updateError = null;
      state.deleteError = null;
      state.createError = null;
    },
    resetServiceAppointmentState: (state) => {
      Object.assign(state, initialState);
    },
    clearServiceAppointmentsList: (state) => {
      state.serviceAppointments = [];
    },
    setCurrentServiceAppointment: (
      state,
      action: PayloadAction<ServiceAppointmentData>
    ) => {
      state.currentServiceAppointment = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Get all service appointments cases
      .addCase(getAllServiceAppointments.pending, (state) => {
        state.searching = true;
        state.searchError = null;
      })
      .addCase(
        getAllServiceAppointments.fulfilled,
        (state, action: PayloadAction<ServiceAppointmentsListResponse>) => {
          state.searching = false;
          state.serviceAppointments = action.payload.data;
          state.searchError = null;
          console.log(
            `✅ Retrieved ${action.payload.data.length} service appointments`
          );
        }
      )
      .addCase(getAllServiceAppointments.rejected, (state, action) => {
        state.searching = false;
        if (action.payload) {
          state.searchError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.searchError = {
            code: 1,
            message:
              action.error.message ||
              "Lấy danh sách service appointment thất bại",
          };
        }
      })

      // ✅ Get service appointment by ID cases
      .addCase(getServiceAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getServiceAppointmentById.fulfilled,
        (state, action: PayloadAction<ServiceAppointmentResponse>) => {
          state.loading = false;
          state.currentServiceAppointment = action.payload.data;
          state.error = null;
          console.log(
            "✅ Retrieved service appointment:",
            action.payload.data.id
          );
        }
      )
      .addCase(getServiceAppointmentById.rejected, (state, action) => {
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
              action.error.message ||
              "Lấy thông tin service appointment thất bại",
          };
        }
      })

      // ✅ Create service appointment cases
      .addCase(createServiceAppointment.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(
        createServiceAppointment.fulfilled,
        (state, action: PayloadAction<SimpleResponse>) => {
          state.creating = false;
          state.createError = null;
          console.log(
            "✅ Create service appointment successful:",
            action.payload.message
          );
        }
      )
      .addCase(createServiceAppointment.rejected, (state, action) => {
        state.creating = false;
        if (action.payload) {
          state.createError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.createError = {
            code: 1,
            message: action.error.message || "Tạo service appointment thất bại",
          };
        }
      })

      // ✅ Update service appointment cases
      .addCase(updateServiceAppointment.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(
        updateServiceAppointment.fulfilled,
        (state, action: PayloadAction<SimpleResponse>) => {
          state.updating = false;
          state.updateError = null;
          console.log(
            "✅ Update service appointment successful:",
            action.payload.message
          );
        }
      )
      .addCase(updateServiceAppointment.rejected, (state, action) => {
        state.updating = false;
        if (action.payload) {
          state.updateError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.updateError = {
            code: 1,
            message:
              action.error.message || "Cập nhật service appointment thất bại",
          };
        }
      })

      // ✅ Delete service appointment cases
      .addCase(deleteServiceAppointment.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(
        deleteServiceAppointment.fulfilled,
        (state, { payload, meta }) => {
          state.deleting = false;
          state.deleteError = null;
          // Reset currentServiceAppointment nếu đã bị xóa
          if (
            state.currentServiceAppointment &&
            meta.arg === state.currentServiceAppointment.id
          ) {
            state.currentServiceAppointment = null;
          }
          // Remove from serviceAppointments list
          state.serviceAppointments = state.serviceAppointments.filter(
            (serviceAppointment) => serviceAppointment.id !== meta.arg
          );
          console.log(
            "✅ Delete service appointment successful:",
            payload.message
          );
        }
      )
      .addCase(deleteServiceAppointment.rejected, (state, action) => {
        state.deleting = false;
        if (action.payload) {
          state.deleteError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.deleteError = {
            code: 1,
            message: action.error.message || "Xóa service appointment thất bại",
          };
        }
      });
  },
});

export const {
  clearServiceAppointmentError,
  clearSearchError,
  clearUpdateError,
  clearDeleteError,
  clearCreateError,
  clearAllServiceAppointmentErrors,
  resetServiceAppointmentState,
  clearServiceAppointmentsList,
  setCurrentServiceAppointment,
} = serviceAppointmentSlice.actions;

export default serviceAppointmentSlice.reducer;
