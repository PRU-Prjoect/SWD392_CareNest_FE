// store/slices/appointmentSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/config/axios";
import type { AppointmentStatus } from "@/types/enums";

// Interfaces

interface AppointmentState {
  loading: boolean;
  updating: boolean;
  searching: boolean;
  deleting: boolean;
  creating: boolean;
  loadingReport: boolean;
  appointments: AppointmentData[];
  currentAppointment: AppointmentData | null;
  reportData: AppointmentReportData | null;
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
  reportError: {
    code: number;
    message: string;
  } | null;
}

interface AppointmentData {
  id: string;
  customer_id: string;
  location_type?: string; // ✅ Optional vì response POST không có field này
  status: AppointmentStatus;
  notes: string;
  start_time: string;
  end_time?: string; // ✅ Optional vì response POST không có field này
}

interface AppointmentReportData {
  total: number;
  finish: number;
  cancel: number;
  inProgress: number;
  noProgress: number;
  finishPercent: number;
  cancelPercent: number;
  inProgressPercent: number;
  noProgressPercent: number;
}

// Request interfaces
interface SearchAppointmentsRequest {
  customerId?: string;
  status?: AppointmentStatus;
  startTime?: string;
  endTime?: string;
  locationTy?: string;
  limit?: number;
  offset?: number;
}

interface CreateAppointmentRequest {
  id: string;
  customer_id: string;
  status: AppointmentStatus;
  notes: string;
  start_time: string;
}

interface UpdateAppointmentRequest {
  id: string;
  customer_id: string;
  location_type: string;
  status: AppointmentStatus;
  notes: string;
  start_time: string;
  end_time: string;
}

// Response interfaces
interface AppointmentResponse {
  data: AppointmentData;
}

interface AppointmentsListResponse {
  data: AppointmentData[];
}

// ✅ Interface mới cho Create Appointment Response (trả về trực tiếp object)
interface CreateAppointmentResponse {
  id: string;
  customer_id: string;
  status: AppointmentStatus;
  notes: string;
  start_time: string;
}

interface AppointmentReportResponse {
  message: string;
  data: AppointmentReportData;
}

interface SimpleResponse {
  message: string;
}

interface ErrorResponse {
  error: number;
  message: string;
}

// Initial state
const initialState: AppointmentState = {
  loading: false,
  updating: false,
  searching: false,
  deleting: false,
  creating: false,
  loadingReport: false,
  appointments: [],
  currentAppointment: null,
  reportData: null,
  error: null,
  searchError: null,
  updateError: null,
  deleteError: null,
  createError: null,
  reportError: null,
};

// ✅ 1. Get all appointments
export const getAllAppointments = createAsyncThunk<
  AppointmentsListResponse,
  SearchAppointmentsRequest,
  { rejectValue: ErrorResponse }
