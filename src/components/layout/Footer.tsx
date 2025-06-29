import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 py-8 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo CareNest */}
          <div className="flex items-center justify-center md:justify-start">
            <div className="text-3xl md:text-4xl font-bold">
              <span className="text-orange-400">Care</span>
              <span className="text-gray-600">Nest</span>
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-gray-600 text-sm">
            {/* Địa chỉ */}
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Đường D9, Khu Công nghệ cao TP.HCM</span>
            </div>
            {/* Số điện thoại */}
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>0-xxx-xxx-xxx/0-xxx-xxx-xxx</span>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <a href="#" className="text-gray-500 hover:text-orange-400">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  {/* Facebook icon */}
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-orange-400">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  {/* Instagram icon */}
                </svg>
              </a>
            </div>
            {/* Email */}
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>carenest@gmail.com</span>
            </div>
            {/* Website */}
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.148.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                  clipRule="evenodd"
                />
              </svg>
              <span>carenet.com</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
