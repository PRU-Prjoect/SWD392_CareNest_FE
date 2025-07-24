// store/slices/hotelSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/config/axios";

// Interfaces

interface HotelState {
  loading: boolean;
  updating: boolean;
  searching: boolean;
  deleting: boolean;
  creating: boolean;
  reportLoading: boolean;
  hotelReportByIdLoading: boolean;
  hotels: HotelData[];
  currentHotel: HotelData | null;
  hotelReport: HotelReportData | null;
  hotelReportById: HotelReportData | null;
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
  reportByIdError: {
    code: number;
    message: string;
  } | null;
}

interface HotelData {
  id: string;
  name: string;
  description: string;
  total_room: number;
  available_room: number;
  shop_id: string;
  sub_address_id: string;
  is_active: boolean;
}

interface HotelReportData {
  globalTotalRooms: number;
  globalAvailableRooms: number;
  globalAvailableRoomsPercent: number;
  hotelList: HotelReportItem[];
}

interface HotelReportItem {
  name: string;
  address_name: string;
  totalRooms: number;
  availableRooms: number;
  availableRoomsPercent: number;
}

// Request interfaces

interface SearchHotelRequest {
  shopId?: string;
  nameFilter?: string;
}

interface CreateHotelRequest {
  name: string;
  description: string;
  total_room: number;
  available_room: number;
  shop_id: string;
  sub_address_id: string;
  is_active: boolean;
}

interface UpdateHotelRequest {
  id: string;
  name: string;
  description: string;
  total_room: number;
  available_room: number;
  shop_id: string;
  sub_address_id: string;
  is_active: boolean;
}

// Response interfaces

interface HotelResponse {
  data: HotelData;
}

interface HotelListResponse {
  data: HotelData[];
}

interface HotelReportResponse {
  data: HotelReportData;
}

interface HotelReportByIdResponse {
  message: string;
  data: HotelReportData;
}

interface SimpleResponse {
  message: string;
}

interface ErrorResponse {
  error: number;
  message: string;
}

// Initial state

const initialState: HotelState = {
  loading: false,
  updating: false,
  searching: false,
  deleting: false,
  creating: false,
  reportLoading: false,
  hotelReportByIdLoading: false,
  hotels: [],
  currentHotel: null,
  hotelReport: null,
  hotelReportById: null,
  error: null,
  searchError: null,
  updateError: null,
  deleteError: null,
  createError: null,
  reportError: null,
  reportByIdError: null,
};

// ✅ 1. Search hotels with filters

export const searchHotels = createAsyncThunk<
  HotelListResponse,
  SearchHotelRequest | void,
  { rejectValue: ErrorResponse }
>("hotel/search", async (params = {}, { rejectWithValue }) => {
  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();
    if (params?.shopId) queryParams.append("shopId", params.shopId);
    if (params?.nameFilter) queryParams.append("nameFilter", params.nameFilter);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `Hotel?${queryString}` : "Hotel";

    const response = await api.get(endpoint, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Search Hotels Response:", response.data);

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
    console.error("❌ Search Hotels Error:", err.response?.data);
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
            message: "Không tìm thấy khách sạn nào",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Tìm kiếm khách sạn thất bại",
          });
      }
    }
    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 2. Get hotel by ID

export const getHotelById = createAsyncThunk<
  HotelResponse,
  string,
  { rejectValue: ErrorResponse }
>("hotel/getById", async (hotelId, { rejectWithValue }) => {
  try {
    const response = await api.get(`Hotel/${hotelId}`, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Get Hotel By ID Response:", response.data);

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
    console.error("❌ Get Hotel By ID Error:", err.response?.data);
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
            message: "Không tìm thấy thông tin khách sạn",
          });
        case 400:
          return rejectWithValue({
            error: 400,
            message: errorData?.message || "ID khách sạn không hợp lệ",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Lấy thông tin khách sạn thất bại",
          });
      }
    }
    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 3. Create hotel

export const createHotel = createAsyncThunk<
  SimpleResponse,
  CreateHotelRequest,
  { rejectValue: ErrorResponse }
>("hotel/create", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post("Hotel", data, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });

    console.log("✅ Create Hotel Response:", response.data);

    return {
      message: response.data || "Hotel created successfully",
    };
  } catch (err: any) {
    console.error("❌ Create Hotel Error:", err.response?.data);
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
            message: errorData?.message || "Dữ liệu tạo khách sạn không hợp lệ",
          });
        case 403:
          return rejectWithValue({
            error: 403,
            message: "Không có quyền tạo khách sạn",
          });
        case 409:
          return rejectWithValue({
            error: 409,
            message: "Khách sạn đã tồn tại",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Tạo khách sạn thất bại",
          });
      }
    }
    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 4. Update hotel

