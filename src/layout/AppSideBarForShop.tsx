import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AppSidebarForShop = () => {
  const location = useLocation();

  const menuItems = [
    {
      icon: '📊',
      label: 'Dashboard',
      path: '/carenest/admin/dashboard',
    },
    {
      icon: '📋',
      label: 'Đơn hàng',
      path: '/carenest/admin/orders',
    },
    {
      icon: '🛍️',
      label: 'Dịch vụ của tôi',
      path: '/carenest/admin/services',
    },
    {
      icon: '🏪',
      label: 'Thông tin cửa hàng',
      path: '/carenest/admin/shop-info',
    },
    {
      icon: '👥',
      label: 'Quản lý nhân viên',
      path: '/carenest/admin/employees',
    },
    {
      icon: '📤',
      label: 'Đăng xuất',
      path: '/logout',
    },
  ];

  return (
    <aside className="w-64 bg-teal-600 text-white min-h-screen">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🐾</span>
          <span className="text-xl font-bold">CareNest</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="mt-8">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center space-x-3 px-6 py-3 hover:bg-teal-700 transition-colors ${
              location.pathname === item.path ? 'bg-teal-700 border-r-4 border-white' : ''
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AppSidebarForShop;
