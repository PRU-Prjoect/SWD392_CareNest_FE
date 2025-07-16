// pages/ServiceDetailPage.tsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { getServiceById, clearServiceError } from "@/store/slices/serviceSlice";
import { getShopById } from "@/store/slices/shopSlice";

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Redux state
  const { currentService, loading, error } = useSelector(
    (state: RootState) => state.service
  );
  const { currentShop, loading: shopLoading } = useSelector(
    (state: RootState) => state.shop
  );

  // ✅ Debug logs
  console.log("ServiceDetailPage rendered");
  console.log("Service ID:", id);
  console.log("Current service:", currentService);
  console.log("Loading:", loading);
  console.log("Error:", error);
  console.log("Shop:", currentShop);

  // ✅ Fetch service data
  useEffect(() => {
    if (id) {
      console.log("Fetching service with ID:", id);
      dispatch(getServiceById(id));
    }
  }, [dispatch, id]);

  // ✅ Fetch shop data when service is loaded
  useEffect(() => {
    if (currentService?.shop_id) {
      console.log("Fetching shop with ID:", currentService.shop_id);
      dispatch(getShopById(currentService.shop_id));
    }
  }, [dispatch, currentService?.shop_id]);

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

  const handleViewShopServices = () => {
    if (currentService?.shop_id) {
      // Navigate to shop services page
      navigate(`/app/shop/${currentService.shop_id}/services`);
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
    currentService.discount_percent > 0 && typeof currentService.price === 'number'
      ? (currentService.price * (100 - currentService.discount_percent)) / 100
      : currentService.price || 0;

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
            {currentService.img_url ? (
              <img 
                src={currentService.img_url} 
                alt={currentService.name} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.style.display = "none";
                  
                  const parentElement = target.parentElement;
                  if (parentElement) {
                    const iconDiv = document.createElement("div");
                    iconDiv.className = "text-center";
                    iconDiv.innerHTML = `
                      <svg class="w-24 h-24 text-teal-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h4M7 15h10" />
                      </svg>
                      <p class="text-teal-700 font-semibold text-xl">${currentService.name}</p>
                    `;
                    parentElement.appendChild(iconDiv);
                  }
                }}
              />
            ) : (
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
            )}
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
                
                {/* Shop information */}
                {currentShop && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      Cung cấp bởi:{" "}
                      <button 
                        onClick={handleViewShopServices}
                        className="text-teal-600 hover:text-teal-800 font-medium"
                      >
                        {currentShop.name} 
                        <svg 
                          className="w-4 h-4 inline-block ml-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                          />
                        </svg>
                      </button>
                    </p>
                  </div>
                )}
                
                {shopLoading && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 flex items-center">
                      <span className="inline-block w-3 h-3 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mr-2"></span>
                      Đang tải thông tin cửa hàng...
                    </p>
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="flex flex-col items-end">
                  {currentService.discount_percent > 0 ? (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        {(currentService.price || 0).toLocaleString()} đ
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
                      {(currentService.price || 0).toLocaleString()} đ
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

            {/* Shop services button */}
            {currentShop && (
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 text-teal-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M7 7h10"
                      />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-teal-800">
                        Dịch vụ khác từ {currentShop.name}
                      </h4>
                      <p className="text-sm text-teal-600 mt-0.5">
                        Xem thêm các dịch vụ khác từ cửa hàng này
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleViewShopServices}
                    className="px-4 py-2 bg-teal-600 text-white text-sm rounded hover:bg-teal-700 transition-colors"
                  >
                    Xem tất cả
                  </button>
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
                    className="w-5 h-5 text-black"
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <path d="M432 928a48 48 0 1 1 0-96 48 48 0 0 1 0 96zm320 0a48 48 0 1 1 0-96 48 48 0 0 1 0 96zM96 128a32 32 0 0 1 0-64h160a32 32 0 0 1 31.36 25.728L320.64 256H928a32 32 0 0 1 31.296 38.72l-96 448A32 32 0 0 1 832 768H384a32 32 0 0 1-31.36-25.728L229.76 128H96zm314.24 576h395.904l82.304-384H333.44l76.8 384z" />
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
                    fill="#ffffff"
                    height="800px"
                    width="800px"
                    viewBox="0 0 303.124 303.124"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M290.245,85.686c-1.136-1.469-2.889-2.33-4.747-2.33h-67.717L163.252,2.642c-1.855-2.746-5.585-3.468-8.331-1.613
    c-2.746,1.855-3.468,5.584-1.613,8.33l49.991,73.997H87.169l49.99-73.997c1.855-2.746,1.133-6.475-1.613-8.33
    c-2.746-1.855-6.476-1.134-8.331,1.613L72.687,83.356H6c-1.857,0-3.61,0.86-4.747,2.33c-1.136,1.469-1.528,3.382-1.06,5.18
    l41.773,160.635c0.688,2.644,3.075,4.49,5.807,4.49h195.953c2.732,0,5.119-1.846,5.807-4.49l41.772-160.635
    C291.772,89.069,291.381,87.156,290.245,85.686z M253.011,190.445h-59.857v-41.546h70.661L253.011,190.445z M181.153,190.445h-70.81
    v-41.546h70.81V190.445z M181.153,202.445v41.546h-70.81v-41.546H181.153z M27.684,148.899h70.66v41.546H38.487L27.684,148.899z
    M110.344,136.899V95.356h70.81v41.543H110.344z M75.862,95.356c0.002,0,0.004,0,0.007,0c0.003,0,0.005,0,0.008,0h22.466v41.543
    H24.563L13.76,95.356H75.862z M41.608,202.445h56.735v41.546H52.412L41.608,202.445z M239.086,243.991h-45.933v-41.546h56.737
    L239.086,243.991z M266.935,136.899h-73.782V95.356h21.438c0.003,0,0.005,0,0.008,0c0.002,0,0.004,0,0.007,0h63.132L266.935,136.899
    z"
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
              {currentService.shop_id && (
                <p className="text-xs text-gray-500">
                  ID cửa hàng: {currentService.shop_id}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
