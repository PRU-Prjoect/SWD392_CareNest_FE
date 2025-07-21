import React, { useEffect, useRef, useState } from "react";

interface EnterOTPCodeProps {
  onClose: () => void;
}

const EnterOTPCode: React.FC<EnterOTPCodeProps> = ({ onClose }) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", ""]);
  const [countdown, setCountdown] = useState(56);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Xử lý thay đổi input OTP
  const handleOtpChange = (index: number, value: string) => {
    // Chỉ cho phép nhập số
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Tự động chuyển sang ô tiếp theo
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Xử lý phím Backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Xử lý paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 5);
    const newOtp = pastedData.split("").concat(Array(5).fill("")).slice(0, 5);
    setOtp(newOtp);

    // Focus vào ô cuối cùng có dữ liệu
    const lastFilledIndex = Math.min(pastedData.length - 1, 4);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  // Xử lý submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 5) {
      alert("Vui lòng nhập đầy đủ mã OTP!");
      return;
    }

    // TODO: Xử lý xác thực OTP
    alert(`Mã OTP đã nhập: ${otpCode}`);
    onClose();
  };

  // Gửi lại mã OTP
  const handleResendOTP = () => {
    setCountdown(56);
    setOtp(["", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    // TODO: Gọi API gửi lại OTP
    alert("Đã gửi lại mã OTP!");
  };

  // Format thời gian countdown
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
      {/* Nút đóng popup */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold text-xl"
        aria-label="Đóng"
      >
        ✕
      </button>

      <h3 className="text-xl font-semibold mb-2 text-center">Quên mật khẩu</h3>

      <p className="text-sm text-gray-600 mb-6 text-center">Nhập mã OTP</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 5 ô nhập OTP */}
        <div className="flex justify-center space-x-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-[#2A9D8F] focus:outline-none transition-colors"
              autoComplete="off"
            />
          ))}
        </div>

        {/* Nút xác nhận */}
        <button
          type="submit"
          className="w-full py-3 bg-[#2A9D8F] text-white rounded-lg hover:bg-[#228B7E] transition-colors font-medium"
        >
          Xác nhận
        </button>

        {/* Gửi lại mã OTP */}
        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-sm text-gray-600">
              Gửi lại mã sau ({formatTime(countdown)})
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOTP}
              className="text-sm text-[#2A9D8F] hover:underline font-medium"
            >
              Gửi lại mã OTP
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EnterOTPCode;
