// src/components/common/SmartRedirect.tsx
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const SmartRedirect: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    // Log để debug
    console.log("SmartRedirect - isAuthenticated:", isAuthenticated);
    console.log("SmartRedirect - user:", user);
  }, [isAuthenticated, user]);
  
  if (isAuthenticated) {
    // Kiểm tra vai trò và điều hướng phù hợp
    if (user?.role === "Admin") {
      // Nếu là Admin, chuyển hướng đến trang quản trị Admin
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user?.role === "Shop") {
      // Nếu là Shop Owner, chuyển hướng đến trang quản lý cửa hàng
      return <Navigate to="/shop/dashboard" replace />;
    } else {
      // Nếu là User thông thường, chuyển hướng đến trang chủ người dùng
      return <Navigate to="/app/home" replace />;
    }
  } else {
    // Nếu chưa đăng nhập, chuyển hướng đến trang chủ cho khách
    return <Navigate to="/guest/home" replace />;
  }
};

export default SmartRedirect;
