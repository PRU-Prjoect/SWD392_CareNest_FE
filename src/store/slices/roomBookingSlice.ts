// store/slices/roomBookingSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/config/axios";
import { AxiosError } from "axios";

// Interfaces
interface RoomBookingState {
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  roomBookings: RoomBookingData[];
  currentBooking: RoomBookingData | null;
  error: {
    code: number;
    message: string;
  } | null;
  createError: {
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
}

interface RoomBookingData {
  id: string;
  room_detail_id: string;
  customer_id: string;
  check_in_date: string;
  check_out_date: string;
  total_night: number;
  total_amount: number;
  feeding_schedule: string;
  medication_schedule: string;
  status: boolean;
}

// Request interfaces
interface GetRoomBookingsRequest {
  roomDetailId?: string;
  customerId?: string;
  checkInDate?: string;
  checkOutDate?: string;
  status?: boolean;
}

interface CreateRoomBookingRequest {
  id?: string;
  room_detail_id: string;
  customer_id: string;
  check_in_date: string;
  check_out_date: string;
  total_night: number;
  total_amount: number;
  feeding_schedule: string;
  medication_schedule: string;
  status: boolean;
}

// Response interfaces
interface RoomBookingListResponse {
  data: RoomBookingData[];
}

interface SimpleResponse {
  message: string;
}

interface ErrorResponse {
  error: number;
  code: number;
  message: string;
}

// API Error response type
interface ApiErrorData {
  message?: string;
}

// Initial state
const initialState: RoomBookingState = {
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  roomBookings: [],
  currentBooking: null,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

// ✅ 1. Get room bookings with filters
export const getRoomBookings = createAsyncThunk<
  RoomBookingListResponse,
  GetRoomBookingsRequest | void,
  { rejectValue: ErrorResponse }
>("roomBooking/getRoomBookings", async (params = {}, { rejectWithValue }) => {
  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();
    if (params?.roomDetailId) queryParams.append("roomDetailId", params.roomDetailId);
    if (params?.customerId) queryParams.append("customerId", params.customerId);
    if (params?.checkInDate) queryParams.append("checkInDate", params.checkInDate);
    if (params?.checkOutDate) queryParams.append("checkOutDate", params.checkOutDate);
    if (params?.status !== undefined) queryParams.append("status", params.status.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `Room_Booking?${queryString}` : "Room_Booking";

    const response = await api.get(endpoint, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Get Room Bookings Response:", response.data);

    // API returns array directly
    if (!Array.isArray(response.data)) {
      return rejectWithValue({
        error: 1,
        code: 1,
        message: "Invalid data format from server",
      });
    }

    return {
      data: response.data,
    };
  } catch (err) {
    const error = err as AxiosError<ApiErrorData>;
    console.error("❌ Get Room Bookings Error:", error.response?.data);
    
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      switch (status) {
        case 401:
          return rejectWithValue({
            error: 401,
            code: 401,
            message: "Access denied. Please log in again.",
          });
        case 400:
          return rejectWithValue({
            error: 400,
            code: 400,
            message: errorData?.message || "Invalid search parameters",
          });
        case 404:
          return rejectWithValue({
            error: 404,
            code: 404,
            message: "No room bookings found",
          });
        default:
          return rejectWithValue({
            error: status,
            code: status,
            message: errorData?.message || "Failed to get room bookings",
          });
      }
    }
    
    return rejectWithValue({
      error: 1,
      code: 1,
      message: error instanceof Error ? error.message : "Cannot connect to server",
    });
  }
});

// ✅ 2. Create new room booking
export const createRoomBooking = createAsyncThunk<
  SimpleResponse,
  CreateRoomBookingRequest,
  { rejectValue: ErrorResponse }
>("roomBooking/createRoomBooking", async (bookingData, { rejectWithValue }) => {
  try {
    const response = await api.post("Room_Booking", bookingData, {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Create Room Booking Response:", response.data);

    return {
      message: "Room booking created successfully",
    };
  } catch (err) {
    const error = err as AxiosError<ApiErrorData>;
    console.error("❌ Create Room Booking Error:", error.response?.data);
    
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      switch (status) {
        case 401:
          return rejectWithValue({
            error: 401,
            code: 401,
            message: "Access denied. Please log in again.",
          });
        case 400:
          return rejectWithValue({
            error: 400,
            code: 400,
            message: errorData?.message || "Invalid booking data",
          });
        default:
          return rejectWithValue({
            error: status,
            code: status,
            message: errorData?.message || "Failed to create room booking",
          });
      }
    }
    
    return rejectWithValue({
      error: 1,
      code: 1,
      message: error instanceof Error ? error.message : "Cannot connect to server",
    });
  }
});

// ✅ 3. Get room booking by ID
export const getRoomBookingById = createAsyncThunk<
  RoomBookingData,
  string,
  { rejectValue: ErrorResponse }
>("roomBooking/getRoomBookingById", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`Room_Booking/${id}`, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Get Room Booking By ID Response:", response.data);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorData>;
    console.error("❌ Get Room Booking By ID Error:", error.response?.data);
    
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      switch (status) {
        case 401:
          return rejectWithValue({
            error: 401,
            code: 401,
            message: "Access denied. Please log in again.",
          });
        case 404:
          return rejectWithValue({
            error: 404,
            code: 404,
            message: "Room booking not found",
          });
        default:
          return rejectWithValue({
            error: status,
            code: status,
            message: errorData?.message || "Failed to get room booking",
          });
      }
    }
    
    return rejectWithValue({
      error: 1,
      code: 1,
      message: error instanceof Error ? error.message : "Cannot connect to server",
    });
  }
});

