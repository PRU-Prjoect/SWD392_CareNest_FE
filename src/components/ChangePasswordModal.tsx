// pages/Profile/components/ChangePasswordModal.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { sendEmailOtp } from "@/store/slices/AccountSlice";
import { toast } from "react-toastify";
import EnterOTPForChangePassword from "./EnterOTPForChangePassword";

interface ChangePasswordModalProps {
  userEmail: string;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  userEmail,
  onClose,
}) => {
  const [email, setEmail] = useState(userEmail);
  const [enterOtpCode, setEnterOtpCode] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { sendingOtp, otpError } = useSelector(
    (state: RootState) => state.account
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Vui lòng nhập email!");
      return;
    }

    if (email !== userEmail) {
      toast.error("Email phải trùng với email tài khoản hiện tại!");
      return;
    }

    try {
      setLoading(true);
      const result = await dispatch(sendEmailOtp({ email }));

      if (sendEmailOtp.fulfilled.match(result)) {
        toast.success("Mã OTP đã được gửi đến email của bạn!");
        setEnterOtpCode(true);
      } else {
        toast.error("Gửi OTP thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi gửi OTP!");
      console.error("Send OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
        {/* Nút đóng popup */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold"
          aria-label="Đóng"
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold mb-4 text-center">Đổi mật khẩu</h3>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Nhập email để nhận mã OTP xác nhận đổi mật khẩu
        </p>

        {otpError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {otpError.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Trường nhập email */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email của bạn
            </label>
            <input
              type="email"
              placeholder="Email của bạn"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || sendingOtp}
            />
            <p className="text-xs text-gray-500 mt-1">
              Email phải trùng với email tài khoản hiện tại
            </p>
          </div>

          {/* Nút submit */}
          <button
            type="submit"
            disabled={loading || sendingOtp}
            className="w-full py-3 bg-[#2A9D8F] text-white rounded-md hover:bg-[#228B7E] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading || sendingOtp ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang gửi OTP...
              </>
            ) : (
              "Gửi mã OTP"
            )}
          </button>
        </form>
      </div>

      {/* Modal nhập mã OTP */}
      {enterOtpCode && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <EnterOTPForChangePassword
            email={email}
            onClose={() => {
              setEnterOtpCode(false);
              onClose(); // Đóng cả modal ChangePassword khi đóng EnterOTPForChangePassword
            }}
            onBack={() => setEnterOtpCode(false)}
          />
        </div>
      )}
    </>
  );
};

export default ChangePasswordModal;
