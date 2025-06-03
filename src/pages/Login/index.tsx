import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "./components/ForgotPassword";
import { FiEye, FiEyeOff } from 'react-icons/fi';



export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <>
      <div className="flex h-screen relative">
        {/* Icon Home góc trên bên trái */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 right-6 p-2 rounded hover:bg-gray-200"
          aria-label="Trang chủ"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600"
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

        {/* Bên trái */}
        <div className="w-1/2 bg-blue-600 text-white flex flex-col justify-center items-center">
          <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center">
            <span className="text-6xl text-blue-600">🍅</span>
          </div>
          <p className="mt-6 text-lg">Page quản lý task</p>
        </div>

        {/* Bên phải */}
        <div className="w-1/2 flex items-center justify-center bg-white">
          <div className="w-full max-w-md p-8 shadow-lg rounded-xl border">
            <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
            <p className="text-center text-gray-600 mb-6">Chào mừng bạn trở lại!</p>

            <form className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  className="w-full px-4 py-3 border rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                
                <span
                  className="absolute right-4 top-3 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-600" />
                  Ghi nhớ mật khẩu?
                </label>
                <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Quên mật khẩu?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Đăng nhập
              </button>

              <p className="text-center text-sm mt-4">
                Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-blue-600 font-medium hover:underline"
              >
                Đăng ký ngay!
              </button>
              </p>
            </form>
          </div>
        </div>
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <ForgotPassword onClose={() => setShowForgotPassword(false)} />
        </div>
      )}
    </>
  );
}
