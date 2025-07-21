import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { getShopById } from '@/store/slices/shopSlice';
import { getAllServices } from '@/store/slices/serviceSlice';

const ShopServicesPage: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(true);

  // Get shop information from redux store
  const { currentShop, loading: shopLoading, error: shopError } = useSelector(
    (state: RootState) => state.shop
  );

  // Get services list from redux store
  const { services, loading: servicesLoading, error: servicesError } = useSelector(
    (state: RootState) => state.service
  );

  // Fetch shop information
  useEffect(() => {
    if (shopId) {
      dispatch(getShopById(shopId));
    }
  }, [dispatch, shopId]);

  // Fetch services for this shop
  useEffect(() => {
    if (shopId) {
      dispatch(getAllServices({ shopId }));
    }
  }, [dispatch, shopId]);

  // Update loading state
  useEffect(() => {
    setIsLoading(shopLoading || servicesLoading);
  }, [shopLoading, servicesLoading]);

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  // Handle service detail navigation
  const handleViewDetail = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
  };
  
  // Handle booking navigation
  const handleBookService = (serviceId: string) => {
    navigate(`/app/booking/${serviceId}`);
  };

  // ✅ Thêm helper functions giống ServiceManagement
  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? "Hoạt động" : "Tạm dừng";
  };
  
  // Helper function to render working day schedule
  const renderWorkingDays = () => {
    if (!currentShop?.working_day || currentShop.working_day.length === 0) {
      return (
        <div className="text-gray-500 text-sm">
          Chưa cập nhật lịch làm việc
        </div>
      );
    }
    
    // Vietnamese day names
    const dayNames = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    const viDayNames = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];
    
    // Get current day (0 = Monday, 6 = Sunday in our array)
    const today = new Date().getDay();
    const todayIndex = today === 0 ? 6 : today - 1; // Convert to our array index (0=Monday, 6=Sunday)
    
    // English day names for mapping
    const englishDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    
    // Parse working days from shop data - handling both formats
    const workingDaysInfo = englishDays.map(day => ({
      day: day,
      isWorkingDay: false,
      hours: "8-17" // Default hours
    }));
    
    // Process each working day entry
    currentShop.working_day.forEach(dayString => {
      // Format 1: "Thứ 2 (Monday): 08:00 - 17:00"
      const regex = /^(.+) \((.+)\): (\d{2}:\d{2}) - (\d{2}:\d{2})$/;
      const matches = dayString.match(regex);
      
      if (matches) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, __, enDay, startTime, endTime] = matches;
        const dayIndex = englishDays.findIndex(d => d.toLowerCase() === enDay.toLowerCase());
        
        if (dayIndex !== -1) {
          workingDaysInfo[dayIndex].isWorkingDay = true;
          workingDaysInfo[dayIndex].hours = `${startTime.substring(0, 5)}-${endTime.substring(0, 5)}`;
        }
      } 
      // Format 2: Just day name like "Monday"
      else {
        const dayLower = dayString.toLowerCase();
        const dayIndex = englishDays.findIndex(d => d.toLowerCase() === dayLower);
        
        if (dayIndex !== -1) {
          workingDaysInfo[dayIndex].isWorkingDay = true;
        }
      }
    });
    
    // Check if shop is open today
    const isOpenToday = workingDaysInfo[todayIndex]?.isWorkingDay || false;
    const todayHours = workingDaysInfo[todayIndex]?.hours || "8-17";
    
    return (
      <div className="mt-2">
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {dayNames.map((day, index) => (
              <div key={day} className={`text-xs font-medium ${index === todayIndex ? "text-teal-700" : "text-gray-600"}`}>
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {workingDaysInfo.map((day, index) => (
              <div key={index} className="flex justify-center">
                <div className={`w-4 h-4 rounded-full ${day.isWorkingDay ? "bg-green-500" : "bg-red-500"}`}></div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {workingDaysInfo.map((day, index) => (
              <div key={index} className="text-gray-600">
                {day.isWorkingDay ? day.hours : "Nghỉ"}
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-2 border-t border-gray-100 flex items-center">
            <div className="w-2 h-2 rounded-full mr-2 animate-pulse bg-teal-500"></div>
            <span className="text-xs text-gray-600">
              Hôm nay: {viDayNames[todayIndex]} - {isOpenToday ? `Đang mở cửa (${todayHours})` : "Đã đóng cửa"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin cửa hàng...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (shopError || !currentShop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy cửa hàng</h2>
          <p className="text-gray-600 mb-4">
            {shopError?.message || 'Cửa hàng bạn tìm kiếm không tồn tại hoặc đã bị xóa.'}
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Improved Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Dịch vụ của {currentShop.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {services.length} dịch vụ có sẵn
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ✅ Shop Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-100 to-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h4M7 15h10" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentShop.name}</h2>
              <p className="text-gray-600 mb-3">{currentShop.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-600">{currentShop.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
                  </svg>
                  <span className="text-gray-600">Ngày làm việc</span>
                </div>
              </div>
              
              {/* ✅ New Working Days Interactive Display */}
              {renderWorkingDays()}
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Danh sách dịch vụ</h2>
          
          {/* Error State */}
          {servicesError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">Lỗi khi tải dữ liệu:</p>
              <p>{servicesError.message || "Không thể tải danh sách dịch vụ"}</p>
            </div>
          )}

          {/* Empty State */}
          {services.length === 0 && !servicesLoading && !servicesError && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Chưa có dịch vụ</h3>
              <p className="text-gray-600">Cửa hàng này chưa có dịch vụ nào được đăng ký.</p>
            </div>
          )}

          {/* ✅ Services Grid - Đồng bộ với ServiceManagement */}
          {services.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  {/* Service Image/Icon */}
                  <div className="h-48 bg-gradient-to-r from-teal-100 to-blue-100 flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="w-16 h-16 text-teal-600 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h4M7 15h10"
                        />
                      </svg>
                      <p className="text-teal-600 font-medium text-sm truncate px-2">
                        {service.name}
                      </p>
                    </div>
                  </div>

                  {/* Service Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 truncate pr-2">
                        {service.name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(
                          service.is_active
                        )}`}
                      >
                        {getStatusText(service.is_active)}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {service.description || "Không có mô tả"}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Giá:</span>
                        <span className="text-gray-800 font-medium">
                          {service.discount_percent > 0 ? (
                            <>
                              <span className="line-through text-gray-400 mr-1">
                                {(service.price ?? 0).toLocaleString("vi-VN")} VNĐ
                              </span>
                              <span className="text-red-600">
                                {(
                                  ((service.price ?? 0) * (100 - service.discount_percent)) / 100
                                ).toLocaleString("vi-VN")}{" "}
                                VNĐ
                              </span>
                            </>
                          ) : (
                            `${(service.price ?? 0).toLocaleString("vi-VN")} VNĐ`
                          )}
                        </span>
                      </div>
                      {service.discount_percent > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Giảm giá:</span>
                          <span className="text-red-600">{service.discount_percent}%</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Thời gian:</span>
                        <span className="text-gray-800">{service.duration_type} phút</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Giới hạn/giờ:</span>
                        <span className="text-gray-800">{service.limit_per_hour}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Đã bán:</span>
                        <span className="text-gray-800">{service.purchases}</span>
                      </div>
                      {service.star > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Đánh giá:</span>
                          <span className="text-yellow-600">⭐ {service.star}/5</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetail(service.id)}
                        className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Chi tiết</span>
                      </button>
                      
                      {/* ✅ Đồng bộ với nút Đặt ngay trong ServiceDetailPage */}
                      <button
                        onClick={() => handleBookService(service.id)}
                        disabled={!service.is_active}
                        className="flex-1 px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="white"
                          viewBox="0 0 303.124 303.124"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M290.245,85.686c-1.136-1.469-2.889-2.33-4.747-2.33h-67.717L163.252,2.642c-1.855-2.746-5.585-3.468-8.331-1.613
                            c-2.746,1.855-3.468,5.584-1.613,8.33l49.991,73.997H87.169l49.99-73.997c1.855-2.746,1.133-6.475-1.613-8.33
                            c-2.746-1.855-6.476-1.134-8.331,1.613L72.687,83.356H6c-1.857,0-3.61,0.86-4.747,2.33c-1.136,1.469-1.528,3.382-1.06,5.18
                            l41.773,160.635c0.688,2.644,3.075,4.49,5.807,4.49h195.953c2.732,0,5.119-1.846,5.807-4.49l41.772-160.635
                            C291.772,89.069,291.381,87.156,290.245,85.686z"
                          />
                        </svg>
                        <span>Đặt ngay</span>
                      </button>
                    </div>
                    
                    {!service.is_active && (
                      <p className="text-sm text-red-600 mt-2 text-center">
                        Dịch vụ đang tạm dừng, không thể đặt lịch
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopServicesPage;
