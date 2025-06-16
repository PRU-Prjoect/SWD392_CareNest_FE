import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const AppSidebarForShop = () => {
  const location = useLocation();
  const [isOrdersExpanded, setIsOrdersExpanded] = useState(false);

  const menuItems = [
    {
      icon: '📊',
      label: 'Dashboard',
      path: '/admin/dashboard',
    },
    {
      icon: '📋',
      label: 'Đơn hàng',
      hasSubmenu: true,
      submenu: [
        {
          label: 'Dịch vụ',
          path: '/admin/orders',
        },
        {
          label: 'Khách sạn',
          path: '/admin/hotels',
        },
      ],
    },
    {
      icon: '🛍️',
      label: 'Dịch vụ của tôi',
      path: '/admin/services',
    },
    {
      icon: '🏪',
      label: 'Thông tin cửa hàng',
      path: '/admin/shop-info',
    },
    {
      icon: '👥',
      label: 'Quản lý nhân viên',
      path: '/admin/employees',
    },
    {
      icon: '📤',
      label: 'Đăng xuất',
      path: '/login',
    },
  ];

  const handleOrdersClick = () => {
    setIsOrdersExpanded(!isOrdersExpanded);
  };

  const isOrdersActive = location.pathname.startsWith('/admin/orders');

  return (
    <aside className="w-64 bg-teal-600 text-white min-h-screen">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <img 
            src="/public/image/ranbowlogo.png" 
            alt="CareNest Logo" 
            className="h-8 w-auto"
          />
          <span className="text-xl font-bold">CareNest</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="mt-8">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.hasSubmenu ? (
              <>
                {/* Main menu item with submenu */}
                <div
                  onClick={handleOrdersClick}
                  className={`flex items-center justify-between px-6 py-3 hover:bg-teal-700 transition-colors cursor-pointer ${
                    isOrdersActive ? 'bg-teal-700 border-r-4 border-white' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <span className={`transform transition-transform ${isOrdersExpanded ? 'rotate-90' : ''}`}>
                    ▶
                  </span>
                </div>
                
                {/* Submenu */}
                {isOrdersExpanded && (
                  <div className="bg-teal-700">
                    {item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.path}
                        className={`flex items-center space-x-3 px-12 py-2 hover:bg-teal-800 transition-colors text-sm ${
                          location.pathname === subItem.path ? 'bg-teal-800 border-r-4 border-white' : ''
                        }`}
                      >
                        <span>{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* Regular menu items */
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-6 py-3 hover:bg-teal-700 transition-colors ${
                  location.pathname === item.path || 
                  (item.path === '/admin/dashboard' && location.pathname === '/admin') 
                    ? 'bg-teal-700 border-r-4 border-white' 
                    : ''
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AppSidebarForShop;
