// pages/Home/components/HeroBanner.tsx
import React from "react";

const HeroBanner: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-[#2A9D8F] to-[#8518c4] text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Chăm sóc thú cưng <br />
          <span className="text-orange-300">chuyên nghiệp</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white/90">
          Tìm kiếm dịch vụ chăm sóc tốt nhất cho bé cưng của bạn
        </p>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200">
          Khám phá ngay
        </button>
      </div>
    </section>
  );
};

export default HeroBanner;