export const updateHotel = createAsyncThunk<
  SimpleResponse,
  UpdateHotelRequest,
  { rejectValue: ErrorResponse }
>("hotel/update", async (data, { rejectWithValue }) => {
  try {
    const { id, ...updateData } = data;
    const response = await api.put(`Hotel/update/${id}`, updateData, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });

    console.log("✅ Update Hotel Response:", response.data);

    return {
      message: response.data || "Hotel updated successfully",
    };
  } catch (err: any) {
    console.error("❌ Update Hotel Error:", err.response?.data);
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
            message: "Không tìm thấy khách sạn để cập nhật",
          });
        case 403:
          return rejectWithValue({
            error: 403,
            message: "Không có quyền cập nhật khách sạn này",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Cập nhật khách sạn thất bại",
          });
      }
    }
    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 5. Delete hotel

export const deleteHotel = createAsyncThunk<
  SimpleResponse,
  string,
  { rejectValue: ErrorResponse }
>("hotel/delete", async (hotelId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`Hotel/${hotelId}`, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Delete Hotel Response:", response.data);

    return {
      message: response.data || "Hotel deleted successfully",
    };
  } catch (err: any) {
    console.error("❌ Delete Hotel Error:", err.response?.data);
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
            message: "Không tìm thấy khách sạn để xóa",
          });
        case 403:
          return rejectWithValue({
            error: 403,
            message: "Không có quyền xóa khách sạn này",
          });
        case 409:
          return rejectWithValue({
            error: 409,
            message: "Không thể xóa khách sạn này do có dữ liệu liên quan",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Xóa khách sạn thất bại",
          });
      }
    }
    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 6. Get hotel report

export const getHotelReport = createAsyncThunk<
  HotelReportResponse,
  string,
  { rejectValue: ErrorResponse }
>("hotel/getReport", async (shopId, { rejectWithValue }) => {
  try {
    const response = await api.get(`Hotel/${shopId}/report`, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Get Hotel Report Response:", response.data);

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
    console.error("❌ Get Hotel Report Error:", err.response?.data);
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
            message: "Không tìm thấy báo cáo khách sạn",
          });
        case 400:
          return rejectWithValue({
            error: 400,
            message: errorData?.message || "ID cửa hàng không hợp lệ",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Lấy báo cáo khách sạn thất bại",
          });
      }
    }
    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 7. Get hotel report by hotel ID

export const getHotelReportById = createAsyncThunk<
  HotelReportByIdResponse,
  string,
  { rejectValue: ErrorResponse }
>("hotel/getReportById", async (hotelId, { rejectWithValue }) => {
  try {
    const response = await api.get(`Hotel/${hotelId}/report`, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Get Hotel Report By ID Response:", response.data);

    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return response.data;
  } catch (err: any) {
    console.error("❌ Get Hotel Report By ID Error:", err.response?.data);
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
            message: "Không tìm thấy báo cáo khách sạn",
          });
        case 400:
          return rejectWithValue({
            error: 400,
            message: errorData?.message || "ID khách sạn không hợp lệ",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Lấy báo cáo khách sạn thất bại",
          });
      }
    }
    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// Hotel slice

