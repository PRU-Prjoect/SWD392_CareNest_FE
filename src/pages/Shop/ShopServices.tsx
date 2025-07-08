import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { getShopById } from '@/store/slices/shopSlice';
import ServiceCard from '@/pages/Home/components/ServiceCard';
import { getAllServices } from '@/store/slices/serviceSlice';

const ShopServicesPage: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  // Loading state
  if (isLoading) {
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

  // Error state
  if (shopError || !currentShop) {
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
            Không tìm thấy cửa hàng
          </h2>
          <p className="text-gray-600 mb-6">
            {shopError?.message || 'Cửa hàng bạn tìm kiếm không tồn tại hoặc đã bị xóa.'}
          </p>
          <button
            onClick={handleBack}
            className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

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
              Dịch vụ của {currentShop.name}
            </h1>
            <div className="w-20"></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </div>

      {/* Shop info section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center">
            <div className="bg-teal-100 rounded-full p-3 mr-4">
              <svg
                className="w-8 h-8 text-teal-600"
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
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{currentShop.name}</h2>
              <p className="text-gray-600 mt-1">{currentShop.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-sm text-gray-500">
                  <svg 
                    className="w-4 h-4 mr-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                    />
                  </svg>
                  {currentShop.phone}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <svg 
                    className="w-4 h-4 mr-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                  </svg>
                  Ngày làm việc: {currentShop.working_day?.join(", ") || "Chưa cập nhật"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services list */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Danh sách dịch vụ</h2>
        
        {servicesError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {servicesError.message || "Không thể tải danh sách dịch vụ"}
          </div>
        )}

        {services.length === 0 && !servicesLoading && !servicesError && (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <svg 
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M9 16h6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có dịch vụ</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Cửa hàng này chưa có dịch vụ nào được đăng ký. Vui lòng quay lại sau.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard 
              key={service.id} 
              service={{
                id: Number(service.id), 
                title: service.name,
                price: service.price.toLocaleString() + ' đ',
                image: "https://picsum.photos/200/300?random=" + service.id,
                rating: service.star,
                description: service.description
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopServicesPage; 