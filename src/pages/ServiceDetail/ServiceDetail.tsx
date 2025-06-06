import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayoutForUser from "../../layout/AppLayoutForUser";
import ServiceImages from "./components/ServiceImages";
import ServiceInfo from "./components/ServiceInfo";
import ServiceActions from "./components/ServiceActions";
import type { Service } from "@/types/services";

const mockService: Service = {
  id: "1",
  name: "Cắt tỉa lông",
  images: [
    "/image/pet-grooming-1.jpg",
    "/image/pet-grooming-2.jpg",
    "/image/pet-grooming-3.jpg",
  ],
  rating: 5,
  reviewCount: 20,
  bookingCount: 100,
  category: "Grooming",
  originalPrice: 230000,
  currentPrice: 200000,
  discount: 15,
  petTypes: ["Thỏ", "Mèo", "Chó"],
  duration: 60,
  description: "Dịch vụ cắt tỉa lông chuyên nghiệp cho thú cưng...",
};

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call với mock data
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 giây để test

        // Giả lập tìm service theo id
        if (id === "1" || id) {
          // Accept any id for demo
          setService(mockService);
        } else {
          setError("Service không tồn tại");
        }
      } catch (err) {
        console.error("Error fetching service:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setLoading(false); // ✅ Luôn reset loading
      }
    };

    if (id) {
      fetchService();
    } else {
      setLoading(false);
      setError("Không có ID service");
    }
  }, [id]); // ✅ Dependency array đúng

  const handleAddToCart = () => {
    console.log("Added to cart:", service?.id);
  };

  const handleBookNow = () => {
    if (service?.id) {
      navigate(`/booking/${service.id}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <AppLayoutForUser>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin dịch vụ...</p>
          </div>
        </div>
      </AppLayoutForUser>
    );
  }

  // Error state
  if (error || !service) {
    return (
      <AppLayoutForUser>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {error || "Không tìm thấy dịch vụ"}
            </h2>
            <p className="text-gray-600 mb-4">
              Dịch vụ bạn tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <button
              onClick={() => navigate("/services")}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Quay lại danh sách dịch vụ
            </button>
          </div>
        </div>
      </AppLayoutForUser>
    );
  }

  // Success state
  return (
    <AppLayoutForUser>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <ServiceImages
                images={service.images}
                serviceName={service.name}
              />
            </div>
            <div className="space-y-6">
              <ServiceInfo service={service} />
              <ServiceActions
                onAddToCart={handleAddToCart}
                onBookNow={handleBookNow}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayoutForUser>
  );
};

export default ServiceDetail;
