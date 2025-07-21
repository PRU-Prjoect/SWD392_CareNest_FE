import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  User,
  Lock,
  MapPin,
  Building,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Clock,
  Shield,
} from "lucide-react";

// ✅ Import các actions từ slices
import { getLoginAccount } from "@/store/slices/AccountSlice";
import { getShopById, updateShop } from "@/store/slices/shopSlice";
import {
  searchSubAddresses,
  createSubAddress,
  updateSubAddress,
  deleteSubAddress,
} from "@/store/slices/subAddressSlice";
import {
  sendEmailOtp,
  confirmEmailOtp,
  resetPassword,
} from "@/store/slices/AccountSlice";

// ✅ Interfaces
interface Account {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  img_url?: string;
}

interface Shop {
  account_id: string;
  name: string;
  description: string;
  status: boolean;
  working_day: string[];
}

interface SubAddress {
  id: string;
  name: string;
  shop_id: string;
  phone: string | number;
  address_name: string;
  is_default: boolean;
}

const StoreProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<SubAddress | null>(null);

  // ✅ Lấy data từ Redux store
  const { user } = useAppSelector((state) => state.auth);
  const {
    currentAccount,
    loadingLogin,
    sendingOtp,
    confirmingOtp,
    resettingPassword,
    error: accountError,
  } = useAppSelector((state) => state.account);
  const {
    currentShop,
    loading: shopLoading,
    updating: shopUpdating,
    error: shopError,
  } = useAppSelector((state) => state.shop);
  const {
    subAddresses,
    loading: subAddressLoading,
    creating: subAddressCreating,
    updating: subAddressUpdating,
    deleting: subAddressDeleting,
    error: subAddressError,
  } = useAppSelector((state) => state.subAddress);

  // ✅ Fetch data khi component mount
  useEffect(() => {
    if (user?.id) {
      console.log("🚀 Fetching account and shop data for user:", user.id);
      dispatch(getLoginAccount());
      dispatch(getShopById(user.id));
      dispatch(searchSubAddresses({ shopId: user.id }));
    }
  }, [dispatch, user?.id]);

  // ✅ Handle cập nhật shop
  const handleUpdateShop = async (shopData: Partial<Shop>) => {
    if (!user?.id) return;

    try {
      await dispatch(
        updateShop({
          account_id: user.id,
          name: shopData.name || currentShop?.name || "",
          description: shopData.description || currentShop?.description || "",
          status: shopData.status ?? currentShop?.status ?? true,
          working_day: shopData.working_day || currentShop?.working_day || [],
        })
      ).unwrap();

      dispatch(getShopById(user.id));
    } catch (error) {
      console.error("Update shop failed:", error);
    }
  };

  // ✅ Handle CRUD chi nhánh
  const handleCreateBranch = async (
    branchData: Omit<SubAddress, "id" | "shop_id">
  ) => {
    if (!user?.id) return;

    try {
      await dispatch(
        createSubAddress({
          id: crypto.randomUUID(),
          shop_id: user.id,
          name: branchData.name,
          phone: branchData.phone.toString(),
          address_name: branchData.address_name,
          is_default: branchData.is_default,
        })
      ).unwrap();

      dispatch(searchSubAddresses({ shopId: user.id }));
    } catch (error) {
      console.error("Create branch failed:", error);
    }
  };

  const handleUpdateBranch = async (
    branchId: string,
    branchData: Omit<SubAddress, "id" | "shop_id">
  ) => {
    if (!user?.id) return;

    try {
      await dispatch(
        updateSubAddress({
          id: branchId,
          shop_id: user.id,
          name: branchData.name,
          phone: branchData.phone.toString(),
          address_name: branchData.address_name,
          is_default: branchData.is_default,
        })
      ).unwrap();

      dispatch(searchSubAddresses({ shopId: user.id }));
    } catch (error) {
      console.error("Update branch failed:", error);
    }
  };

  const handleDeleteBranch = async (branchId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa chi nhánh này?")) return;

    try {
      await dispatch(deleteSubAddress(branchId)).unwrap();
      if (user?.id) {
        dispatch(searchSubAddresses({ shopId: user.id }));
      }
    } catch (error) {
      console.error("Delete branch failed:", error);
    }
  };

  // ✅ Loading state
  if (loadingLogin || shopLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin cửa hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Header Section */}
      <div className="bg-gradient-to-r from-[#FF7D29] to-[#511D43]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
              {currentAccount?.img_url ? (
                <img
                  src={currentAccount.img_url}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <Building className="w-12 h-12 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {currentShop?.name || "Đang tải..."}
              </h1>
              <p className="text-teal-100 text-lg mb-3">
                @{currentAccount?.username || user?.username}
              </p>
              <div className="flex items-center space-x-4">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                    currentShop?.status
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {currentShop?.status ? "Hoạt động" : "Tạm dừng"}
                </span>
                <div className="flex items-center text-teal-100">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{currentAccount?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* ✅ Store Information Section */}
        <section id="store-info" className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
              <Building className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Thông tin cửa hàng
              </h2>
              <p className="text-gray-600">
                Quản lý thông tin cơ bản của cửa hàng
              </p>
            </div>
          </div>

          <StoreInfoSection
            shop={currentShop}
            account={
              currentAccount
                ? {
                    ...currentAccount,
                    img_url: currentAccount.img_url ?? undefined,
                  }
                : null
            }
            onUpdateShop={handleUpdateShop}
            updating={shopUpdating}
            error={shopError}
          />
        </section>

        {/* ✅ Security Section */}
        <section id="security" className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Bảo mật tài khoản
              </h2>
              <p className="text-gray-600">Quản lý mật khẩu và bảo mật</p>
            </div>
          </div>

          <SecuritySection
            account={
              currentAccount
                ? {
                    ...currentAccount,
                    img_url: currentAccount.img_url ?? undefined,
                  }
                : null
            }
            onChangePassword={() => setShowPasswordModal(true)}
          />
        </section>

        {/* ✅ Branches Section */}
        <section id="branches" className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Quản lý chi nhánh
                </h2>
                <p className="text-gray-600">
                  Thêm và quản lý các chi nhánh của cửa hàng
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingBranch(null);
                setShowBranchModal(true);
              }}
              disabled={subAddressCreating}
              className="flex items-center space-x-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-300 transition-all duration-200 font-medium disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              <span>
                {subAddressCreating ? "Đang thêm..." : "Thêm chi nhánh"}
              </span>
            </button>
          </div>

          <BranchesSection
            subAddresses={subAddresses}
            loading={subAddressLoading}
            updating={subAddressUpdating}
            deleting={subAddressDeleting}
            error={subAddressError}
            onEditBranch={(branch) => {
              setEditingBranch(branch);
              setShowBranchModal(true);
            }}
            onDeleteBranch={handleDeleteBranch}
          />
        </section>
      </div>

      {/* ✅ Modals */}
      {showPasswordModal && (
        <PasswordChangeModal
          account={
            currentAccount
              ? {
                  ...currentAccount,
                  img_url: currentAccount.img_url ?? undefined,
                }
              : null
          }
          onClose={() => setShowPasswordModal(false)}
          sendingOtp={sendingOtp}
          confirmingOtp={confirmingOtp}
          resettingPassword={resettingPassword}
          error={accountError}
        />
      )}

      {showBranchModal && (
        <BranchModal
          branch={editingBranch}
          onClose={() => setShowBranchModal(false)}
          onSave={(branchData) => {
            if (editingBranch) {
              handleUpdateBranch(editingBranch.id, branchData);
            } else {
              handleCreateBranch(branchData);
            }
            setShowBranchModal(false);
          }}
          creating={subAddressCreating}
          updating={subAddressUpdating}
        />
      )}
    </div>
  );
};

