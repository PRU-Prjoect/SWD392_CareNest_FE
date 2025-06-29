// pages/Home/components/HeroBanner.tsx
import React from "react";

const HeroBanner: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-b from-green-50 to-white min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 bg-green-100 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-green-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-green-150 rounded-full opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Hero Image Section */}
          <div className="flex-1 relative order-2 lg:order-1">
            <div className="relative group">
              {/* Main Hero Image */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src="https://petcare.vn/wp-content/uploads/2023/06/untitled-46.jpg" // Thay bằng ảnh thực tế
                  alt="Chú chó vui vẻ được chăm sóc chuyên nghiệp"
                  className="w-full h-[400px] lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Image Overlay - Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                {/* Floating Pet Icons */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg animate-bounce">
                  <span className="text-2xl">🐕</span>
                </div>

                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg animate-pulse">
                  <span className="text-2xl">❤️</span>
                </div>
              </div>

              {/* Service Icons around image */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-500 text-white rounded-full p-4 shadow-xl">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm5.676,8.237-6,5.5a1,1,0,0,1-1.383-.03l-3-3a1,1,0,1,1,1.414-1.414l2.323,2.323,5.294-4.853a1,1,0,1,1,1.352,1.474Z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Content Section with Text Overlay Style */}
          <div className="flex-1 text-center lg:text-left order-1 lg:order-2">
            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-green-700">Tìm ngay</span>
              <br />
              <span className="text-gray-800">dịch vụ chăm sóc</span>
              <br />
              <span className="text-green-600 relative">
                tốt nhất
                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-yellow-300 opacity-30 -z-10"></div>
              </span>
              <br />
              <span className="text-orange-500">cho bé cưng</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg md:text-xl mb-6 text-gray-600 max-w-lg">
              Kết nối với các chuyên gia chăm sóc thú cưng uy tín, đảm bảo bé
              cưng của bạn luôn khỏe mạnh và vui vẻ
            </p>

            {/* Features List */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Dịch vụ tận nhà</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Chuyên gia kinh nghiệm</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Giá cả hợp lý</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* Primary CTA */}
              <button className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                <span>📅</span>
                <span>Đặt lịch ngay</span>
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Secondary CTA */}
              <button className="bg-white text-green-700 border-2 border-green-300 hover:border-green-500 hover:bg-green-50 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                <span>📞</span>
                <span>Tư vấn miễn phí</span>
              </button>
            </div>

            {/* Trust Indicator */}
            <div className="flex items-center justify-center lg:justify-start gap-4 mt-8 p-4 bg-white/60 backdrop-blur-sm rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="text-gray-700 font-medium">5/5</span>
                <span>Uy tín</span>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="text-gray-600">
                <span className="font-bold text-green-600">2000+</span>
                <span> khách hàng hài lòng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
