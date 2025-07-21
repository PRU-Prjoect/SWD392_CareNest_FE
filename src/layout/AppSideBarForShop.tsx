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
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="icon multi-color"
        >
          <path
            d="M21,9H3V6H21Zm0,11V13H3v7a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20Z"
            style={{ fill: "#b7b7b7", strokeWidth: 2 }}
          ></path>
          <path
            d="M20,21H4a1,1,0,0,1-1-1V4A1,1,0,0,1,4,3H20a1,1,0,0,1,1,1V20A1,1,0,0,1,20,21ZM3,9H21M15,9V21"
            style={{
              fill: "#ffffff",
              stroke: "rgb(0, 0, 0)",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
            }}
          ></path>
        </svg>
      ),
      label: "Dashboard",
      path: "/shop/dashboard",
    },
    {
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.58579 4.58579C5 5.17157 5 6.11438 5 8V17C5 18.8856 5 19.8284 5.58579 20.4142C6.17157 21 7.11438 21 9 21H15C16.8856 21 17.8284 21 18.4142 20.4142C19 19.8284 19 18.8856 19 17V8C19 6.11438 19 5.17157 18.4142 4.58579C17.8284 4 16.8856 4 15 4H9C7.11438 4 6.17157 4 5.58579 4.58579ZM9 8C8.44772 8 8 8.44772 8 9C8 9.55228 8.44772 10 9 10H15C15.5523 10 16 9.55228 16 9C16 8.44772 15.5523 8 15 8H9ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H15C15.5523 14 16 13.5523 16 13C16 12.4477 15.5523 12 15 12H9ZM9 16C8.44772 16 8 16.4477 8 17C8 17.5523 8.44772 18 9 18H13C13.5523 18 14 17.5523 14 17C14 16.4477 13.5523 16 13 16H9Z"
            fill="#ffffff"
          />
        </svg>
      ),
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
      icon: (
        <svg
          fill="#ffffff"
          width="32"
          height="32"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path d="m38.63 57.24a9.33 9.33 0 0 1 -.48 2.47l11.51 12.12a3.64 3.64 0 0 1 1 2.52 2.82 2.82 0 0 1 -1.1 2.46 4.08 4.08 0 0 1 -5.19-.13l-11.53-12.12a9.49 9.49 0 0 1 -2.5.35 9.68 9.68 0 0 1 -10.13-9.6 8.53 8.53 0 0 1 .48-2.47c0-.42.42-.41.83-.19l5.05 5.52a.77.77 0 0 0 1.24 0l3.62-3.43a1 1 0 0 0 0-1.45l-5.02-5.29c-.2-.21-.18-.83.23-.82a11.94 11.94 0 0 1 2.5-.35 9.26 9.26 0 0 1 9.49 10.41z" />
            <path d="m78.67 34.7a15.51 15.51 0 0 0 -3-5.74 13.63 13.63 0 0 0 -6.11-4.16 15.14 15.14 0 0 0 -3.89-.75 13.12 13.12 0 0 0 -5.88.9 15.58 15.58 0 0 0 -5.52 3.79c-.62.65-1.18 1.35-1.79 2l-.14-.18a20.11 20.11 0 0 0 -3.12-3.27 14.81 14.81 0 0 0 -4.28-2.49 13.56 13.56 0 0 0 -5.75-.78 14.49 14.49 0 0 0 -5.52 1.49 14 14 0 0 0 -6.53 6.89 18.63 18.63 0 0 0 -1.63 7.08 17.09 17.09 0 0 0 .27 3.72l.25-.05a16.11 16.11 0 0 1 3.07-.4h.19a13.28 13.28 0 0 1 13.4 14.7 8.42 8.42 0 0 1 -.09 1l10 10.55a7.67 7.67 0 0 1 2 3.92 106.59 106.59 0 0 0 11.36-9.43 67.92 67.92 0 0 0 7.48-8.33 37.33 37.33 0 0 0 4.08-6.71 20.19 20.19 0 0 0 1.85-6.45 19 19 0 0 0 -.7-7.3z" />
          </g>
        </svg>
      ),
      label: "Dịch vụ của tôi",
      path: "/shop/services",
    },
    {
      icon: (
        <svg
          fill="#ffffff"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2,7V21a1,1,0,0,0,1,1H13V6H3A1,1,0,0,0,2,7ZM5,9h5v2H5Zm0,4h5v2H5Zm0,4h5v2H5ZM22,3V21a1,1,0,0,1-1,1H15V4H10V3a1,1,0,0,1,1-1H21A1,1,0,0,1,22,3Z" />
        </svg>
      ),
      label: "Khách sạn của tôi",
      path: "/shop/hotels",
    },
    {
      icon: (
        <svg
          fill="#ffffff"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21.026,6.105a3.1,3.1,0,0,1-2.365,3.848A3.031,3.031,0,0,1,15.1,7.222l-.042-.5A3.03,3.03,0,0,1,12.041,10h-.082A3.03,3.03,0,0,1,8.94,6.719l-.031.375a3.121,3.121,0,0,1-2.83,2.9A3.03,3.03,0,0,1,2.941,6.236l.87-3.479A1,1,0,0,1,4.781,2H19.219a1,1,0,0,1,.97.757ZM18.121,12A5.021,5.021,0,0,0,20,11.631V21a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V11.631a4.914,4.914,0,0,0,4.907-.683A5.131,5.131,0,0,0,12.042,12a5.027,5.027,0,0,0,3.051-1.052A4.977,4.977,0,0,0,18.121,12ZM14,17a2,2,0,0,0-4,0v3h4Z" />
        </svg>
      ),
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
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="#ffffff"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.8 2H14.2C11 2 9 4 9 7.2V11.25H15.25C15.66 11.25 16 11.59 16 12C16 12.41 15.66 12.75 15.25 12.75H9V16.8C9 20 11 22 14.2 22H16.79C19.99 22 21.99 20 21.99 16.8V7.2C22 4 20 2 16.8 2Z"
            fill="#ffffff"
          />
          <path
            d="M4.56141 11.2498L6.63141 9.17984C6.78141 9.02984 6.85141 8.83984 6.85141 8.64984C6.85141 8.45984 6.78141 8.25984 6.63141 8.11984C6.34141 7.82984 5.86141 7.82984 5.57141 8.11984L2.22141 11.4698C1.93141 11.7598 1.93141 12.2398 2.22141 12.5298L5.57141 15.8798C5.86141 16.1698 6.34141 16.1698 6.63141 15.8798C6.92141 15.5898 6.92141 15.1098 6.63141 14.8198L4.56141 12.7498H9.00141V11.2498H4.56141Z"
            fill="#ffffff"
          />
        </svg>
      ),
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
              className="h-10 w-auto md:h-12" // tăng chiều cao logo
            />
            <span className="text-3xl md:text-3xl font-extrabold">
              <span className="text-white">Care</span>
              <span className="text-orange-400">Nest</span>
            </span>
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
                  to={item.path || ''}
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
