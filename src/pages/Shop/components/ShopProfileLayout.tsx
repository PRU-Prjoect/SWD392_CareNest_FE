// components/shop/ShopProfileLayout.tsx
import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Building, Shield, MapPin } from "lucide-react";

const ShopProfileLayout: React.FC = () => {
  const location = useLocation();

  const tabs = [
    {
      key: "info",
      label: "Thông tin chung",
      icon: Building,
      path: "/shop/shop-profile/info",
    },
    {
      key: "security",
      label: "Bảo mật",
      icon: Shield,
      path: "/shop/shop-profile/security",
    },
    {
      key: "branches",
      label: "Chi nhánh",
      icon: MapPin,
      path: "/shop/shop-profile/branches",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Thông tin cửa hàng
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý thông tin cửa hàng của bạn
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-t-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map(({ key, label, icon: Icon, path }) => (
                <Link
                  key={key}
                  to={path}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    location.pathname === path
                      ? "border-teal-500 text-teal-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ShopProfileLayout;
