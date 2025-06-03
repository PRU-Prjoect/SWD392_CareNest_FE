// File: src/pages/RegisterPage.tsx
import { useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Home,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    birthDate: "",
    gender: "",
  });

  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      birthDate: "",
      gender: "",
    };
    let valid = true;

    if (!username.trim()) {
      newErrors.username = "Tên người dùng không được để trống";
      valid = false;
    }
    if (!validateEmail(email)) {
      newErrors.email = "Email không hợp lệ";
      valid = false;
    }
    if (!validatePassword(password)) {
      newErrors.password = "Mật khẩu phải từ 6 ký tự, gồm chữ và số";
      valid = false;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      alert("Đăng ký thành công!");
      // TODO: gửi dữ liệu tới server tại đây
    }
  };

  return (
    <div className="min-h-screen flex bg-white relative">
      {/* Icon quay về trang homepage */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 right-4 text-[#2A9D8F] hover:text-[#2A9D8F]"
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
            {/* Ô nhập tên người dùng */}
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Họ và tên"
                className="w-full px-4 py-2 border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <User className="absolute top-2.5 right-3 w-5 h-5 text-gray-400" />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Ô nhập ngày sinh */}
            <div className="relative">
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder="Ngày sinh"
                className="w-full px-4 py-2 border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Calendar className="absolute top-2.5 right-3 w-5 h-5 text-gray-400" />
              {errors.birthDate && (
                <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
              )}
            </div>

            {/* Ô nhập giới tính */}
            <div className="relative">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2 border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-white"
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
              <ChevronDown className="absolute top-2.5 right-3 w-5 h-5 text-gray-400 pointer-events-none" />
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>

            {/* Ô nhập username */}
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tên người dùng"
                className="w-full px-4 py-2 border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <User className="absolute top-2.5 right-3 w-5 h-5 text-gray-400" />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Ô nhập email */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-2 border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Mail className="absolute top-2.5 right-3 w-5 h-5 text-gray-400" />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Ô nhập mật khẩu */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                className="w-full px-4 py-2 border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2.5 right-3 cursor-pointer text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Ô nhập xác nhận mật khẩu */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                className="w-full px-4 py-2 border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-2.5 right-3 cursor-pointer text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Nút đăng ký */}
            <button
              type="submit"
              className="w-full bg-[#2A9D8F] text-white py-2 rounded hover:bg-[#228B7E] transition"
            >
              Đăng ký
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Đã có tài khoản?{" "}
            <a
              href="/login"
              className="text-[#2A9D8F] font-semibold hover:underline"
            >
              Đăng nhập ngay!
            </a>
          </p>
        </div>
      </div>

      {/* Bên trái: Logo + mô tả */}
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
  );
}
