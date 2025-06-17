// store/slices/customerSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/config/axios";

// ✅ Interfaces updated based on real API responses
interface CustomerState {
  loading: boolean;
  updating: boolean;
  searching: boolean;
  customers: CustomerWithAccount[]; // ✅ Array of customers with nested account
  currentCustomer: CustomerProfile | null;
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
}

// ✅ Customer profile structure (for single customer)
interface CustomerProfile {
  account_id: string;
  full_name: string;
  gender: string;
  birthday: string;
}

// ✅ Customer with nested account structure (for list)
interface CustomerWithAccount {
  account_id: string;
  full_name: string;
  gender: string;
  birthday: string;
  account: {
    id: string;
    username: string;
    password: string;
    email: string;
    img_url: string | null;
    img_url_id: string | null;
  };
}

// ✅ Search customers request (with query parameters)
interface SearchCustomersRequest {
  name?: string;
  gender?: string;
  email?: string;
  limit?: number;
  offset?: number;
}

// ✅ Update customer request
interface UpdateCustomerRequest {
  account_id: string;
  full_name: string;
  gender: string;
  birthday: string;
}

// ✅ Response interfaces based on real API
interface CustomerResponse {
  // For GET /Customer/{id} - returns single customer object directly
  data: CustomerProfile;
}

interface CustomersListResponse {
  // For GET /Customer - returns array directly  
  data: CustomerWithAccount[];
}

interface UpdateCustomerResponse {
  // For PUT /Customer - returns simple message
  message: string;
}

interface ErrorResponse {
  error: number;
  message: string;
}

// Initial state
const initialState: CustomerState = {
  loading: false,
  updating: false,
  searching: false,
  customers: [],
  currentCustomer: null,
  error: null,
  searchError: null,
  updateError: null,
};

// ✅ 1. Get all customers (with optional search parameters)
export const getAllCustomers = createAsyncThunk<
  CustomersListResponse,
  SearchCustomersRequest | void,
  { rejectValue: ErrorResponse }
>("customer/getAll", async (params = {}, { rejectWithValue }) => {
  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();
    
    if (params.name) queryParams.append("name", params.name);
    if (params.gender) queryParams.append("gender", params.gender);
    if (params.email) queryParams.append("email", params.email);
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.offset) queryParams.append("offset", params.offset.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `Customer?${queryString}` : "Customer";

    const response = await api.get(endpoint, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Get All Customers Response:", response.data);

    // ✅ API trả về array trực tiếp, không có wrapper object
    if (!Array.isArray(response.data)) {
      return rejectWithValue({
        error: 1,
        message: "Định dạng dữ liệu từ server không hợp lệ",
      });
    }

    return {
      data: response.data, // response.data is already an array
    };
  } catch (err: any) {
    console.error("❌ Get All Customers Error:", err.response?.data);

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
            message: "Không tìm thấy khách hàng nào",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Lấy danh sách khách hàng thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 2. Get customer by ID
export const getCustomerById = createAsyncThunk<
  CustomerResponse,
  string, // account_id
  { rejectValue: ErrorResponse }
>("customer/getById", async (accountId, { rejectWithValue }) => {
  try {
    const response = await api.get(`Customer/${accountId}`, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Get Customer By ID Response:", response.data);

    // ✅ API trả về object trực tiếp, không có wrapper
    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return {
      data: response.data, // response.data is the customer object directly
    };
  } catch (err: any) {
    console.error("❌ Get Customer By ID Error:", err.response?.data);

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
            message: "Không tìm thấy thông tin khách hàng",
          });
        case 400:
          return rejectWithValue({
            error: 400,
            message: errorData?.message || "ID khách hàng không hợp lệ",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Lấy thông tin khách hàng thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 3. Update customer profile
export const updateCustomer = createAsyncThunk<
  UpdateCustomerResponse,
  UpdateCustomerRequest,
  { rejectValue: ErrorResponse }
>("customer/update", async (data, { rejectWithValue }) => {
  try {
    const response = await api.put("Customer", data, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });

    console.log("✅ Update Customer Response:", response.data);

    // ✅ API chỉ trả về message string
    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return {
      message: response.data, // response.data is just the success message
    };
  } catch (err: any) {
    console.error("❌ Update Customer Error:", err.response?.data);

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
            message: "Không tìm thấy khách hàng để cập nhật",
          });
        case 409:
          return rejectWithValue({
            error: 409,
            message: "Thông tin khách hàng đã tồn tại",
          });
        default:
          return rejectWithValue({
            error: status,
            message: errorData?.message || "Cập nhật thông tin khách hàng thất bại",
          });
      }
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// Customer slice
const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    clearCustomerError: (state) => {
      state.error = null;
    },
    clearSearchError: (state) => {
      state.searchError = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearAllCustomerErrors: (state) => {
      state.error = null;
      state.searchError = null;
      state.updateError = null;
    },
    resetCustomerState: (state) => {
      Object.assign(state, initialState);
    },
    clearCustomersList: (state) => {
      state.customers = [];
    },
    setCurrentCustomer: (state, action: PayloadAction<CustomerProfile | null>) => {
      state.currentCustomer = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Get all customers cases
      .addCase(getAllCustomers.pending, (state) => {
        state.searching = true;
        state.searchError = null;
      })
      .addCase(
        getAllCustomers.fulfilled,
        (state, action: PayloadAction<CustomersListResponse>) => {
          state.searching = false;
          state.customers = action.payload.data; // ✅ Direct array assignment
          state.searchError = null;
          console.log(`✅ Retrieved ${action.payload.data.length} customers`);
        }
      )
      .addCase(getAllCustomers.rejected, (state, action) => {
        state.searching = false;
        if (action.payload) {
          state.searchError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.searchError = {
            code: 1,
            message: action.error.message || "Lấy danh sách khách hàng thất bại",
          };
        }
      })
      
      // ✅ Get customer by ID cases
      .addCase(getCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCustomerById.fulfilled,
        (state, action: PayloadAction<CustomerResponse>) => {
          state.loading = false;
          state.currentCustomer = action.payload.data; // ✅ Direct object assignment
          state.error = null;
          console.log("✅ Retrieved customer:", action.payload.data.full_name);
        }
      )
      .addCase(getCustomerById.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.error = {
            code: 1,
            message: action.error.message || "Lấy thông tin khách hàng thất bại",
          };
        }
      })
      
      // ✅ Update customer cases
      .addCase(updateCustomer.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(
        updateCustomer.fulfilled,
        (state, action: PayloadAction<UpdateCustomerResponse>) => {
          state.updating = false;
          state.updateError = null;
          
          console.log("✅ Update customer successful:", action.payload.message);
          
          // ✅ Sau khi update thành công, cần fetch lại data mới
          // Component sẽ handle việc này bằng cách gọi getCustomerById
        }
      )
      .addCase(updateCustomer.rejected, (state, action) => {
        state.updating = false;
        if (action.payload) {
          state.updateError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.updateError = {
            code: 1,
            message: action.error.message || "Cập nhật thông tin khách hàng thất bại",
          };
        }
      });
  },
});

export const {
  clearCustomerError,
  clearSearchError,
  clearUpdateError,
  clearAllCustomerErrors,
  resetCustomerState,
  clearCustomersList,
  setCurrentCustomer,
} = customerSlice.actions;

export default customerSlice.reducer;
