// File: src/pages/RegisterPage.tsx
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    confirmPassword: ""
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
    const newErrors = { username: "", email: "", password: "", confirmPassword: "" };
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
        className="absolute top-4 right-4 text-blue-600 hover:text-blue-800"
        title="Quay lại trang chính"
      >
        <Home className="w-6 h-6" />
      </button>

      {/* Bên trái: Logo + mô tả */}
      <div className="w-1/2 bg-blue-600 hidden md:flex flex-col items-center justify-center text-white">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
          <img src="/tomato.png" alt="Logo" className="w-16 h-16" />
        </div>
        <p className="mt-4 text-lg">Page quản lý task</p>
      </div>

      {/* Bên phải: Form đăng ký */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg border">
          <h2 className="text-2xl font-bold mb-2 text-center">Đăng ký</h2>
          <p className="text-sm text-gray-600 mb-6 text-center">Tạo tài khoản mới để bắt đầu</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tên người dùng"
                className="w-full px-4 py-2 border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <User className="absolute top-2.5 right-3 w-5 h-5 text-gray-400" />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-2 border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Mail className="absolute top-2.5 right-3 w-5 h-5 text-gray-400" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

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
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

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
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Đăng ký
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Đã có tài khoản?{' '}
            <a href="#" className="text-blue-600 font-semibold hover:underline">Đăng nhập ngay!</a>
          </p>
        </div>
      </div>
    </div>
  );
}