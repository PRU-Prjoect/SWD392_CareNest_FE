// pages/Register/index.tsx
import { useEffect, useState } from "react";
import { Eye, EyeOff, User, Mail, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { register, resetRegisterState } from "@/store/slices/registerSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Lấy state từ Redux store
  const { loading, success, error, accountData } = useSelector(
    // ✅ Thêm accountData
    (state: RootState) => state.register
  );

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      dispatch(resetRegisterState());
    };
  }, [dispatch]);

  // ✅ Cập nhật xử lý khi đăng ký thành công
  useEffect(() => {
    if (success && accountData) {
      toast.success(
        "Đăng ký tài khoản thành công! Tiếp tục tạo hồ sơ cá nhân."
      );

      // Truyền account data qua state navigation
      setTimeout(() => {
        navigate("/register-customer", {
          state: {
            accountData: accountData,
            fromRegister: true,
          },
        });
      }, 1500);
    }
  }, [success, accountData, navigate]);

  // Xử lý khi có lỗi từ server
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  };

  const validateForm = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    // Validate username
    if (!username.trim()) {
      newErrors.username = "Tên người dùng không được để trống";
      isValid = false;
    } else if (username.trim().length < 3) {
      newErrors.username = "Tên người dùng phải có ít nhất 3 ký tự";
      isValid = false;
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = "Email không được để trống";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }

    // Validate password
    if (!password) {
      newErrors.password = "Mật khẩu không được để trống";
      isValid = false;
    } else if (!validatePassword(password)) {
      newErrors.password = "Mật khẩu phải từ 6 ký tự, gồm chữ và số";
      isValid = false;
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form trước khi submit
    if (!validateForm()) {
      return;
    }

    // Gửi request đăng ký account
    const registerData = {
      username: username.trim(),
      email: email.trim(),
      password: password,
      confirmPassword: confirmPassword,
      role: "user", // Mặc định là user
    };

    try {
      const result = await dispatch(register(registerData));

      if (register.fulfilled.match(result)) {
        // Đăng ký thành công - useEffect sẽ xử lý navigation
        console.log("✅ Đăng ký thành công:", result.payload);
      } else if (register.rejected.match(result)) {
        // Lỗi từ server - useEffect sẽ hiển thị toast
        console.error("❌ Đăng ký thất bại:", result.payload);
      }
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      toast.error("Có lỗi không mong muốn xảy ra");
    }
  };

  return (
    <div className="min-h-screen flex bg-white relative">
      {/* Icon quay về trang homepage */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 right-4 text-[#2A9D8F] hover:text-[#228B7E] transition-colors duration-200 z-10"
        title="Quay lại trang chính"
      >
        <Home className="w-6 h-6" />
      </button>

      {/* Bên phải: Form đăng ký */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg border">
          <h2 className="text-2xl font-bold mb-2 text-center">Đăng ký</h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Tạo tài khoản mới để bắt đầu
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Ô nhập username */}
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tên người dùng"
                className={`w-full px-4 py-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.username
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:ring-[#2A9D8F]/20 focus:border-[#2A9D8F]"
                }`}
                disabled={loading}
              />
              <User className="absolute top-3.5 right-3 w-5 h-5 text-gray-400" />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Ô nhập email */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={`w-full px-4 py-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:ring-[#2A9D8F]/20 focus:border-[#2A9D8F]"
                }`}
                disabled={loading}
              />
              <Mail className="absolute top-3.5 right-3 w-5 h-5 text-gray-400" />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Ô nhập mật khẩu */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                className={`w-full px-4 py-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:ring-[#2A9D8F]/20 focus:border-[#2A9D8F]"
                }`}
                disabled={loading}
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3.5 right-3 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Ô nhập xác nhận mật khẩu */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                className={`w-full px-4 py-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:ring-[#2A9D8F]/20 focus:border-[#2A9D8F]"
                }`}
                disabled={loading}
              />
              <div
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-3.5 right-3 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Nút đăng ký */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#2A9D8F] hover:bg-[#228B7E] text-white shadow-md hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Đang tạo tài khoản...</span>
                </>
              ) : (
                <span>Tạo tài khoản</span>
              )}
            </button>
          </form>

          <p className="text-sm text-center mt-6">
            Đã có tài khoản?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#2A9D8F] font-semibold hover:underline transition-all duration-200"
            >
              Đăng nhập ngay!
            </button>
          </p>
        </div>
      </div>

      {/* Bên trái: Logo + mô tả */}
      <div className="w-1/2 bg-[#E7F3F5] flex flex-col justify-center items-center">
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8 rounded-lg">
          <img
            src="/public/image/Xanh_dương_pastel_Cầu_vồng_Chương_trình_Đọc_viết_Logo-removebg-preview 1.png"
            alt="Logo"
            className="w-full h-auto object-contain max-w-full"
          />
        </div>
      </div>
    </div>
  );
}
