import React, { useState } from 'react';
import '../../index.css';
import { Link } from 'react-router-dom';

const NavHome: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menuName: string) => {
    setOpenMenu(prev => (prev === menuName ? null : menuName));
  };

  return (
    <div className="relative bg-white">
      <nav className="mx-auto max-w-[90%] flex justify-between items-center px-6 py-4 relative z-50">
        {/* Logo bên trái */}
        <div className="text-5xl font-bold text-blue-600 select-none">Pomodoro</div>

        {/* Nút - chỉ hiện trên mobile */}
        <button
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
          onClick={() => toggleMenu('mobile')}
        >
          {openMenu === 'mobile' ? (
            // Icon X đóng menu
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-800"
              viewBox="0 0 24 24"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-800"
              viewBox="0 0 24 24"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>

        {/* Menu chính */}
        <ul
          className={`
            md:flex md:space-x-6 md:items-center
            ${openMenu === 'mobile' ? 'flex flex-col absolute top-full left-0 w-full bg-white shadow-md border-t' : 'hidden'}
            md:static md:w-auto md:shadow-none md:border-0
          `}
        >
          {/* Dropdown: Tính năng */}
          <li className="relative border-b md:border-0">
            <button
              onClick={() => toggleMenu('tinh-nang')}
              className="w-full flex justify-between items-center px-4 py-3 md:py-0 md:px-0 hover:underline text-lg md:inline-block"
            >
              Tính năng
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="inline ml-1"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                />
              </svg>
            </button>
            {openMenu === 'tinh-nang' && (
              <ul className="absolute md:absolute right-0 mt-5 w-48 bg-white shadow-lg border rounded md:py-1 md:space-y-1">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <a href="#" className="block w-full h-full">Pomodoro</a>
                 </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <a href="#" className="block w-full h-full">Báo cáo</a>
                 </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <a href="#" className="block w-full h-full">Lịch sử</a>
                 </li>
              </ul>
            )}
          </li>

          {/* Dropdown: Giải pháp */}
          <li className="relative border-b md:border-0">
            <button
              onClick={() => toggleMenu('giai-phap')}
              className="w-full flex justify-between items-center px-4 py-3 md:py-0 md:px-0 hover:underline text-lg md:inline-block"
            >
              Giải pháp
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="inline ml-1"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                />
              </svg>
            </button>
            {openMenu === 'giai-phap' && (
              <ul className="absolute md:absolute right-0 mt-5 w-48 bg-white shadow-lg border rounded md:py-1 md:space-y-1">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <a href="#" className="block w-full h-full">Cá nhân</a>
                 </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <a href="#" className="block w-full h-full">Đội nhóm</a>
                 </li>
              </ul>
            )}
          </li>

          {/* Dropdown: Gói */}
          <li className="relative border-b md:border-0">
            <button
              onClick={() => toggleMenu('goi')}
              className="w-full flex justify-between items-center px-4 py-3 md:py-0 md:px-0 hover:underline text-lg md:inline-block"
            >
              Gói
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="inline ml-1"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                />
              </svg>
            </button>
            {openMenu === 'goi' && (
              <ul className="absolute md:absolute right-0 mt-5 w-48 bg-white shadow-lg border rounded md:py-1 md:space-y-1">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <a href="#" className="block w-full h-full">Miễn phí</a>
                 </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <a href="#" className="block w-full h-full">Premium</a>
                 </li>

              </ul>
            )}
          </li>

          {/* Đăng nhập */}
          <li className="border-b md:border-0">
            <Link
                to="/login"
                className="block w-full text-left px-4 py-3 md:px-0 md:py-0 md:inline hover:underline text-lg"
              >
                Đăng nhập
            </Link>
          </li>
        </ul>
       <div className="hidden lg:block absolute bottom-0 right-0 w-[40vw] border-b border-blue-600 z-10"></div>
      </nav>
    </div>
  );
};

export default NavHome;
