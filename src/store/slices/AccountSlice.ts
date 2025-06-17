// store/slices/accountSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/config/axios";

// Interfaces
interface AccountState {
  loading: boolean;
  updating: boolean;
  searching: boolean;
  deleting: boolean;
  sendingOtp: boolean;
  confirmingOtp: boolean;
  resettingPassword: boolean;
  activating: boolean;
  uploadingImage: boolean;
  accounts: AccountData[];
  currentAccount: AccountData | null;
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
  otpError: {
    code: number;
    message: string;
  } | null;
}

interface AccountData {
  id: string;
  username: string;
  password: string;
  email: string;
  role: string;
  is_active: boolean;
  img_url: string | null;
  img_url_id: string | null;
  banK_ACCOUNT_NO: string | null;
  banK_ACCOUNT_NAME: string | null;
  banK_ID: string | null;
  otp: string | null;
  otpExpired: string | null;
  shop: any | null;
  staff: any | null;
  customer: any | null;
  notification: any | null;
  created_at: string;
  updated_at: string;
}

// Request interfaces
interface ForgetPasswordRequest {
  email: string;
  password: string;
}

interface SendEmailRequest {
  email: string;
}

interface ConfirmEmailRequest {
  email: string;
  otp: string;
}

interface ResetPasswordRequest {
  id: string;
  password: string;
}

interface UpdateAccountRequest {
  id: string;
  username: string;
  email: string;
  role: string;
  banK_ACCOUNT_NO: string;
  banK_ACCOUNT_NAME: string;
  banK_ID: string;
}

interface UploadImageRequest {
  id: string;
  file: File;
}

// Response interfaces
interface SimpleResponse {
  message: string;
}

interface AccountResponse {
  message: string;
  data: AccountData;
}

interface AccountsListResponse {
  message: string;
  data: AccountData[];
}

interface DeleteResponse {
  message: string;
  data: boolean;
}

interface ErrorResponse {
  error: number;
  message: string;
}

// Initial state
const initialState: AccountState = {
  loading: false,
  updating: false,
  searching: false,
  deleting: false,
  sendingOtp: false,
  confirmingOtp: false,
  resettingPassword: false,
  activating: false,
  uploadingImage: false,
  accounts: [],
  currentAccount: null,
  error: null,
  searchError: null,
  updateError: null,
  deleteError: null,
  otpError: null,
};

// ✅ 1. Forget Password
export const forgetPassword = createAsyncThunk<
  SimpleResponse,
  ForgetPasswordRequest,
  { rejectValue: ErrorResponse }
