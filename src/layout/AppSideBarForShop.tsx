import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const AppSidebarForShop = () => {
  const location = useLocation();
  const [isOrdersExpanded, setIsOrdersExpanded] = useState(false);
  const [isShopProfileExpanded, setIsShopProfileExpanded] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    {
      icon: "📊",
      label: "Dashboard",
      path: "/shop/dashboard",
    },
    {
      icon: "📋",
      label: "Đơn hàng",
      hasSubmenu: true,
      submenu: [
        {
          label: "Dịch vụ",
          path: "/shop/orders/services",
        },
        {
          label: "Khách sạn",
          path: "/shop/orders/hotels",
        },
      ],
    },
    {
      icon: "🛍️",
      label: "Dịch vụ của tôi",
      path: "/shop/services",
    },
    {
      icon: "🛍️",
      label: "Khách sạn của tôi",
      path: "/shop/hotels",
    },
    {
      icon: "🏪",
      label: "Thông tin cửa hàng",
      hasSubmenu: true,
      submenu: [
        {
          label: "Thông tin chung",
          path: "/shop/shop-profile/info",
        },
        {
          label: "Bảo mật",
          path: "/shop/shop-profile/security",
        },
        {
          label: "Chi nhánh",
          path: "/shop/shop-profile/branches",
        },
      ],
    },
    {
      icon: "👥",
      label: "Quản lý nhân viên",
      path: "/shop/employees",
    },
    {
      icon: "📤",
      label: "Đăng xuất",
      path: "/login",
    },
  ];

  const handleOrdersClick = () => {
    setIsOrdersExpanded(!isOrdersExpanded);
  };

  const handleShopProfileClick = () => {
    setIsShopProfileExpanded(!isShopProfileExpanded);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isOrdersActive = location.pathname.startsWith("/shop/orders");
  const isShopProfileActive =
    location.pathname.startsWith("/shop/shop-profile");

  return (
    <>
      {/* ✅ Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-teal-600 text-white rounded-md shadow-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* ✅ Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ✅ Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-teal-600 text-white min-h-screen
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <img
              src="/image/ranbowlogo.png"
              alt="CareNest Logo"
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold">CareNest</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="mt-8 pb-20">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.hasSubmenu ? (
                <>
                  {/* Main menu item with submenu */}
                  <div
                    onClick={
                      item.label === "Đơn hàng"
                        ? handleOrdersClick
                        : item.label === "Thông tin cửa hàng"
                        ? handleShopProfileClick
                        : undefined
                    }
                    className={`flex items-center justify-between px-6 py-3 hover:bg-teal-700 transition-colors cursor-pointer ${
                      (item.label === "Đơn hàng" && isOrdersActive) ||
                      (item.label === "Thông tin cửa hàng" &&
                        isShopProfileActive)
                        ? "bg-teal-700 border-r-4 border-[#f4c141]"
                        : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    <span
                      className={`transform transition-transform ${
                        (item.label === "Đơn hàng" && isOrdersExpanded) ||
                        (item.label === "Thông tin cửa hàng" &&
                          isShopProfileExpanded)
                          ? "rotate-90"
                          : ""
                      }`}
                    >
                      ▶
                    </span>
                  </div>

                  {/* Submenu */}
                  {((item.label === "Đơn hàng" && isOrdersExpanded) ||
                    (item.label === "Thông tin cửa hàng" &&
                      isShopProfileExpanded)) && (
                    <div className="bg-teal-700">
                      {item.submenu?.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          onClick={() => setIsSidebarOpen(false)}
                          className={`flex items-center space-x-3 px-12 py-2 hover:bg-teal-800 transition-colors text-sm ${
                            location.pathname === subItem.path
                              ? "bg-teal-800 border-r-4 border-[#f4c141]"
                              : ""
                          }`}
                        >
                          <span className="truncate">{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Regular menu items */
                <Link
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-6 py-3 hover:bg-teal-700 transition-colors ${
                    location.pathname === item.path ||
                    (item.path === "/shop/dashboard" &&
                      location.pathname === "/shop")
                      ? "bg-teal-700 border-r-4 border-[#f4c141]"
                      : ""
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AppSidebarForShop;
