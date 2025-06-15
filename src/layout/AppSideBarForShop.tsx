import { Link, useLocation } from 'react-router-dom';

const AppSidebarForShop = () => {
  const location = useLocation();

   const menuItems = [
   {
      icon: '📊',
      label: 'Dashboard',
      path: '/admin/dashboard',
    },
    {
      icon: '📋',
      label: 'Đơn hàng',
      path: '/admin/orders',
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
          <Link
            key={index}
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
        ))}
      </nav>
    </aside>
  );
};

export default AppSidebarForShop;
