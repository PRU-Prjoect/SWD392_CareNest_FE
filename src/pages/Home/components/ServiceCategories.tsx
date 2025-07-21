// pages/Home/components/ServiceCategories.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import ComponentCard from "../../../components/common/ComponentCard";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

interface ServiceCategory {
  id: number;
  name: string;
  icon: string;
  description?: string;
  path?: string;
}

const serviceCategories: ServiceCategory[] = [
  { id: 1, name: "Massage", icon: "💆" },
  { id: 2, name: "Grooming", icon: "✂️" },
  { id: 3, name: "Lưu trú", icon: "🏠", path: "hotel-services" },
  { id: 4, name: "Dịch vụ thú y", icon: "🏥" },
  { id: 5, name: "Huấn luyện", icon: "🎯" },
  { id: 6, name: "Chụp ảnh", icon: "📸" },
  { id: 7, name: "Tổ chức tiệc", icon: "🎉" },
  { id: 8, name: "Chăm sóc đặc biệt", icon: "⭐" },
];

const ServiceCategories: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleCategoryClick = (category: ServiceCategory) => {
    if (category.path) {
      // Base path depending on authentication status
      const basePath = isAuthenticated ? "/app/" : "/guest/";
      navigate(`${basePath}${category.path}`);
    } else {
      // Default to regular services page for other categories
      const servicesPath = isAuthenticated ? "/app/services" : "/guest/services";
      navigate(servicesPath);
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <ComponentCard
          title="Danh mục dịch vụ"
          className="border-0 shadow-none bg-transparent"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {serviceCategories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-[#2A9D8F] hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl mb-3 group-hover:bg-[#2A9D8F]/10 transition-colors duration-200">
                  {category.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 text-center group-hover:text-[#2A9D8F] transition-colors duration-200">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </ComponentCard>
      </div>
    </section>
  );
};

export default ServiceCategories;
