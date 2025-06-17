// pages/Profile/components/EnterOTPForChangePassword.tsx
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import {
  confirmEmailOtp,
  resetPassword,
  clearAllAccountErrors,
} from "@/store/slices/AccountSlice";
import { toast } from "react-toastify";

interface EnterOTPForChangePasswordProps {
  email: string;
  onClose: () => void;
  onBack: () => void;
}

const EnterOTPForChangePassword: React.FC<EnterOTPForChangePasswordProps> = ({
  email,
  onClose,
  onBack,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<"otp" | "password">("otp");
  const [accountId, setAccountId] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const { confirmingOtp, resettingPassword, otpError, updateError } =
    useSelector((state: RootState) => state.account);
  const { user } = useSelector((state: RootState) => state.auth);

  // Set account ID from logged in user
  useEffect(() => {
    if (user?.id) {
      setAccountId(user.id);
    }
  }, [user]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Vui lòng nhập đầy đủ mã OTP!");
      return;
    }

    try {
      const result = await dispatch(
        confirmEmailOtp({
          email,
          otp: otpCode,
        })
      );

      if (confirmEmailOtp.fulfilled.match(result)) {
        toast.success("Xác nhận OTP thành công!");
        setStep("password");
        dispatch(clearAllAccountErrors());
      }
    } catch (error) {
      toast.error("Xác nhận OTP thất bại!");
      console.error("Confirm OTP error:", error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    if (!accountId) {
      toast.error("Không tìm thấy thông tin tài khoản!");
      return;
    }

    try {
      const result = await dispatch(
        resetPassword({
          id: accountId,
          password: newPassword,
        })
      );

      if (resetPassword.fulfilled.match(result)) {
        toast.success("Đổi mật khẩu thành công!");
        onClose();
      }
    } catch (error) {
      toast.error("Đổi mật khẩu thất bại!");
      console.error("Reset password error:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
      {/* Nút đóng popup */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold"
        aria-label="Đóng"
      >
        ✕
      </button>

      {step === "otp" ? (
        <>
          <h3 className="text-xl font-semibold mb-4 text-center">
            Nhập mã OTP
          </h3>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Mã OTP đã được gửi đến email: <strong>{email}</strong>
          </p>

          {otpError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {otpError.message}
            </div>
          )}

          <form onSubmit={handleVerifyOTP} className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-[#2A9D8F]"
                  disabled={confirmingOtp}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                disabled={confirmingOtp}
              >
                Quay lại
              </button>
              <button
                type="submit"
                disabled={confirmingOtp}
                className="flex-1 py-3 bg-[#2A9D8F] text-white rounded-md hover:bg-[#228B7E] transition disabled:opacity-50"
              >
                {confirmingOtp ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xác nhận...
                  </>
                ) : (
                  "Xác nhận OTP"
                )}
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-4 text-center">
            Đặt mật khẩu mới
          </h3>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>

          {updateError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {updateError.message}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
                required
                minLength={6}
                disabled={resettingPassword}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
                required
                minLength={6}
                disabled={resettingPassword}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("otp")}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                disabled={resettingPassword}
              >
                Quay lại
              </button>
              <button
                type="submit"
                disabled={resettingPassword}
                className="flex-1 py-3 bg-[#2A9D8F] text-white rounded-md hover:bg-[#228B7E] transition disabled:opacity-50"
              >
                {resettingPassword ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang đổi mật khẩu...
                  </>
                ) : (
                  "Đổi mật khẩu"
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default EnterOTPForChangePassword;