>("account/forgetPassword", async (data, { rejectWithValue }) => {
  try {
    const response = await api.patch("account/forget-password", data, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });

    console.log("✅ Forget Password Response:", response.data);

    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return response.data;
  } catch (err: any) {
    console.error("❌ Forget Password Error:", err.response?.data);

    if (err.response) {
      return rejectWithValue({
        error: err.response.status,
        message: err.response.data?.message || "Đổi mật khẩu thất bại",
      });
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 2. Send Email OTP
export const sendEmailOtp = createAsyncThunk<
  SimpleResponse,
  SendEmailRequest,
  { rejectValue: ErrorResponse }
>("account/sendEmailOtp", async (data, { rejectWithValue }) => {
  try {
    const response = await api.patch("account/send_email", data, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });

    console.log("✅ Send Email OTP Response:", response.data);

    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return response.data;
  } catch (err: any) {
    console.error("❌ Send Email OTP Error:", err.response?.data);

    if (err.response) {
      return rejectWithValue({
        error: err.response.status,
        message: err.response.data?.message || "Gửi OTP thất bại",
      });
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 3. Confirm Email OTP
export const confirmEmailOtp = createAsyncThunk<
  SimpleResponse,
  ConfirmEmailRequest,
  { rejectValue: ErrorResponse }
>("account/confirmEmailOtp", async (data, { rejectWithValue }) => {
  try {
    const response = await api.patch("account/confirm_email", data, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });

    console.log("✅ Confirm Email OTP Response:", response.data);

    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return response.data;
  } catch (err: any) {
    console.error("❌ Confirm Email OTP Error:", err.response?.data);

    if (err.response) {
      return rejectWithValue({
        error: err.response.status,
        message: err.response.data?.message || "Xác nhận OTP thất bại",
      });
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 4. Reset Password
export const resetPassword = createAsyncThunk<
  SimpleResponse,
  ResetPasswordRequest,
  { rejectValue: ErrorResponse }
>("account/resetPassword", async (data, { rejectWithValue }) => {
  try {
    const response = await api.patch(`account/reset-password/${data.id}`, {
      password: data.password
    }, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });

    console.log("✅ Reset Password Response:", response.data);

    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return response.data;
  } catch (err: any) {
    console.error("❌ Reset Password Error:", err.response?.data);

    if (err.response) {
      return rejectWithValue({
        error: err.response.status,
        message: err.response.data?.message || "Reset mật khẩu thất bại",
      });
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 5. Activate Account
export const activateAccount = createAsyncThunk<
  SimpleResponse,
  string, // account_id
  { rejectValue: ErrorResponse }
>("account/activate", async (accountId, { rejectWithValue }) => {
  try {
    const response = await api.patch(`account/activate/${accountId}`, {}, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Activate Account Response:", response.data);

    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return response.data;
  } catch (err: any) {
    console.error("❌ Activate Account Error:", err.response?.data);

    if (err.response) {
      return rejectWithValue({
        error: err.response.status,
        message: err.response.data?.message || "Kích hoạt tài khoản thất bại",
      });
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 6. Upload Image
export const uploadImage = createAsyncThunk<
  AccountResponse,
  UploadImageRequest,
  { rejectValue: ErrorResponse }
>("account/uploadImage", async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("file", data.file);

    const response = await api.patch(`account/img_url/${data.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "*/*",
      },
    });

    console.log("✅ Upload Image Response:", response.data);

    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return response.data;
  } catch (err: any) {
    console.error("❌ Upload Image Error:", err.response?.data);

    if (err.response) {
      return rejectWithValue({
        error: err.response.status,
        message: err.response.data?.message || "Upload ảnh thất bại",
      });
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 7. Update Account
export const updateAccount = createAsyncThunk<
  AccountResponse,
  UpdateAccountRequest,
  { rejectValue: ErrorResponse }
>("account/update", async (data, { rejectWithValue }) => {
  try {
    const { id, ...updateData } = data;
    
    const response = await api.patch(`account/update-account/${id}`, updateData, {
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
    });

    console.log("✅ Update Account Response:", response.data);

    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return response.data;
  } catch (err: any) {
    console.error("❌ Update Account Error:", err.response?.data);

    if (err.response) {
      return rejectWithValue({
        error: err.response.status,
        message: err.response.data?.message || "Cập nhật tài khoản thất bại",
      });
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 8. Get All Accounts
export const getAllAccounts = createAsyncThunk<
  AccountsListResponse,
  void,
  { rejectValue: ErrorResponse }
>("account/getAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("account/get-all", {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Get All Accounts Response:", response.data);

    if (!Array.isArray(response.data.data)) {
      return rejectWithValue({
        error: 1,
        message: "Định dạng dữ liệu từ server không hợp lệ",
      });
    }

    return response.data;
  } catch (err: any) {
    console.error("❌ Get All Accounts Error:", err.response?.data);

    if (err.response) {
      return rejectWithValue({
        error: err.response.status,
        message: err.response.data?.message || "Lấy danh sách tài khoản thất bại",
      });
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 9. Get Account By ID
export const getAccountById = createAsyncThunk<
  AccountResponse,
  string, // account_id
  { rejectValue: ErrorResponse }
>("account/getById", async (accountId, { rejectWithValue }) => {
  try {
    const response = await api.get(`account/id/${accountId}`, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Get Account By ID Response:", response.data);

    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return response.data;
  } catch (err: any) {
    console.error("❌ Get Account By ID Error:", err.response?.data);

    if (err.response) {
      return rejectWithValue({
        error: err.response.status,
        message: err.response.data?.message || "Lấy thông tin tài khoản thất bại",
      });
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// ✅ 10. Delete Account
export const deleteAccount = createAsyncThunk<
  DeleteResponse,
  string, // account_id
  { rejectValue: ErrorResponse }
>("account/delete", async (accountId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`account/delete-account/${accountId}`, {
      headers: {
        accept: "*/*",
      },
    });

    console.log("✅ Delete Account Response:", response.data);

    if (!response.data) {
      return rejectWithValue({
        error: 1,
        message: "Phản hồi từ server không hợp lệ",
      });
    }

    return response.data;
  } catch (err: any) {
    console.error("❌ Delete Account Error:", err.response?.data);

    if (err.response) {
      return rejectWithValue({
        error: err.response.status,
        message: err.response.data?.message || "Xóa tài khoản thất bại",
      });
    }

    return rejectWithValue({
      error: 1,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
});

// Account slice
const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    clearAccountError: (state) => {
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
    clearOtpError: (state) => {
      state.otpError = null;
    },
    clearAllAccountErrors: (state) => {
      state.error = null;
      state.searchError = null;
      state.updateError = null;
      state.deleteError = null;
      state.otpError = null;
    },
    resetAccountState: (state) => {
      Object.assign(state, initialState);
    },
    clearAccountsList: (state) => {
      state.accounts = [];
    },
    setCurrentAccount: (state, action: PayloadAction<AccountData | null>) => {
      state.currentAccount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Forget Password cases
      .addCase(forgetPassword.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(
        forgetPassword.fulfilled,
        (state, action: PayloadAction<SimpleResponse>) => {
          state.updating = false;
          state.updateError = null;
          console.log("✅ Forget password successful:", action.payload.message);
        }
      )
      .addCase(forgetPassword.rejected, (state, action) => {
        state.updating = false;
        if (action.payload) {
          state.updateError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.updateError = {
            code: 1,
            message: action.error.message || "Đổi mật khẩu thất bại",
          };
        }
      })

      // ✅ Send Email OTP cases
      .addCase(sendEmailOtp.pending, (state) => {
        state.sendingOtp = true;
        state.otpError = null;
      })
      .addCase(
        sendEmailOtp.fulfilled,
        (state, action: PayloadAction<SimpleResponse>) => {
          state.sendingOtp = false;
          state.otpError = null;
          console.log("✅ Send email OTP successful:", action.payload.message);
        }
      )
      .addCase(sendEmailOtp.rejected, (state, action) => {
        state.sendingOtp = false;
        if (action.payload) {
          state.otpError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.otpError = {
            code: 1,
            message: action.error.message || "Gửi OTP thất bại",
          };
        }
      })

      // ✅ Confirm Email OTP cases
      .addCase(confirmEmailOtp.pending, (state) => {
        state.confirmingOtp = true;
        state.otpError = null;
      })
      .addCase(
        confirmEmailOtp.fulfilled,
        (state, action: PayloadAction<SimpleResponse>) => {
          state.confirmingOtp = false;
          state.otpError = null;
          console.log("✅ Confirm email OTP successful:", action.payload.message);
        }
      )
      .addCase(confirmEmailOtp.rejected, (state, action) => {
        state.confirmingOtp = false;
        if (action.payload) {
          state.otpError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.otpError = {
            code: 1,
            message: action.error.message || "Xác nhận OTP thất bại",
          };
        }
      })

      // ✅ Reset Password cases
      .addCase(resetPassword.pending, (state) => {
        state.resettingPassword = true;
        state.updateError = null;
      })
      .addCase(
        resetPassword.fulfilled,
        (state, action: PayloadAction<SimpleResponse>) => {
          state.resettingPassword = false;
          state.updateError = null;
          console.log("✅ Reset password successful:", action.payload.message);
        }
      )
      .addCase(resetPassword.rejected, (state, action) => {
        state.resettingPassword = false;
        if (action.payload) {
          state.updateError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.updateError = {
            code: 1,
            message: action.error.message || "Reset mật khẩu thất bại",
          };
        }
      })

      // ✅ Activate Account cases
      .addCase(activateAccount.pending, (state) => {
        state.activating = true;
        state.updateError = null;
      })
      .addCase(
        activateAccount.fulfilled,
        (state, action: PayloadAction<SimpleResponse>) => {
          state.activating = false;
          state.updateError = null;
          console.log("✅ Activate account successful:", action.payload.message);
        }
      )
      .addCase(activateAccount.rejected, (state, action) => {
        state.activating = false;
        if (action.payload) {
          state.updateError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.updateError = {
            code: 1,
            message: action.error.message || "Kích hoạt tài khoản thất bại",
          };
        }
      })

      // ✅ Upload Image cases
      .addCase(uploadImage.pending, (state) => {
        state.uploadingImage = true;
        state.updateError = null;
      })
      .addCase(
        uploadImage.fulfilled,
        (state, action: PayloadAction<AccountResponse>) => {
          state.uploadingImage = false;
          state.currentAccount = action.payload.data;
          state.updateError = null;
          console.log("✅ Upload image successful:", action.payload.message);
        }
      )
      .addCase(uploadImage.rejected, (state, action) => {
        state.uploadingImage = false;
        if (action.payload) {
          state.updateError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.updateError = {
            code: 1,
            message: action.error.message || "Upload ảnh thất bại",
          };
        }
      })

      // ✅ Update Account cases
      .addCase(updateAccount.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(
        updateAccount.fulfilled,
        (state, action: PayloadAction<AccountResponse>) => {
          state.updating = false;
          state.currentAccount = action.payload.data;
          state.updateError = null;

          // Update trong accounts list nếu tồn tại
          const index = state.accounts.findIndex(
            account => account.id === action.payload.data.id
          );
          if (index !== -1) {
            state.accounts[index] = action.payload.data;
          }

          console.log("✅ Update account successful:", action.payload.message);
        }
      )
      .addCase(updateAccount.rejected, (state, action) => {
        state.updating = false;
        if (action.payload) {
          state.updateError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.updateError = {
            code: 1,
            message: action.error.message || "Cập nhật tài khoản thất bại",
          };
        }
      })

      // ✅ Get All Accounts cases
      .addCase(getAllAccounts.pending, (state) => {
        state.searching = true;
        state.searchError = null;
      })
      .addCase(
        getAllAccounts.fulfilled,
        (state, action: PayloadAction<AccountsListResponse>) => {
          state.searching = false;
          state.accounts = action.payload.data;
          state.searchError = null;
          console.log(`✅ Retrieved ${action.payload.data.length} accounts`);
        }
      )
      .addCase(getAllAccounts.rejected, (state, action) => {
        state.searching = false;
        if (action.payload) {
          state.searchError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.searchError = {
            code: 1,
            message: action.error.message || "Lấy danh sách tài khoản thất bại",
          };
        }
      })

      // ✅ Get Account By ID cases
      .addCase(getAccountById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAccountById.fulfilled,
        (state, action: PayloadAction<AccountResponse>) => {
          state.loading = false;
          state.currentAccount = action.payload.data;
          state.error = null;
          console.log("✅ Retrieved account:", action.payload.data.username);
        }
      )
      .addCase(getAccountById.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.error = {
            code: 1,
            message: action.error.message || "Lấy thông tin tài khoản thất bại",
          };
        }
      })

      // ✅ Delete Account cases
      .addCase(deleteAccount.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(
        deleteAccount.fulfilled,
        (state, action: PayloadAction<DeleteResponse>) => {
          state.deleting = false;
          state.deleteError = null;
          
          // Reset currentAccount nếu đã bị xóa
          if (state.currentAccount && action.meta.arg === state.currentAccount.id) {
            state.currentAccount = null;
          }

          console.log("✅ Delete account successful:", action.payload.message);
        }
      )
      .addCase(deleteAccount.rejected, (state, action) => {
        state.deleting = false;
        if (action.payload) {
          state.deleteError = {
            code: action.payload.error,
            message: action.payload.message,
          };
        } else {
          state.deleteError = {
            code: 1,
            message: action.error.message || "Xóa tài khoản thất bại",
          };
        }
      });
  },
});

export const {
  clearAccountError,
  clearSearchError,
  clearUpdateError,
  clearDeleteError,
  clearOtpError,
  clearAllAccountErrors,
  resetAccountState,
  clearAccountsList,
  setCurrentAccount,
} = accountSlice.actions;

export default accountSlice.reducer;