>("appointment/getAll", async (params = {}, { rejectWithValue }) => {
  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();
    if (params.customerId) queryParams.append("customerId", params.customerId);
    if (params.status) queryParams.append("status", params.status);
    if (params.startTime) queryParams.append("startTime", params.startTime);
    if (params.endTime) queryParams.append("endTime", params.endTime);
    if (params.locationTy) queryParams.append("locationTy", params.locationTy);
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.offset) queryParams.append("offset", params.offset.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `Appointments?${queryString}`
      : "Appointments";

    const response = await api.get(endpoint, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Get All Appointments Response:", response.data);

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
    console.error("❌ Get All Appointments Error:", err.response?.data);
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
            message: "Không tìm thấy cuộc hẹn nào",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Lấy danh sách cuộc hẹn thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 2. Get appointment by ID
export const getAppointmentById = createAsyncThunk<
  AppointmentResponse,
  string,
  { rejectValue: ErrorResponse }
>("appointment/getById", async (appointmentId, { rejectWithValue }) => {
  try {
    const response = await api.get(`Appointments/${appointmentId}`, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Get Appointment By ID Response:", response.data);

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
    console.error("❌ Get Appointment By ID Error:", err.response?.data);
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
            message: "Không tìm thấy thông tin cuộc hẹn",
          });
        case 400:
          return rejectWithValue({
            error: 400,
            message: errorData?.message || "ID cuộc hẹn không hợp lệ",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Lấy thông tin cuộc hẹn thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 3. Create appointment (Updated return type)
export const createAppointment = createAsyncThunk<
  CreateAppointmentResponse, // ✅ Đổi từ SimpleResponse thành CreateAppointmentResponse
  CreateAppointmentRequest,
  { rejectValue: ErrorResponse }
>("appointment/create", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post("Appointments", data, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });

    console.log("✅ Create Appointment Response:", response.data);

    // ✅ Kiểm tra response có đúng format không
    if (!response.data || !response.data.id) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    // ✅ Trả về trực tiếp object appointment
    return response.data;
  } catch (err: any) {
    console.error("❌ Create Appointment Error:", err.response?.data);
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
            message: errorData?.message || "Dữ liệu tạo cuộc hẹn không hợp lệ",
          });
        case 409:
          return rejectWithValue({
            error: 409,
            message: "Cuộc hẹn đã tồn tại hoặc xung đột thời gian",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Tạo cuộc hẹn thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 4. Update appointment
export const updateAppointment = createAsyncThunk<
  SimpleResponse,
  UpdateAppointmentRequest,
  { rejectValue: ErrorResponse }
>("appointment/update", async (data, { rejectWithValue }) => {
  try {
    const response = await api.put("Appointments", data, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });

    console.log("✅ Update Appointment Response:", response.data);

    return {
      message: response.data || "Appointment updated successfully",
    };
  } catch (err: any) {
    console.error("❌ Update Appointment Error:", err.response?.data);
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
            message: "Không tìm thấy cuộc hẹn để cập nhật",
          });
        case 409:
          return rejectWithValue({
            error: 409,
            message: "Xung đột thời gian hoặc thông tin cuộc hẹn",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Cập nhật cuộc hẹn thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 5. Delete appointment
export const deleteAppointment = createAsyncThunk<
  SimpleResponse,
  string,
  { rejectValue: ErrorResponse }
>("appointment/delete", async (appointmentId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`Appointments/${appointmentId}`, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Delete Appointment Response:", response.data);

    return {
      message: response.data || "Appointment deleted successfully",
    };
  } catch (err: any) {
    console.error("❌ Delete Appointment Error:", err.response?.data);
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
            message: "Không tìm thấy cuộc hẹn để xóa",
          });
        case 400:
          return rejectWithValue({
            error: 400,
            message: errorData?.message || "ID cuộc hẹn không hợp lệ",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Xóa cuộc hẹn thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 6. Get appointment report
export const getAppointmentReport = createAsyncThunk<
  AppointmentReportResponse,
  void,
  { rejectValue: ErrorResponse }
>("appointment/getReport", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("Appointments/report", {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Get Appointment Report Response:", response.data);

    if (!response.data || !response.data.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return response.data;
  } catch (err: any) {
    console.error("❌ Get Appointment Report Error:", err.response?.data);
    if (err.response) {
      const status = err.response.status;
      const errorData = err.response.data;
      switch (status) {
        case 401:
          return rejectWithValue({
            error: 401,
            message: "Không có quyền truy cập. Vui lòng đăng nhập lại.",
          });
        case 403:
          return rejectWithValue({
            error: 403,
            message: "Không có quyền xem báo cáo",
          });
        case 404:
          return rejectWithValue({
            error: 404,
            message: "Không tìm thấy dữ liệu báo cáo",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Lấy báo cáo cuộc hẹn thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// Appointment slice
const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    clearAppointmentError: (state) => {
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
    clearReportError: (state) => {
      state.reportError = null;
    },
    clearAllAppointmentErrors: (state) => {
      state.error = null;
      state.searchError = null;
      state.updateError = null;
      state.deleteError = null;
      state.createError = null;
      state.reportError = null;
    },
    resetAppointmentState: (state) => {
      Object.assign(state, initialState);
    },
    clearAppointmentsList: (state) => {
      state.appointments = [];
    },
    clearReportData: (state) => {
      state.reportData = null;
    },
    setCurrentAppointment: (state, action: PayloadAction<AppointmentData>) => {
      state.currentAppointment = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Get all appointments cases
      .addCase(getAllAppointments.pending, (state) => {
        state.searching = true;
        state.searchError = null;
      })
      .addCase(
        getAllAppointments.fulfilled,
        (state, action: PayloadAction<AppointmentsListResponse>) => {
          state.searching = false;
          state.appointments = action.payload.data;
          state.searchError = null;
          console.log(
            `✅ Retrieved ${action.payload.data.length} appointments`
          );
        }
      )
      .addCase(getAllAppointments.rejected, (state, action) => {
        state.searching = false;
        if (action.payload) {
          state.searchError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.searchError = {
            code: 1,
            message: action.error.message || "Lấy danh sách cuộc hẹn thất bại",
          };
        }
      })

      // ✅ Get appointment by ID cases
      .addCase(getAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAppointmentById.fulfilled,
        (state, action: PayloadAction<AppointmentResponse>) => {
          state.loading = false;
          state.currentAppointment = action.payload.data;
          state.error = null;
          console.log("✅ Retrieved appointment:", action.payload.data.id);
        }
      )
      .addCase(getAppointmentById.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.error = {
            code: 1,
            message: action.error.message || "Lấy thông tin cuộc hẹn thất bại",
          };
        }
      })

      // ✅ Create appointment cases (Updated)
      .addCase(createAppointment.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(
        createAppointment.fulfilled,
        (state, action: PayloadAction<CreateAppointmentResponse>) => {
          // ✅ Đổi type
          state.creating = false;
          state.createError = null;
          // ✅ Set current appointment với data mới tạo
          state.currentAppointment = {
            ...action.payload,
            location_type: "", // Default value
            end_time: "", // Default value
          };
          // ✅ Thêm vào danh sách appointments nếu cần
          state.appointments.unshift(state.currentAppointment);
          console.log("✅ Create appointment successful:", action.payload.id);
        }
      )
      .addCase(createAppointment.rejected, (state, action) => {
        state.creating = false;
        if (action.payload) {
          state.createError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.createError = {
            code: 1,
            message: action.error.message || "Tạo cuộc hẹn thất bại",
          };
        }
      })

      // ✅ Update appointment cases
      .addCase(updateAppointment.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(
        updateAppointment.fulfilled,
        (state, action: PayloadAction<SimpleResponse>) => {
          state.updating = false;
          state.updateError = null;
          console.log(
            "✅ Update appointment successful:",
            action.payload.message
          );
        }
      )
      .addCase(updateAppointment.rejected, (state, action) => {
        state.updating = false;
        if (action.payload) {
          state.updateError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.updateError = {
            code: 1,
            message: action.error.message || "Cập nhật cuộc hẹn thất bại",
          };
        }
      })

      // ✅ Delete appointment cases
      .addCase(deleteAppointment.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, { payload, meta }) => {
        state.deleting = false;
        state.deleteError = null;
        // Reset currentAppointment nếu đã bị xóa
        if (
          state.currentAppointment &&
          meta.arg === state.currentAppointment.id
        ) {
          state.currentAppointment = null;
        }
        // Remove from appointments list
        state.appointments = state.appointments.filter(
          (appointment) => appointment.id !== meta.arg
        );
        console.log("✅ Delete appointment successful:", payload.message);
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.deleting = false;
        if (action.payload) {
          state.deleteError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.deleteError = {
            code: 1,
            message: action.error.message || "Xóa cuộc hẹn thất bại",
          };
        }
      })

      // ✅ Get appointment report cases
      .addCase(getAppointmentReport.pending, (state) => {
        state.loadingReport = true;
        state.reportError = null;
      })
      .addCase(
        getAppointmentReport.fulfilled,
        (state, action: PayloadAction<AppointmentReportResponse>) => {
          state.loadingReport = false;
          state.reportData = action.payload.data;
          state.reportError = null;
          console.log("✅ Retrieved appointment report:", {
            total: action.payload.data.total,
            finish: action.payload.data.finish,
            finishPercent: action.payload.data.finishPercent,
          });
        }
      )
      .addCase(getAppointmentReport.rejected, (state, action) => {
        state.loadingReport = false;
        if (action.payload) {
          state.reportError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.reportError = {
            code: 1,
            message: action.error.message || "Lấy báo cáo cuộc hẹn thất bại",
          };
        }
      });
  },
});

export const {
  clearAppointmentError,
  clearSearchError,
  clearUpdateError,
  clearDeleteError,
  clearCreateError,
  clearReportError,
  clearAllAppointmentErrors,
  resetAppointmentState,
  clearAppointmentsList,
  clearReportData,
  setCurrentAppointment,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
