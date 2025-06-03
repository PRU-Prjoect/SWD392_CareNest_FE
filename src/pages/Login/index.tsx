import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "./components/ForgotPassword";
import { FiEye, FiEyeOff } from "react-icons/fi";

/**
 * Component Trang Đăng Nhập
 * Hiển thị trang đăng nhập với form email/mật khẩu và chức năng quên mật khẩu
 */
export default function LoginPage() {
  // Hook để điều hướng trang
  const navigate = useNavigate();

  // Quản lý trạng thái cho các trường form và điều khiển giao diện
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <>
      <div className="flex h-screen relative">
        {/* Nút về trang chủ ở góc phải trên */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 right-6 p-2 rounded hover:bg-gray-200"
          aria-label="Trang chủ"
        >
          {/* Biểu tượng ngôi nhà SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#2A9D8F]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 9.75L12 3l9 6.75v10.5a.75.75 0 01-.75.75h-5.25a.75.75 0 01-.75-.75v-5.25H9v5.25a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V9.75z"
            />
          </svg>
        </button>
        {/* Phần bên phải - Form đăng nhập */}
        <div className="w-1/2 flex items-center justify-center bg-white">
          <div className="w-full max-w-md p-8 shadow-lg rounded-xl border">
            {/* Tiêu đề form */}
            <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
            <p className="text-center   text-gray-600 mb-6">
              Chào mừng bạn trở lại!
            </p>

            {/* Form đăng nhập */}
            <form className="space-y-4">
              {/* Ô nhập email */}
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Ô nhập mật khẩu với nút ẩn/hiện */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  className="w-full px-4 py-3 border rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* Nút chuyển đổi ẩn/hiện mật khẩu */}
                <span
                  className="absolute right-4 top-3 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </span>
              </div>

              {/* Phần ghi nhớ mật khẩu và quên mật khẩu */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-600" />
                  Ghi nhớ mật khẩu?
                </label>
                <button
                  type="button"
                  className="text-[#2A9D8F] hover:underline"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Quên mật khẩu?
                </button>
              </div>

              {/* Nút đăng nhập */}
              <button
                type="submit"
                className="w-full py-3 bg-[#2A9D8F] text-white rounded-md hover:bg-[#228B7E] transition"
              >
                Đăng nhập
              </button>

              {/* Liên kết đăng ký */}
              <p className="text-center text-sm mt-4">
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/registertype")}
                  className="text-[#2A9D8F] font-medium hover:underline"
                >
                  Đăng ký ngay!
                </button>
              </p>
            </form>
          </div>
        </div>
        {/* Phần bên trái - Khu vực trang trí với logo */}
        <div className="w-1/2 bg-[#E7F3F5] flex flex-col justify-center items-center">
          <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8 rounded-lg fixed-size">
            <img
              src="/public/image/ranbowlogo.png"
              alt="Logo"
              className="w-full h-auto object-contain max-w-full"
              style={{
                maxWidth: "100%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                userSelect: "none", // Không cho phép chọn
                transform: "scale(1)",
                transformOrigin: "center center",
              }}
            />
          </div>
        </div>
      </div>

      {/* Modal quên mật khẩu */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <ForgotPassword onClose={() => setShowForgotPassword(false)} />
        </div>
      )}
    </>
  );
}
