import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterBar from "@/components/common/FilterBar";

// Mock data service
const mockServices = Array.from({ length: 12 }).map((_, idx) => ({
  id: idx + 1,
  name: "Cắt tỉa lông",
  price: 200000,
  sold: 143,
  location: "Hồ Chí Minh",
}));

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState(mockServices);
  const navigate = useNavigate();

  // Xử lý filter (hiện tại chỉ filter giả lập)
  const handleFilter = (filters: Record<string, string>) => {
    // TODO: Sau này fetch API với filters, hiện tại chỉ mock
    setServices(mockServices); // Giữ nguyên
  };

  // Khi click vào service
  const handleServiceClick = (id: number) => {
    navigate(`/service-detail/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <FilterBar onFilter={handleFilter} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => handleServiceClick(service.id)}
            className="cursor-pointer bg-white rounded-lg shadow p-4 flex flex-col items-center hover:shadow-lg transition"
          >
            <div className="w-full h-28 bg-gray-100 rounded mb-3"></div>
            <div className="text-center">
              <div className="font-medium text-gray-800">{service.name}</div>
              <div className="text-orange-600 font-semibold mt-1">
                {service.price.toLocaleString()} đ
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Đã bán: {service.sold} &nbsp;|&nbsp; {service.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
