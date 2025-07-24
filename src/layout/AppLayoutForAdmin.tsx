import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import AppHeaderForAdmin from "./AppHeaderForAdmin";
import AppSidebarForAdmin from "./AppSidebarForAdmin";

const AppLayoutForAdmin: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Kiểm tra quyền Admin hoặc tài khoản đặc biệt
  const isSpecialAdmin = user?.username === 'admin' || user?.name === 'admin';
  const hasAdminRole = user?.role === 'Admin' || Number(user?.role) === 4;

  // Nếu không phải admin và không phải tài khoản đặc biệt thì chuyển hướng
  if (!isSpecialAdmin && !hasAdminRole) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <AppHeaderForAdmin />

      <div className="flex flex-1">
        {/* Sidebar */}
        <AppSidebarForAdmin />

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayoutForAdmin; 