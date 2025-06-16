// src/components/common/SmartRedirect.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const SmartRedirect = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated && user) {
      // ✅ Điều hướng dựa trên role
      if (user.role === "Shop") {
        navigate("/shop/dashboard", { replace: true });
      } else {
        navigate("/app/home", { replace: true });
      }
    } else {
      // Chưa đăng nhập → redirect về guest
      navigate("/guest/home", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

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