const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {
    clearHotelError: (state) => {
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
    clearReportByIdError: (state) => {
      state.reportByIdError = null;
    },
    clearAllHotelErrors: (state) => {
      state.error = null;
      state.searchError = null;
      state.updateError = null;
      state.deleteError = null;
      state.createError = null;
      state.reportError = null;
      state.reportByIdError = null;
    },
    resetHotelState: (state) => {
      Object.assign(state, initialState);
    },
    clearHotelsList: (state) => {
      state.hotels = [];
    },
    clearHotelReport: (state) => {
      state.hotelReport = null;
    },
    clearHotelReportById: (state) => {
      state.hotelReportById = null;
    },
    setCurrentHotel: (state, action: PayloadAction<HotelData | null>) => {
      state.currentHotel = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Search hotels cases
      .addCase(searchHotels.pending, (state) => {
        state.searching = true;
        state.searchError = null;
      })
      .addCase(
        searchHotels.fulfilled,
        (state, action: PayloadAction<HotelListResponse>) => {
          state.searching = false;
          state.hotels = action.payload.data;
          state.searchError = null;
          console.log(`✅ Retrieved ${action.payload.data.length} hotels`);
        }
      )
      .addCase(searchHotels.rejected, (state, action) => {
        state.searching = false;
        if (action.payload) {
          state.searchError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.searchError = {
            code: 1,
            message: action.error.message || "Tìm kiếm khách sạn thất bại",
          };
        }
      })

      // ✅ Get hotel by ID cases
      .addCase(getHotelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getHotelById.fulfilled,
        (state, action: PayloadAction<HotelResponse>) => {
          state.loading = false;
          state.currentHotel = action.payload.data;
          state.error = null;
          console.log("✅ Retrieved hotel:", action.payload.data.name);
        }
      )
      .addCase(getHotelById.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.error = {
            code: 1,
            message: action.error.message || "Lấy thông tin khách sạn thất bại",
          };
        }
      })

      // ✅ Create hotel cases
      .addCase(createHotel.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(
        createHotel.fulfilled,
        (state, action: PayloadAction<SimpleResponse>) => {
          state.creating = false;
          state.createError = null;
          console.log("✅ Create hotel successful:", action.payload.message);
        }
      )
      .addCase(createHotel.rejected, (state, action) => {
        state.creating = false;
        if (action.payload) {
          state.createError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.createError = {
            code: 1,
            message: action.error.message || "Tạo khách sạn thất bại",
          };
        }
      })

      // ✅ Update hotel cases
      .addCase(updateHotel.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(
        updateHotel.fulfilled,
        (state, action: PayloadAction<SimpleResponse>) => {
          state.updating = false;
          state.updateError = null;
          console.log("✅ Update hotel successful:", action.payload.message);
        }
      )
      .addCase(updateHotel.rejected, (state, action) => {
        state.updating = false;
        if (action.payload) {
          state.updateError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.updateError = {
            code: 1,
            message: action.error.message || "Cập nhật khách sạn thất bại",
          };
        }
      })

      // ✅ Delete hotel cases
      .addCase(deleteHotel.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(
        deleteHotel.fulfilled,
        (state, { payload, meta }) => {
          state.deleting = false;
          state.deleteError = null;
          
          // Reset currentHotel nếu đã bị xóa
          if (state.currentHotel && meta.arg === state.currentHotel.id) {
            state.currentHotel = null;
          }

          // Remove from hotels list
          state.hotels = state.hotels.filter(
            (hotel) => hotel.id !== meta.arg
          );
          
          console.log("✅ Delete hotel successful:", payload.message);
        }
      )
      .addCase(deleteHotel.rejected, (state, action) => {
        state.deleting = false;
        if (action.payload) {
          state.deleteError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.deleteError = {
            code: 1,
            message: action.error.message || "Xóa khách sạn thất bại",
          };
        }
      })

      // ✅ Get hotel report cases
      .addCase(getHotelReport.pending, (state) => {
        state.reportLoading = true;
        state.reportError = null;
      })
      .addCase(
        getHotelReport.fulfilled,
        (state, action: PayloadAction<HotelReportResponse>) => {
          state.reportLoading = false;
          state.hotelReport = action.payload.data;
          state.reportError = null;
          console.log("✅ Retrieved hotel report:", action.payload.data);
        }
      )
      .addCase(getHotelReport.rejected, (state, action) => {
        state.reportLoading = false;
        if (action.payload) {
          state.reportError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.reportError = {
            code: 1,
            message: action.error.message || "Lấy báo cáo khách sạn thất bại",
          };
        }
      })

      // ✅ Get hotel report by ID cases
      .addCase(getHotelReportById.pending, (state) => {
        state.hotelReportByIdLoading = true;
        state.reportByIdError = null;
      })
      .addCase(
        getHotelReportById.fulfilled,
        (state, action: PayloadAction<HotelReportByIdResponse>) => {
          state.hotelReportByIdLoading = false;
          state.hotelReportById = action.payload.data;
          state.reportByIdError = null;
          console.log("✅ Retrieved hotel report by ID:", action.payload.data);
        }
      )
      .addCase(getHotelReportById.rejected, (state, action) => {
        state.hotelReportByIdLoading = false;
        if (action.payload) {
          state.reportByIdError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.reportByIdError = {
            code: 1,
            message: action.error.message || "Lấy báo cáo khách sạn thất bại",
          };
        }
      });
  },
});

export const {
  clearHotelError,
  clearSearchError,
  clearUpdateError,
  clearDeleteError,
  clearCreateError,
  clearReportError,
  clearReportByIdError,
  clearAllHotelErrors,
  resetHotelState,
  clearHotelsList,
  clearHotelReport,
  clearHotelReportById,
  setCurrentHotel,
} = hotelSlice.actions;

export default hotelSlice.reducer;
