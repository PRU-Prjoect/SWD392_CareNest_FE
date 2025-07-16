// store/slices/roomSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/config/axios";
import { AxiosError } from "axios";

// Interfaces
interface RoomState {
  loading: boolean;
  updating: boolean;
  deleting: boolean;
  creating: boolean;
  rooms: RoomData[];
  currentRoom: RoomData | null;
  error: {
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

interface RoomData {
  id: string;
  room_number: number;
  room_type: number;
  max_capacity: number;
  daily_price: number;
  is_available: boolean;
  amendities: string;
  star: number;
  hotel_id: string;
}

// Request interfaces
interface GetRoomsRequest {
  hotelId?: string;
  roomType?: number;
}

interface CreateRoomRequest {
  id?: string;
  room_number: number;
  room_type: number;
  max_capacity: number;
  daily_price: number;
  is_available: boolean;
  amendities: string;
  star: number;
  hotel_id: string;
}

interface UpdateRoomRequest {
  id: string;
  room_number: number;
  room_type: number;
  max_capacity: number;
  daily_price: number;
  is_available: boolean;
  amendities: string;
  star: number;
  hotel_id: string;
}

// Response interfaces
interface RoomResponse {
  data: RoomData;
}

interface RoomListResponse {
  data: RoomData[];
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
const initialState: RoomState = {
  loading: false,
  updating: false,
  deleting: false,
  creating: false,
  rooms: [],
  currentRoom: null,
  error: null,
  updateError: null,
  deleteError: null,
  createError: null,
};

// ✅ 1. Get rooms with filters
export const getRooms = createAsyncThunk<
  RoomListResponse,
  GetRoomsRequest | void,
  { rejectValue: ErrorResponse }
>("room/getRooms", async (params = {}, { rejectWithValue }) => {
  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();
    if (params?.hotelId) queryParams.append("hotelId", params.hotelId);
    if (params?.roomType) queryParams.append("roomType", params.roomType.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `Room?${queryString}` : "Room";

    const response = await api.get(endpoint, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Get Rooms Response:", response.data);

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
    console.error("❌ Get Rooms Error:", error.response?.data);
    
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
            message: "No rooms found",
          });
        default:
          return rejectWithValue({
            error: status,
            code: status,
            message: errorData?.message || "Failed to get rooms",
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

// ✅ 2. Get room by ID
export const getRoomById = createAsyncThunk<
  RoomResponse,
  string,
  { rejectValue: ErrorResponse }
>("room/getRoomById", async (roomId, { rejectWithValue }) => {
  try {
    const response = await api.get(`Room/${roomId}`, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Get Room By ID Response:", response.data);

    if (!response.data) {
      return rejectWithValue({
        error: 1,
        code: 1,
        message: "Invalid response from server",
      });
    }

    return {
      data: response.data,
    };
  } catch (err) {
    const error = err as AxiosError<ApiErrorData>;
    console.error("❌ Get Room By ID Error:", error.response?.data);
    
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
            message: "Room not found",
          });
        default:
          return rejectWithValue({
            error: status,
            code: status,
            message: errorData?.message || "Failed to get room details",
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

// ✅ 3. Create new room
export const createRoom = createAsyncThunk<
  SimpleResponse,
  CreateRoomRequest,
  { rejectValue: ErrorResponse }
>("room/createRoom", async (roomData, { rejectWithValue }) => {
  try {
    const response = await api.post("Room", roomData, {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Create Room Response:", response.data);

    return {
      message: "Room created successfully",
    };
  } catch (err) {
    const error = err as AxiosError<ApiErrorData>;
    console.error("❌ Create Room Error:", error.response?.data);
    
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
            message: errorData?.message || "Invalid room data",
          });
        default:
          return rejectWithValue({
            error: status,
            code: status,
            message: errorData?.message || "Failed to create room",
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

// ✅ 4. Update room
export const updateRoom = createAsyncThunk<
  SimpleResponse,
  UpdateRoomRequest,
  { rejectValue: ErrorResponse }
>("room/updateRoom", async (roomData, { rejectWithValue }) => {
  try {
    const response = await api.put("Room", roomData, {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Update Room Response:", response.data);

    return {
      message: "Room updated successfully",
    };
  } catch (err) {
    const error = err as AxiosError<ApiErrorData>;
    console.error("❌ Update Room Error:", error.response?.data);
    
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
            message: errorData?.message || "Invalid room data",
          });
        case 404:
          return rejectWithValue({
            error: 404,
            code: 404,
            message: "Room not found",
          });
        default:
          return rejectWithValue({
            error: status,
            code: status,
            message: errorData?.message || "Failed to update room",
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

// ✅ 5. Delete room
export const deleteRoom = createAsyncThunk<
  SimpleResponse,
  string,
  { rejectValue: ErrorResponse }
>("room/deleteRoom", async (roomId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`Room/${roomId}`, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Delete Room Response:", response.data);

    return {
      message: "Room deleted successfully",
    };
  } catch (err) {
    const error = err as AxiosError<ApiErrorData>;
    console.error("❌ Delete Room Error:", error.response?.data);
    
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
            message: "Room not found",
          });
        default:
          return rejectWithValue({
            error: status,
            code: status,
            message: errorData?.message || "Failed to delete room",
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
const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    clearRoomErrors: (state) => {
      state.error = null;
      state.updateError = null;
      state.deleteError = null;
      state.createError = null;
    },
    resetRoomState: () => initialState,
  },
  extraReducers: (builder) => {
    // Get rooms
    builder
      .addCase(getRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRooms.fulfilled, (state, action: PayloadAction<RoomListResponse>) => {
        state.loading = false;
        state.rooms = action.payload.data;
      })
      .addCase(getRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          code: 1,
          message: "Failed to load rooms",
        };
      });

    // Get room by ID
    builder
      .addCase(getRoomById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoomById.fulfilled, (state, action: PayloadAction<RoomResponse>) => {
        state.loading = false;
        state.currentRoom = action.payload.data;
      })
      .addCase(getRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          code: 1,
          message: "Failed to load room details",
        };
      });

    // Create room
    builder
      .addCase(createRoom.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createRoom.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload || {
          code: 1,
          message: "Failed to create room",
        };
      });

    // Update room
    builder
      .addCase(updateRoom.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateRoom.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload || {
          code: 1,
          message: "Failed to update room",
        };
      });

    // Delete room
    builder
      .addCase(deleteRoom.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(deleteRoom.fulfilled, (state) => {
        state.deleting = false;
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError = action.payload || {
          code: 1,
          message: "Failed to delete room",
        };
      });
  },
});

export const { clearRoomErrors, resetRoomState } = roomSlice.actions;
export default roomSlice.reducer;
