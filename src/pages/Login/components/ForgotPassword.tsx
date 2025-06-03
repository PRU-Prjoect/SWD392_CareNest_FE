import React, { useState } from "react";
import EnterOTPCode from "./EnterOTPCode";

interface ForgotPasswordProps {
  onClose: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [enterOtpCode, setEnterOtpCode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra email có hợp lệ không
    if (!email.trim()) {
      alert("Vui lòng nhập email!");
      return;
    }

    // TODO: Xử lý gửi email khôi phục mật khẩu ở đây
    // Giả sử API call thành công

    // Hiển thị modal EnterOTPCode thay vì đóng modal hiện tại
    setEnterOtpCode(true);

    // Không gọi onClose() ở đây nữa
    // onClose(); // ← Xóa dòng này
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

        <h3 className="text-xl font-semibold mb-4 text-center">
          Quên mật khẩu
        </h3>
        <p className="text-x2 text-[#323333] mb-4 text-center">
          Vui lòng nhập email của bạn
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Trường nhập email */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email của bạn"
              className="w-full px-4 py-2 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Nút submit */}
          <button
            type="submit"
            className="w-full py-3 bg-[#2A9D8F] text-white rounded-md hover:bg-[#228B7E] transition"
          >
            Gửi mã OTP
          </button>
        </form>
      </div>

      {/* Modal nhập mã OTP */}
      {enterOtpCode && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <EnterOTPCode
            onClose={() => {
              setEnterOtpCode(false);
              onClose(); // Đóng cả modal ForgotPassword khi đóng EnterOTPCode
            }}
          />
        </div>
      )}
    </>
  );
};

export default ForgotPassword;
