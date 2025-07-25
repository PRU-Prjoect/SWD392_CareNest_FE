// pages/Home/components/ServiceList.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { getAllServices } from "../../../store/slices/serviceSlice";

interface Service {
  id: string;
  name: string;
  price?: number;
  Price?: number;
  img_url?: string;
  star: number;
  purchases: number;
}

const ServiceList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { services, searching } = useSelector((state: RootState) => state.service);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Fetch services when component mounts
    dispatch(getAllServices());
  }, [dispatch]);

  // Check if user is a customer
  const isCustomer = (): boolean => {
    return user?.role === 'customer';
  };

  // Handle booking action
  const handleBookService = (serviceId: string) => {
    if (!isAuthenticated) {
      // If not logged in, redirect to login page
      navigate("/login");
    } else if (isCustomer()) {
      // If logged in as a customer, navigate to service detail page
      navigate(`/app/services/${serviceId}`);
    } else {
      // If logged in as another role (like shop owner), show message or handle differently
      alert("Bạn cần tài khoản khách hàng để đặt dịch vụ");
    }
  };

  // Handle view details
  const handleViewDetails = (serviceId: string) => {
    navigate(`/app/services/${serviceId}`);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative pb-3 w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              MỘT SỐ DỊCH VỤ 🐾
            </h2>
            {/* Underline */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-400 h-3 bg-[#87A96B] rounded"></div>
          </div>
        </div>

        {/* Loading state */}
        {searching && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#87A96B]"></div>
            <span className="ml-2 text-gray-600">Đang tải dịch vụ...</span>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {services && services.length > 0 ? (
            services.slice(0, 6).map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={handleBookService}
                onViewDetails={handleViewDetails}
                isAuthenticated={isAuthenticated}
              />
            ))
          ) : !searching ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              Không có dịch vụ nào hiện tại
            </div>
          ) : null}
        </div>

        {/* View More Button */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="md"
            className="border-[#87A96B] text-[#87A96B] hover:bg-[#87A96B] hover:text-white"
            onClick={() => {
              const targetRoute = isAuthenticated ? '/app/services' : '/guest/services';
              navigate(targetRoute);
            }}
          >
            Xem thêm dịch vụ
          </Button>
        </div>
      </div>
    </section>
  );
};

// Service Card Component
interface ServiceCardProps {
  service: Service;
  onBook: (id: string) => void;
  onViewDetails: (id: string) => void;
  isAuthenticated: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  onBook, 
  onViewDetails,
  isAuthenticated 
}) => {
  // Format price
  const formatPrice = (price?: number) => {
    if (!price) return "Liên hệ";
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Use price or Price field (backend sometimes returns with capital P)
  const displayPrice = service.price || service.Price;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={service.img_url || ''}
          alt={service.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            // Fallback image
            (e.target as HTMLImageElement).src =
              "https://i.pinimg.com/736x/26/c7/35/26c7355fe46f62d84579857c6f8c4ea5.jpg";
          }}
          onClick={() => onViewDetails(service.id)}
        />
        {service.star > 0 && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
            <span className="text-yellow-500 text-sm">⭐</span>
            <span className="text-xs font-medium">{service.star.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 
          className="font-semibold text-gray-900 mb-2 group-hover:text-[#87A96B] transition-colors duration-200"
          onClick={() => onViewDetails(service.id)}
        >
          {service.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-[#87A96B]">
            {formatPrice(displayPrice)}
          </span>
          {service.purchases > 0 && (
            <span className="text-xs text-gray-500">
              ({service.purchases} lượt đặt)
            </span>
          )}
        </div>
        <div className="flex gap-2 mt-3">
          <Button 
            variant="primary" 
            size="sm" 
            className="flex-1"
            onClick={() => onBook(service.id)}
          >
            {isAuthenticated ? "Đặt ngay" : "Đăng nhập để đặt"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ServiceList; 