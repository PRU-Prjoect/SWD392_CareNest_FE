// src/components/common/SmartRedirect.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const SmartRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Tránh trường hợp điều hướng nhiều lần
    if (isRedirecting) return;

    // Kiểm tra thêm token trong localStorage để đảm bảo người dùng đã đăng nhập thực sự
    const token = localStorage.getItem("authToken");
    const userDataStr = localStorage.getItem("user");
    
    setIsRedirecting(true);
    
    // Chỉ điều hướng đến trang xác thực nếu cả Redux state và localStorage đều có dữ liệu xác thực
    if (isAuthenticated && user && token && userDataStr) {
      try {
        // Kiểm tra thêm dữ liệu người dùng từ localStorage
        const userData = JSON.parse(userDataStr);
        
        // Kiểm tra xem user role có khớp giữa Redux state và localStorage không
        if (userData.role === user.role) {
          console.log("✅ SmartRedirect: Điều hướng người dùng đã xác thực với role:", user.role);
          
          if (user.role === "Shop") {
            navigate("/shop/dashboard", { replace: true });
          } else {
            navigate("/app/home", { replace: true });
          }
          return;
        }
      } catch (e) {
        console.error("❌ SmartRedirect: Lỗi khi xử lý dữ liệu người dùng", e);
      }
    }
    
    // Nếu không có dữ liệu xác thực hợp lệ, chuyển hướng về trang khách
    console.log("✅ SmartRedirect: Điều hướng về trang khách");
    navigate("/guest/home", { replace: true });
  }, [isAuthenticated, user, navigate, isRedirecting]);

  // Hiển thị loading khi đang redirect
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2A9D8F] mx-auto"></div>
        <p className="mt-2 text-gray-600">Đang điều hướng...</p>
      </div>
    </div>
  );
};

export default SmartRedirect;
