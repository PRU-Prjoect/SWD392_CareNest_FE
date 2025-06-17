// pages/Profile/index.tsx
import { useEffect, useState, useRef } from "react";
import {
  User,
  Mail,
  Calendar,
  Save,
  Lock,
  Edit,
  Camera,
  Upload,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import {
  getCustomerById,
  updateCustomer,
  clearAllCustomerErrors,
} from "@/store/slices/customerSlice";
import { updateAuthUser } from "@/store/slices/authSlice";
import {
  uploadImage,
  getAccountById, // ✅ Import getAccountById
  clearAllAccountErrors,
} from "@/store/slices/AccountSlice"; // ✅ Import uploadImage từ accountSlice
import { toast } from "react-toastify";
import ChangePasswordModal from "../../components/ChangePasswordModal";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    currentCustomer,
    loading: customerLoading,
    updating,
    updateError,
  } = useSelector((state: RootState) => state.customer);
  const {
    currentAccount, // ✅ Lấy account data
    loading: accountLoading,
    uploadingImage,
    updateError: imageUploadError,
  } = useSelector((state: RootState) => state.account);

  // Form states cho customer info
  const [customerFormData, setCustomerFormData] = useState({
    full_name: "",
    gender: "",
    birthday: "",
  });

  // ✅ States cho upload image
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UI states
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [errors, setErrors] = useState({
    full_name: "",
    gender: "",
    birthday: "",
  });

  // ✅ Load cả customer profile và account data
  useEffect(() => {
    if (user?.id) {
      // Fetch customer data
      dispatch(getCustomerById(user.id));
      // ✅ Fetch account data để lấy img_url mới nhất
      dispatch(getAccountById(user.id));
    }
  }, [dispatch, user?.id]);

  // ✅ Update auth state khi có account data mới
  useEffect(() => {
    if (currentAccount && user) {
      // So sánh và update img_url nếu khác
      if (currentAccount.img_url !== user.img_url) {
        dispatch(
          updateAuthUser({
            img_url: currentAccount.img_url ?? undefined,
            img_url_id: currentAccount.img_url_id ?? undefined,
          })
        );
        console.log("✅ Updated auth user img_url:", currentAccount.img_url);
      }
    }
  }, [currentAccount, user, dispatch]);

  // Sync form data với customer profile từ API
  useEffect(() => {
    if (currentCustomer) {
      setCustomerFormData({
        full_name: currentCustomer.full_name || "",
        gender: currentCustomer.gender || "",
        birthday: currentCustomer.birthday
          ? currentCustomer.birthday.split("T")[0]
          : "",
      });
    }
  }, [currentCustomer]);

  // Handle errors
  useEffect(() => {
    if (updateError) {
      toast.error(updateError.message);
      dispatch(clearAllCustomerErrors());
    }
  }, [updateError, dispatch]);

  useEffect(() => {
    if (imageUploadError) {
      toast.error(imageUploadError.message);
      dispatch(clearAllAccountErrors());
    }
  }, [imageUploadError, dispatch]);

  // ✅ Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)");
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Kích thước file không được vượt quá 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setShowImageUpload(true);
  };

  // ✅ Handle image upload
  const handleImageUpload = async () => {
    if (!selectedFile || !user?.id) {
      toast.error("Vui lòng chọn ảnh và đảm bảo đã đăng nhập");
      return;
    }

    try {
      const result = await dispatch(
        uploadImage({
          id: user.id,
          file: selectedFile,
        })
      );

      if (uploadImage.fulfilled.match(result)) {
        toast.success("Cập nhật ảnh đại diện thành công!");

        // ✅ Update auth state với img_url mới
        const updatedAccount = result.payload.data;
        dispatch(
          updateAuthUser({
            img_url: updatedAccount.img_url ?? undefined,
            img_url_id: updatedAccount.img_url_id ?? undefined,
          })
        );

        const updatedUser = result.payload.data;

        // ✅ Update cả auth state và local state
        dispatch(
          updateAuthUser({
            img_url: updatedUser.img_url ?? undefined,
            img_url_id: updatedUser.img_url_id ?? undefined,
          })
        );

        // ✅ Update local state để hiển thị ngay

        setShowImageUpload(false);
        setSelectedFile(null);
        setPreviewUrl(null);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // ✅ Fetch account data lại để đảm bảo sync
        dispatch(getAccountById(user.id));

        console.log("✅ User avatar updated:", updatedAccount.img_url);
      }
    } catch (error) {
      console.error("❌ Upload image error:", error);
    }
  };

  // ✅ Cancel image upload
  const handleCancelImageUpload = () => {
    setShowImageUpload(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    return null;
  };

  // ✅ Get fallback letter
  const getFallbackLetter = () => {
    return (
      customerFormData.full_name?.charAt(0) || user?.username?.charAt(0) || "U"
    );
  };

  // ✅ Get current avatar URL (from account, user, or preview)
  const getCurrentAvatarUrl = () => {
    if (previewUrl) return previewUrl;
    if (currentAccount?.img_url) return currentAccount.img_url;
    if (user?.img_url) return user.img_url;
    return null;
  };

  // Rest of your existing functions (handleCustomerInputChange, validateCustomerForm, etc.)
  const handleCustomerInputChange = (
    field: keyof typeof customerFormData,
    value: string
  ) => {
    setCustomerFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error khi user typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateCustomerForm = () => {
    const newErrors = {
      full_name: "",
      gender: "",
      birthday: "",
    };
    let isValid = true;

    // Validate full name
    if (!customerFormData.full_name.trim()) {
      newErrors.full_name = "Họ tên không được để trống";
      isValid = false;
    } else if (customerFormData.full_name.trim().length < 2) {
      newErrors.full_name = "Họ tên phải có ít nhất 2 ký tự";
      isValid = false;
    }

    // Validate gender
    if (!customerFormData.gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
      isValid = false;
    }

    // Validate birthday
    if (!customerFormData.birthday) {
      newErrors.birthday = "Vui lòng chọn ngày sinh";
      isValid = false;
    } else {
      const birthDate = new Date(customerFormData.birthday);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 0 || age > 120) {
        newErrors.birthday = "Ngày sinh không hợp lệ";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveCustomerInfo = async () => {
    if (!user?.id) {
      toast.error("Không tìm thấy thông tin người dùng");
      return;
    }

    if (!validateCustomerForm()) {
      return;
    }

    try {
      const updateData = {
        account_id: user.id,
        full_name: customerFormData.full_name.trim(),
        gender: customerFormData.gender,
        birthday: new Date(customerFormData.birthday).toISOString(),
      };

      const result = await dispatch(updateCustomer(updateData));

      if (updateCustomer.fulfilled.match(result)) {
        toast.success("Cập nhật thông tin thành công!");
        setIsEditingCustomer(false);
        // Fetch lại data sau khi update
        dispatch(getCustomerById(user.id));
      }
    } catch (error) {
      console.error("❌ Update customer profile error:", error);
    }
  };

  const handleCancelCustomerEdit = () => {
    // Reset form về giá trị ban đầu
    if (currentCustomer) {
      setCustomerFormData({
        full_name: currentCustomer.full_name || "",
        gender: currentCustomer.gender || "",
        birthday: currentCustomer.birthday
          ? currentCustomer.birthday.split("T")[0]
          : "",
      });
    }
    setErrors({
      full_name: "",
      gender: "",
      birthday: "",
    });
    setIsEditingCustomer(false);
  };

  // ✅ Update loading condition
  if (customerLoading || accountLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A9D8F] mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Thông tin cá nhân
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Quản lý thông tin hồ sơ của bạn
                </p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ✅ Avatar với upload image - Updated */}
              <div className="md:col-span-2 flex items-center gap-6">
                <div className="relative">
                  {/* Avatar */}
                  <div className="w-24 h-24 bg-[#2A9D8F] rounded-full flex items-center justify-center overflow-hidden">
                    {getCurrentAvatarUrl() ? (
                      <img
                        src={getCurrentAvatarUrl()!}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to text avatar if image fails to load
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-white text-2xl font-bold">
                        {getFallbackLetter()}
                      </span>
                    )}
                  </div>

                  {/* Camera button overlay */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-[#f5b427] rounded-full flex items-center justify-center text-white hover:bg-[#c48909] transition-colors duration-200 shadow-lg"
                    title="Đổi ảnh đại diện"
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {customerFormData.full_name ||
                      user?.username ||
                      "Chưa có tên"}
                  </h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <p className="text-xs text-gray-400 mt-1">ID: {user?.id}</p>

                  {/* Upload status */}
                  {uploadingImage && (
                    <p className="text-xs text-[#2A9D8F] mt-2 flex items-center gap-1">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#2A9D8F]"></div>
                      Đang tải ảnh lên...
                    </p>
                  )}
                </div>
              </div>

              {/* ✅ Image Upload Preview Modal */}
              {showImageUpload && (
                <div className="md:col-span-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-900 mb-3 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Xem trước ảnh đại diện mới
                    </h3>
                    <div className="flex items-center gap-4">
                      {previewUrl && (
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-blue-700">
                          <strong>{selectedFile?.name}</strong>
                        </p>
                        <p className="text-xs text-blue-600">
                          Kích thước:{" "}
                          {selectedFile
                            ? (selectedFile.size / 1024 / 1024).toFixed(2)
                            : 0}{" "}
                          MB
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCancelImageUpload}
                          className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={handleImageUpload}
                          disabled={uploadingImage}
                          className="px-3 py-1 text-sm text-white bg-[#2A9D8F] rounded hover:bg-[#228B7E] transition-colors duration-200 disabled:opacity-50 flex items-center gap-1"
                        >
                          {uploadingImage ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              Đang tải...
                            </>
                          ) : (
                            <>
                              <Upload className="w-3 h-3" />
                              Tải lên
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Information Section - Giữ nguyên */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Thông tin khách hàng
                  </h2>
                  {!isEditingCustomer ? (
                    <button
                      onClick={() => setIsEditingCustomer(true)}
                      className="bg-[#2A9D8F] text-white px-4 py-2 rounded-lg hover:bg-[#228B7E] transition-colors duration-200 flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Chỉnh sửa
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={handleCancelCustomerEdit}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleSaveCustomerInfo}
                        disabled={updating}
                        className="bg-[#2A9D8F] text-white px-4 py-2 rounded-lg hover:bg-[#228B7E] transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {updating ? "Đang lưu..." : "Lưu"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Họ tên */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={customerFormData.full_name}
                      onChange={(e) =>
                        handleCustomerInputChange("full_name", e.target.value)
                      }
                      disabled={!isEditingCustomer}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] disabled:bg-gray-50 disabled:text-gray-500 ${
                        errors.full_name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Nhập họ và tên"
                    />
                    {errors.full_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.full_name}
                      </p>
                    )}
                  </div>

                  {/* Giới tính */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới tính
                    </label>
                    <select
                      value={customerFormData.gender}
                      onChange={(e) =>
                        handleCustomerInputChange("gender", e.target.value)
                      }
                      disabled={!isEditingCustomer}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] disabled:bg-gray-50 disabled:text-gray-500 ${
                        errors.gender ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.gender}
                      </p>
                    )}
                  </div>

                  {/* Ngày sinh */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      value={customerFormData.birthday}
                      onChange={(e) =>
                        handleCustomerInputChange("birthday", e.target.value)
                      }
                      disabled={!isEditingCustomer}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] disabled:bg-gray-50 disabled:text-gray-500 ${
                        errors.birthday ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.birthday && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.birthday}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Information Section */}
              <div className="md:col-span-2 border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Thông tin tài khoản
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email (readonly) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email không thể thay đổi
                    </p>
                  </div>

                  {/* Password (readonly with change button) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Mật khẩu
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="password"
                        value="••••••••"
                        disabled
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                      <button
                        onClick={() => setShowChangePasswordModal(true)}
                        className="px-4 py-2 bg-[#2A9D8F] text-white rounded-lg hover:bg-[#228B7E] transition-colors duration-200 text-sm"
                      >
                        Đổi mật khẩu
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <ChangePasswordModal
            userEmail={user?.email || ""}
            onClose={() => setShowChangePasswordModal(false)}
          />
        </div>
      )}
    </div>
  );
}