// ✅ 4. Update room booking
export const updateRoomBooking = createAsyncThunk<
  SimpleResponse,
  CreateRoomBookingRequest,
  { rejectValue: ErrorResponse }
>("roomBooking/updateRoomBooking", async (bookingData, { rejectWithValue }) => {
  try {
    const response = await api.put("Room_Booking", bookingData, {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Update Room Booking Response:", response.data);

    return {
      message: "Room booking updated successfully",
    };
  } catch (err) {
    const error = err as AxiosError<ApiErrorData>;
    console.error("❌ Update Room Booking Error:", error.response?.data);
    
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      switch (status) {
        case 401:
          return rejectWithValue({
            error: 401,
            code: 401,
            message: "Access denied. Please log in again.",
          });
        case 400:
          return rejectWithValue({
            error: 400,
            code: 400,
            message: errorData?.message || "Invalid booking data",
          });
        case 404:
          return rejectWithValue({
            error: 404,
            code: 404,
            message: "Room booking not found",
          });
        default:
          return rejectWithValue({
            error: status,
            code: status,
            message: errorData?.message || "Failed to update room booking",
          });
      }
    }
    
    return rejectWithValue({
      error: 1,
      code: 1,
      message: error instanceof Error ? error.message : "Cannot connect to server",
    });
  }
});

// ✅ 5. Delete room booking
export const deleteRoomBooking = createAsyncThunk<
  SimpleResponse,
  string,
  { rejectValue: ErrorResponse }
>("roomBooking/deleteRoomBooking", async (id, { rejectWithValue }) => {
  try {
    const response = await api.delete(`Room_Booking/${id}`, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Delete Room Booking Response:", response.data);

    return {
      message: "Room booking deleted successfully",
    };
  } catch (err) {
    const error = err as AxiosError<ApiErrorData>;
    console.error("❌ Delete Room Booking Error:", error.response?.data);
    
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      switch (status) {
        case 401:
          return rejectWithValue({
            error: 401,
            code: 401,
            message: "Access denied. Please log in again.",
          });
        case 404:
          return rejectWithValue({
            error: 404,
            code: 404,
            message: "Room booking not found",
          });
        default:
          return rejectWithValue({
            error: status,
            code: status,
            message: errorData?.message || "Failed to delete room booking",
          });
      }
    }
    
    return rejectWithValue({
      error: 1,
      code: 1,
      message: error instanceof Error ? error.message : "Cannot connect to server",
    });
  }
});

// Slice
const roomBookingSlice = createSlice({
  name: "roomBooking",
  initialState,
  reducers: {
    clearRoomBookingErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
    resetRoomBookingState: () => initialState,
  },
  extraReducers: (builder) => {
    // Get room bookings
    builder
      .addCase(getRoomBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoomBookings.fulfilled, (state, action: PayloadAction<RoomBookingListResponse>) => {
        state.loading = false;
        state.roomBookings = action.payload.data;
      })
      .addCase(getRoomBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          code: 1,
          message: "Failed to load room bookings",
        };
      });

    // Create room booking
    builder
      .addCase(createRoomBooking.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createRoomBooking.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(createRoomBooking.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload || {
          code: 1,
          message: "Failed to create room booking",
        };
      });

    // Get room booking by ID
    builder
      .addCase(getRoomBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoomBookingById.fulfilled, (state, action: PayloadAction<RoomBookingData>) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })
      .addCase(getRoomBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          code: 1,
          message: "Failed to load room booking",
        };
      });

    // Update room booking
    builder
      .addCase(updateRoomBooking.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateRoomBooking.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(updateRoomBooking.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload || {
          code: 1,
          message: "Failed to update room booking",
        };
      });

    // Delete room booking
    builder
      .addCase(deleteRoomBooking.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(deleteRoomBooking.fulfilled, (state) => {
        state.deleting = false;
      })
      .addCase(deleteRoomBooking.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError = action.payload || {
          code: 1,
          message: "Failed to delete room booking",
        };
      });
  },
});

export const { clearRoomBookingErrors, resetRoomBookingState } = roomBookingSlice.actions;
export default roomBookingSlice.reducer; 