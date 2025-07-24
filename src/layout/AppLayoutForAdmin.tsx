import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import AppHeaderForAdmin from "./AppHeaderForAdmin";
import AppSidebarForAdmin from "./AppSidebarForAdmin";

const AppLayoutForAdmin: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Kiểm tra quyền Admin - nếu không phải admin thì chuyển hướng
  if (user?.role !== "Admin") {
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