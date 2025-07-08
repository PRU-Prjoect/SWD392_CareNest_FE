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
    handleInputChange,
    handleSubmit,
    setShowPassword,
  } = useLoginForm();

  return (
    <>
      <div className="flex h-screen relative">
        <button
          onClick={() => navigate("/guest/home")}
          className="absolute top-6 right-6 p-2 rounded hover:bg-gray-200 hover:scale-110 transition-all duration-200 ease-in-out"
          aria-label="Trang chủ"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#2A9D8F]"
            fill="currentColor"
            viewBox="0 0 390.126 390.125"
          >
            <g>
              <g>
                <path
                  d="M132.64,177.859c31.162,0,56.508-34.014,56.508-75.834c0-41.817-25.347-75.841-56.508-75.841
          c-31.153,0-56.502,34.023-56.502,75.841C76.138,143.845,101.487,177.859,132.64,177.859z"
                />
                <path
                  d="M300.246,251.628c-1.159-1.579-2.27-3.068-2.864-4.348c-12.635-27.046-47.27-58.931-103.382-59.724l-2.159-0.012
          c-55.25,0-89.627,30.197-103.381,58.469c-0.475,0.967-1.52,2.222-2.627,3.549c-1.31,1.555-2.606,3.146-3.714,4.875
          c-11.619,18.075-17.543,38.426-16.669,57.299c0.916,20.037,9.305,36.131,23.581,45.312c5.768,3.705,11.992,5.572,18.522,5.572
          c13.465,0,25.793-7.584,40.079-16.368c9.083-5.598,18.465-11.374,28.886-15.697c1.168-0.385,5.954-0.973,13.781-0.973
          c9.307,0,15.991,0.828,17.419,1.321c10.173,4.491,19.107,10.382,27.748,16.068c13.247,8.731,25.755,16.97,39.326,16.97
          c5.824,0,11.469-1.537,16.795-4.563c29.382-16.693,34.979-62.492,12.484-102.088C302.942,255.303,301.597,253.448,300.246,251.628
          z"
                />
                <path
                  d="M252.796,177.859c31.147,0,56.499-34.014,56.499-75.834c0-41.817-25.352-75.841-56.499-75.841
          c-31.165,0-56.511,34.023-56.511,75.841C196.285,143.845,221.631,177.859,252.796,177.859z"
                />
                <path
                  d="M345.595,138.918c-24.975,0-44.521,25.901-44.521,58.967c0,33.051,19.558,58.955,44.521,58.955
          c24.961,0,44.531-25.904,44.531-58.955C390.126,164.82,370.568,138.918,345.595,138.918z"
                />
                <path
                  d="M89.048,197.885c0-33.065-19.558-58.967-44.522-58.967C19.561,138.918,0,164.82,0,197.885
          c0,33.051,19.561,58.955,44.526,58.955C69.491,256.84,89.048,230.936,89.048,197.885z"
                />
              </g>
            </g>
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
