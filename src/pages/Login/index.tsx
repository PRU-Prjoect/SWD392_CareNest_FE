// src/pages/Login/index.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useLoginForm } from "./hooks/useLoginForm";
import ForgotPassword from "./components/ForgotPassword";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const {
    formData,
    formErrors,
    showPassword,
    loading,
    error,
    isAuthenticated,
    handleInputChange,
    handleSubmit,
    setShowPassword,
  } = useLoginForm();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <div className="flex h-screen relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 right-6 p-2 rounded hover:bg-gray-200"
          aria-label="Trang chủ"
        >
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

        <div className="w-1/2 flex items-center justify-center bg-white">
          <div className="w-full max-w-md p-8 shadow-lg rounded-xl border">
            <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
            <p className="text-center text-gray-600 mb-6">
              Chào mừng bạn trở lại!
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Tên đăng nhập"
                  className={`w-full px-4 py-3 border rounded-md ${
                    formErrors.username ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  disabled={loading}
                />
                {formErrors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.username}
                  </p>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    className={`w-full px-4 py-3 border rounded-md ${
                      formErrors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    disabled={loading}
                  />
                  <span
                    className="absolute right-4 top-3 cursor-pointer text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </span>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-blue-600"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      handleInputChange("rememberMe", e.target.checked)
                    }
                    disabled={loading}
                  />
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

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 text-white rounded-md transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#2A9D8F] hover:bg-[#228B7E]"
                }`}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

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

        <div className="w-1/2 bg-[#E7F3F5] flex flex-col justify-center items-center">
          <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8 rounded-lg fixed-size">
            <img
              src="/public/image/Xanh_dương_pastel_Cầu_vồng_Chương_trình_Đọc_viết_Logo-removebg-preview 1.png"
              alt="Logo"
              className="w-full h-auto object-contain max-w-full"
            />
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
