// pages/shop/profile/ShopSecurity.tsx
import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { User, Mail, Lock } from "lucide-react";
import {
  getLoginAccount,
  sendEmailOtp,
  confirmEmailOtp,
  resetPassword,
} from "@/store/slices/accountSlice";

interface Account {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  img_url?: string;
}

const ShopSecurity: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const {
    currentAccount,
    loadingLogin,
    sendingOtp,
    confirmingOtp,
    resettingPassword,
    error: accountError,
  } = useAppSelector((state) => state.account);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // ✅ Fetch data khi component mount
  useEffect(() => {
    if (user?.id) {
      dispatch(getLoginAccount());
    }
  }, [dispatch, user?.id]);

  if (loadingLogin) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
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
                  value={currentAccount?.username || ""}
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
                  value={currentAccount?.email || ""}
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
                onClick={() => setShowPasswordModal(true)}
                className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-300 transition-all duration-200 font-medium"
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <PasswordChangeModal
          account={currentAccount}
          onClose={() => setShowPasswordModal(false)}
          sendingOtp={sendingOtp}
          confirmingOtp={confirmingOtp}
          resettingPassword={resettingPassword}
          error={accountError}
        />
      )}
    </div>
  );
};

// ✅ Password Change Modal Component (giống như trong code cũ)
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

export default ShopSecurity;
