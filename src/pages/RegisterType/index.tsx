// File: src/pages/RegisterPage.tsx
import { User, Home, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-white relative">
      {/* Icon quay về trang homepage */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 right-4 text-[#2A9D8F] hover:text-[#228B7E] transition-colors duration-200"
        title="Quay lại trang chính"
      >
        <Home className="w-6 h-6" />
      </button>

      {/* Bên phải: Form đăng ký */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg border">
          <h2 className="text-2xl font-bold mb-2 text-center">Đăng ký</h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Chọn loại tài khoản mới để bắt đầu
          </p>

          <form className="space-y-4">
            {/* Nút Khách Hàng */}
            <button
              onClick={() => navigate("/register")}
              type="button"
              className="w-full bg-[#2A9D8F] text-white py-3 px-4 rounded-lg hover:bg-[#228B7E] transition-all duration-200 flex items-center justify-center space-x-3 font-medium shadow-md hover:shadow-lg"
            >
              <User className="w-5 h-5" />
              <span>Khách Hàng</span>
            </button>

            {/* Nút Cửa Hàng */}
            <button
              onClick={() => navigate("/registershop")}
              type="button"
              className="w-full bg-[#2A9D8F] text-white py-3 px-4 rounded-lg hover:bg-[#228B7E] transition-all duration-200 flex items-center justify-center space-x-3 font-medium shadow-md hover:shadow-lg"
            >
              <Store className="w-5 h-5" />
              <span>Cửa Hàng</span>
            </button>
          </form>

          <p className="text-sm text-center mt-6">
            <a
              href="/login"
              className="text-[#2A9D8F] font-semibold hover:underline transition-all duration-200"
            >
              Quay lại đăng nhập
            </a>
          </p>
        </div>
      </div>

      {/* Bên trái: Logo + mô tả */}
      <div className="w-1/2 bg-[#E7F3F5] flex flex-col justify-center items-center">
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8 rounded-lg">
          <img
            src="/public/image/ranbowlogo.png"
            alt="Logo"
            className="w-full h-auto object-contain max-w-full"
            style={{
              maxWidth: "100%",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              userSelect: "none",
              transform: "scale(1)",
              transformOrigin: "center center",
            }}
          />
        </div>
      </div>
    </div>
  );
}
