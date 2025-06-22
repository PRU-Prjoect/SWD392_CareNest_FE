// pages/ServiceDetailPage.tsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { getServiceById, clearServiceError } from "@/store/slices/serviceSlice";

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Redux state
  const { currentService, loading, error } = useSelector(
    (state: RootState) => state.service
  );

  // ✅ Debug logs
  console.log("ServiceDetailPage rendered");
  console.log("Service ID:", id);
  console.log("Current service:", currentService);
  console.log("Loading:", loading);
  console.log("Error:", error);

  // ✅ Fetch service data
  useEffect(() => {
    if (id) {
      console.log("Fetching service with ID:", id);
      dispatch(getServiceById(id));
    }
  }, [dispatch, id]);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearServiceError());
    };
  }, [dispatch]);

  // ✅ Handle actions
  const handleBack = () => {
    navigate(-1);
  };

  const handleAddToCart = () => {
    if (currentService) {
      console.log("Add to cart:", currentService.id);
      alert(`Đã thêm "${currentService.name}" vào giỏ hàng!`);
      // TODO: Implement cart logic
    }
  };

  const handleBookNow = () => {
    if (currentService) {
      console.log("Book now:", currentService.id);
      // Navigate to booking page
      navigate(`/app/booking/${currentService.id}`);
    }
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Đang tải...</h2>
          <p className="text-gray-500 mt-2">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error || !currentService) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy dịch vụ
          </h2>
          <p className="text-gray-600 mb-6">
            {error?.message ||
              "Dịch vụ bạn tìm kiếm không tồn tại hoặc đã bị xóa."}
          </p>
          <div className="space-y-3">
            <button
              onClick={handleBack}
              className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Quay lại
            </button>
            <button
              onClick={() => navigate("/app/services")}
              className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Xem tất cả dịch vụ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Calculate discounted price
  const finalPrice =
    currentService.discount_percent > 0
      ? (currentService.price * (100 - currentService.discount_percent)) / 100
      : currentService.price;

  // ✅ Success state - Show service details
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBack}
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
              <span className="font-medium">Quay lại</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              Chi tiết dịch vụ
            </h1>
            <div className="w-20"></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Service image section */}
          <div className="h-64 md:h-80 bg-gradient-to-br from-teal-100 via-blue-100 to-purple-100 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-24 h-24 text-teal-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h4M7 15h10"
                />
              </svg>
              <p className="text-teal-700 font-semibold text-xl">
                {currentService.name}
              </p>
            </div>
          </div>

          {/* Service details */}
          <div className="p-6 md:p-8">
            {/* Header section */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentService.name}
                </h2>
                <div className="flex items-center space-x-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      currentService.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        currentService.is_active ? "bg-green-400" : "bg-red-400"
                      }`}
                    ></span>
                    {currentService.is_active ? "Đang hoạt động" : "Tạm dừng"}
                  </span>
                  {currentService.star > 0 && (
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm font-medium text-gray-700">
                        {currentService.star}/5
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="flex flex-col items-end">
                  {currentService.discount_percent > 0 ? (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        {currentService.price.toLocaleString()} đ
                      </span>
                      <span className="text-3xl font-bold text-red-600">
                        {finalPrice.toLocaleString()} đ
                      </span>
                      <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1">
                        -{currentService.discount_percent}%
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      {currentService.price.toLocaleString()} đ
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Mô tả dịch vụ
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">
                  {currentService.description ||
                    "Dịch vụ chăm sóc thú cưng chuyên nghiệp với đội ngũ có kinh nghiệm."}
                </p>
              </div>
            </div>

            {/* Service details grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <svg
                    className="w-8 h-8 text-blue-600 mr-3"
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
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Thời gian
                    </p>
                    <p className="text-lg font-semibold text-blue-700">
                      {currentService.duration_type || "60"} phút
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <svg
                    className="w-8 h-8 text-green-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Giới hạn
                    </p>
                    <p className="text-lg font-semibold text-green-700">
                      {currentService.limit_per_hour} khách/giờ
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center">
                  <svg
                    className="w-8 h-8 text-purple-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-purple-900">
                      Đã bán
                    </p>
                    <p className="text-lg font-semibold text-purple-700">
                      {currentService.purchases} lần
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning for inactive service */}
            {!currentService.is_active && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                <div className="flex">
                  <svg
                    className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">
                      Dịch vụ tạm dừng
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Dịch vụ này hiện đang tạm dừng và không thể đặt lịch.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Đặt dịch vụ
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
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
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
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
                      d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z"
                    />
                  </svg>
                  <span>Đặt ngay</span>
                </button>
              </div>

              {!currentService.is_active && (
                <p className="text-sm text-red-600 mt-3 text-center">
                  Dịch vụ đang tạm dừng, không thể đặt lịch
                </p>
              )}
            </div>

            {/* Service ID for debug */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                ID dịch vụ: {currentService.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
