import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface ForgotPasswordProps {
  onClose: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới và nhập lại không khớp");
      return;
    }
    alert("Thay đổi mật khẩu thành công!");
    onClose();
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
        {/* Nút đóng popup */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold"
          aria-label="Đóng"
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold mb-4 text-center">Quên mật khẩu</h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Mật khẩu cũ */}
          <div className="relative">
            <input
              type={showOldPassword ? "text" : "password"}
              placeholder="Mật khẩu cũ"
              className="w-full px-4 py-2 border rounded-md"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-4 top-2.5 cursor-pointer text-gray-600"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </span>
          </div>

          {/* Mật khẩu mới */}
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Mật khẩu mới"
              className="w-full px-4 py-2 border rounded-md"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-4 top-2.5 cursor-pointer text-gray-600"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </span>
          </div>

          {/* Nhập lại mật khẩu */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu mới"
              className="w-full px-4 py-2 border rounded-md"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-4 top-2.5 cursor-pointer text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </span>
          </div>

          {/* Nút submit */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Thay đổi mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