// ✅ Store Information Component
interface StoreInfoSectionProps {
  shop: Shop | null;
  account: Account | null;
  onUpdateShop: (shop: Partial<Shop>) => void;
  updating: boolean;
  error: any;
}

const StoreInfoSection: React.FC<StoreInfoSectionProps> = ({
  shop,
  account,
  onUpdateShop,
  updating,
  error,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    working_day: [] as string[],
  });

  useEffect(() => {
    if (shop) {
      setFormData({
        name: shop.name,
        description: shop.description,
        working_day: shop.working_day || [],
      });
    }
  }, [shop]);

  const workingDaysOptions = [
    { key: "Monday", label: "Thứ 2" },
    { key: "Tuesday", label: "Thứ 3" },
    { key: "Wednesday", label: "Thứ 4" },
    { key: "Thursday", label: "Thứ 5" },
    { key: "Friday", label: "Thứ 6" },
    { key: "Saturday", label: "Thứ 7" },
    { key: "Sunday", label: "Chủ nhật" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateShop({
      name: formData.name,
      description: formData.description,
      working_day: formData.working_day,
      status: shop?.status ?? true,
    });
  };

  const toggleWorkingDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      working_day: prev.working_day.includes(day)
        ? prev.working_day.filter((d) => d !== day)
        : [...prev.working_day, day],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">Lỗi: {error.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tên cửa hàng *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-lg"
              required
              disabled={updating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Email (Không thể thay đổi)
            </label>
            <input
              type="email"
              value={account?.email || ""}
              disabled
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-500 text-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Mô tả cửa hàng
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Mô tả về cửa hàng của bạn..."
            disabled={updating}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          <Clock className="w-5 h-5 inline mr-2" />
          Ngày làm việc
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {workingDaysOptions.map(({ key, label }) => (
            <label
              key={key}
              className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                formData.working_day.includes(key)
                  ? "border-teal-500 bg-teal-50 text-teal-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-teal-300"
              }`}
            >
              <input
                type="checkbox"
                checked={formData.working_day.includes(key)}
                onChange={() => toggleWorkingDay(key)}
                className="sr-only"
                disabled={updating}
              />
              <span className="text-sm font-medium">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={updating}
          className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-300 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {updating ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
};

// ✅ Security Component
interface SecuritySectionProps {
  account: Account | null;
  onChangePassword: () => void;
}

const SecuritySection: React.FC<SecuritySectionProps> = ({
  account,
  onChangePassword,
}) => {
  return (
    <div className="space-y-8">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <Lock className="w-6 h-6 text-yellow-600" />
          <div>
            <h3 className="font-medium text-yellow-800 text-lg">
              Bảo mật tài khoản
            </h3>
            <p className="text-yellow-700 text-sm mt-1">
              Thường xuyên thay đổi mật khẩu để bảo vệ tài khoản của bạn
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tên đăng nhập (Không thể thay đổi)
            </label>
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={account?.username || ""}
                disabled
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-500 text-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Email (Không thể thay đổi)
            </label>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={account?.email || ""}
                disabled
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-500 text-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="border border-gray-200 rounded-xl p-8 w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-teal-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2 text-lg">
              Đổi mật khẩu
            </h4>
            <p className="text-gray-600 text-sm mb-6">
              Cập nhật mật khẩu của bạn để bảo mật tài khoản
            </p>
            <button
              onClick={onChangePassword}
              className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-300 transition-all duration-200 font-medium"
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Branches Component
interface BranchesSectionProps {
  subAddresses: SubAddress[];
  loading: boolean;
  updating: boolean;
  deleting: boolean;
  error: any;
  onEditBranch: (branch: SubAddress) => void;
  onDeleteBranch: (id: string) => void;
}

const BranchesSection: React.FC<BranchesSectionProps> = ({
  subAddresses,
  loading,
  updating,
  deleting,
  error,
  onEditBranch,
  onDeleteBranch,
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải danh sách chi nhánh...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">Lỗi: {error.message}</p>
        </div>
      )}

      {subAddresses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-12 h-12 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có chi nhánh nào
          </h3>
          <p className="text-gray-600">
            Hãy thêm chi nhánh đầu tiên của cửa hàng bạn
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subAddresses.map((branch) => (
            <div
              key={branch.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-white"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {branch.name}
                    </h4>
                    {branch.is_default && (
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                        Mặc định
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditBranch(branch)}
                    disabled={updating}
                    className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg disabled:opacity-50 transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteBranch(branch.id)}
                    disabled={deleting}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm leading-relaxed">
                    {branch.address_name}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">
                    {branch.phone}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ✅ Password Change Modal (giữ nguyên từ code cũ)
interface PasswordChangeModalProps {
  account: Account | null;
  onClose: () => void;
  sendingOtp: boolean;
  confirmingOtp: boolean;
  resettingPassword: boolean;
  error: any;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  account,
  onClose,
  sendingOtp,
  confirmingOtp,
  resettingPassword,
  error,
}) => {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [formData, setFormData] = useState({
    email: account?.email || "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push("Mật khẩu phải có ít nhất 8 ký tự");
    if (!/[A-Z]/.test(password))
      errors.push("Mật khẩu phải có ít nhất 1 chữ hoa");
    if (!/[a-z]/.test(password))
      errors.push("Mật khẩu phải có ít nhất 1 chữ thường");
    if (!/[0-9]/.test(password)) errors.push("Mật khẩu phải có ít nhất 1 số");
    return errors;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(sendEmailOtp({ email: formData.email })).unwrap();
      setStep("otp");
      setErrors([]);
    } catch (error: any) {
      setErrors([error.message || "Gửi OTP thất bại"]);
    }
  };

  const handleConfirmOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(
        confirmEmailOtp({
          email: formData.email,
          otp: formData.otp,
        })
      ).unwrap();
      setStep("password");
      setErrors([]);
    } catch (error: any) {
      setErrors([error.message || "Xác nhận OTP thất bại"]);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordErrors = validatePassword(formData.newPassword);
    if (passwordErrors.length > 0) {
      setErrors(passwordErrors);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors(["Mật khẩu xác nhận không khớp"]);
      return;
    }

    try {
      await dispatch(
        resetPassword({
          id: account?.id || "",
          password: formData.newPassword,
        })
      ).unwrap();

      setErrors([]);
      onClose();
      alert("Đổi mật khẩu thành công!");
    } catch (error: any) {
      setErrors([error.message || "Reset mật khẩu thất bại"]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Đổi mật khẩu
        </h2>

        {(errors.length > 0 || error) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <ul className="text-red-700 text-sm space-y-1">
              {errors.map((err, index) => (
                <li key={index}>• {err}</li>
              ))}
              {error && <li>• {error.message}</li>}
            </ul>
          </div>
        )}

        {step === "email" && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
                disabled={sendingOtp}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                disabled={sendingOtp}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-300 transition-all duration-200 font-medium disabled:opacity-50"
                disabled={sendingOtp}
              >
                {sendingOtp ? "Đang gửi..." : "Gửi OTP"}
              </button>
            </div>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleConfirmOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã OTP *
              </label>
              <input
                type="text"
                value={formData.otp}
                onChange={(e) =>
                  setFormData({ ...formData, otp: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Nhập mã OTP từ email"
                required
                disabled={confirmingOtp}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="px-6 py-3 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                disabled={confirmingOtp}
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-300 transition-all duration-200 font-medium disabled:opacity-50"
                disabled={confirmingOtp}
              >
                {confirmingOtp ? "Đang xác nhận..." : "Xác nhận OTP"}
              </button>
            </div>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới *
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
                disabled={resettingPassword}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
                disabled={resettingPassword}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                disabled={resettingPassword}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-300 transition-all duration-200 font-medium disabled:opacity-50"
                disabled={resettingPassword}
              >
                {resettingPassword ? "Đang cập nhật..." : "Đổi mật khẩu"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// ✅ Branch Modal (giữ nguyên từ code cũ)
interface BranchModalProps {
  branch: SubAddress | null;
  onClose: () => void;
  onSave: (data: Omit<SubAddress, "id" | "shop_id">) => void;
  creating: boolean;
  updating: boolean;
}

const BranchModal: React.FC<BranchModalProps> = ({
  branch,
  onClose,
  onSave,
  creating,
  updating,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address_name: "",
    is_default: false,
  });

  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name,
        phone: branch.phone.toString(),
        address_name: branch.address_name,
        is_default: branch.is_default,
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        address_name: "",
        is_default: false,
      });
    }
  }, [branch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      phone: formData.phone,
      address_name: formData.address_name,
      is_default: formData.is_default,
    });
  };

  const isLoading = creating || updating;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {branch ? "Chỉnh sửa chi nhánh" : "Thêm chi nhánh mới"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên chi nhánh *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="VD: Chi nhánh quận 1"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="0123456789"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ *
            </label>
            <textarea
              value={formData.address_name}
              onChange={(e) =>
                setFormData({ ...formData, address_name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 h-24 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Nhập địa chỉ chi tiết..."
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) =>
                  setFormData({ ...formData, is_default: e.target.checked })
                }
                className="w-5 h-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <span className="text-sm font-medium text-gray-700">
                Đặt làm chi nhánh mặc định
              </span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
              disabled={isLoading}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-300 transition-all duration-200 font-medium disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading
                ? branch
                  ? "Đang cập nhật..."
                  : "Đang thêm..."
                : branch
                ? "Cập nhật"
                : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoreProfile;
