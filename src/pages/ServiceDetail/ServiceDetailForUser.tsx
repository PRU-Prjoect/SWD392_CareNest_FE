// pages/ServiceDetailForUser.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { getServiceById, clearServiceError } from "@/store/slices/serviceSlice";
import AppLayoutForUser from "../../layout/AppLayoutForUser";
import ServiceImages from "./components/ServiceImages";
import ServiceInfo from "./components/ServiceInfo";
import ServiceActions from "./components/ServiceActions";

const ServiceDetailForUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Redux state
  const { currentService, loading, error } = useSelector(
    (state: RootState) => state.service
  );

  // ✅ Fetch service by ID
  useEffect(() => {
    if (id) {
      dispatch(getServiceById(id));
    }
  }, [dispatch, id]);

  // ✅ Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearServiceError());
    };
  }, [dispatch]);

  // ✅ Handle add to cart
  const handleAddToCart = () => {
    if (currentService) {
      console.log("Added to cart:", currentService.id);
      // TODO: Implement add to cart logic
      // dispatch(addToCart(currentService));
    }
  };

  // ✅ Handle book now
  const handleBookNow = () => {
    if (currentService?.id) {
      navigate(`/app/booking/${currentService.id}`);
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
  if (error || !currentService) {
    return (
      <AppLayoutForUser>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {error?.message || "Không tìm thấy dịch vụ"}
            </h2>
            <p className="text-gray-600 mb-4">
              Dịch vụ bạn tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <button
              onClick={() => navigate("/app/services")}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Quay lại danh sách dịch vụ
            </button>
          </div>
        </div>
      </AppLayoutForUser>
    );
  }

  // ✅ Convert serviceSlice data to match component props
  const serviceForComponent = {
    id: currentService.id,
    name: currentService.name,
    images: [
      "/image/pet-grooming-1.jpg", // Default images
      "/image/pet-grooming-2.jpg",
      "/image/pet-grooming-3.jpg",
    ],
    rating: currentService.star,
    reviewCount: 20, // Mock data for now
    bookingCount: currentService.purchases,
    category: "Grooming", // Mock category
    originalPrice: currentService.price,
    currentPrice:
      currentService.discount_percent > 0
        ? (currentService.price * (100 - currentService.discount_percent)) / 100
        : currentService.price,
    discount: currentService.discount_percent,
    petTypes: ["Thỏ", "Mèo", "Chó"], // Mock pet types
    duration: currentService.duration_type || 60,
    description:
      currentService.description ||
      "Dịch vụ chăm sóc thú cưng chuyên nghiệp...",
  };

  // Success state
  return (
    <AppLayoutForUser>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ✅ Back button */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Quay lại</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <ServiceImages
                images={serviceForComponent.images}
                serviceName={serviceForComponent.name}
              />
            </div>
            <div className="space-y-6">
              <ServiceInfo service={serviceForComponent} />

              {/* ✅ Enhanced Service Actions với thêm nút */}
              <div className="space-y-4">
                <ServiceActions
                  onAddToCart={handleAddToCart}
                  onBookNow={handleBookNow}
                />

                {/* ✅ Additional info từ API */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Thông tin thêm
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Trạng thái:</span>
                      <span
                        className={`font-medium ${
                          currentService.is_active
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {currentService.is_active
                          ? "Đang hoạt động"
                          : "Tạm dừng"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Giới hạn/giờ:</span>
                      <span className="font-medium">
                        {currentService.limit_per_hour} khách
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đã bán:</span>
                      <span className="font-medium">
                        {currentService.purchases} lần
                      </span>
                    </div>
                  </div>
                </div>

                {/* ✅ Quick booking section */}
                <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                  <h3 className="font-semibold text-teal-900 mb-2">
                    Đặt lịch nhanh
                  </h3>
                  <p className="text-sm text-teal-700 mb-3">
                    Bạn có thể đặt lịch ngay hoặc thêm vào giỏ hàng để đặt sau.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 px-4 py-2 bg-white text-teal-700 border border-teal-300 rounded-lg hover:bg-teal-50 transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h1m-1-4h.01M16 19v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1h-2a1 1 0 00-1 1z"
                        />
                      </svg>
                      <span>Thêm vào giỏ</span>
                    </button>

                    <button
                      onClick={handleBookNow}
                      disabled={!currentService.is_active}
                      className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Đặt ngay</span>
                    </button>
                  </div>

                  {!currentService.is_active && (
                    <p className="text-sm text-red-600 mt-2">
                      Dịch vụ hiện tại đang tạm dừng, không thể đặt lịch.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayoutForUser>
  );
};

export default ServiceDetailForUser;
