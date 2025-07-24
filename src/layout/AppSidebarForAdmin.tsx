import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

const AppSidebarForAdmin: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  // Định nghĩa các mục menu
  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: "📊",
    },
    {
      path: "/admin/accounts",
      label: "Quản lý tài khoản",
      icon: "👥",
    },
    {
      path: "/admin/shops",
      label: "Quản lý cửa hàng",
      icon: "🏪",
    },
    {
      path: "/admin/services",
      label: "Quản lý dịch vụ",
      icon: "🧩",
    },
    {
      path: "/admin/reports",
      label: "Báo cáo",
      icon: "📝",
    },
    {
      path: "/admin/settings",
      label: "Cài đặt hệ thống",
      icon: "⚙️",
    },
  ];

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>

      <nav className="mt-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                    : ""
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}

          {/* Nút đăng xuất */}
          <li className="mt-8">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
            >
              <span className="mr-3">🚪</span>
              Đăng xuất
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AppSidebarForAdmin; 