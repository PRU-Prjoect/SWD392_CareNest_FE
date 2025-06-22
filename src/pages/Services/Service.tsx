// pages/ServicesPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { getAllServices, clearSearchError } from "@/store/slices/serviceSlice";
import FilterBar from "@/components/common/FilterBar";

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const { services, searching, searchError } = useSelector(
    (state: RootState) => state.service
  );

  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [currentFilters, setCurrentFilters] = useState<Record<string, string>>(
    {}
  );

  // ✅ Get search info from navigation state
  useEffect(() => {
    const state = location.state as any;

    if (state?.searchTerm) {
      setCurrentSearchTerm(state.searchTerm);
    }

    if (state?.filters) {
      setCurrentFilters(state.filters);
    }

    // If no services loaded and no current search, load all services
    if (services.length === 0 && !state?.searchTerm && !state?.filters) {
      dispatch(getAllServices({}));
    }
  }, [location.state, dispatch, services.length]);

  // ✅ Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearSearchError());
    };
  }, [dispatch]);

  // ✅ Xử lý filter từ FilterBar (nếu có)
  const handleFilter = async (filters: Record<string, string>) => {
    setCurrentFilters(filters);

    try {
      // Map filters to API parameters
      const searchParams: any = {};

      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "price_asc":
            searchParams.sortBy = "price";
            break;
          case "price_desc":
            searchParams.sortBy = "price_desc";
            break;
          case "rating":
            searchParams.sortBy = "star";
            break;
          case "newest":
            searchParams.sortBy = "createdAt";
            break;
          default:
            searchParams.sortBy = "createdAt";
        }
      }

      // Add more filter mappings as needed
      if (filters.petType) {
        searchParams.serviceTypeId = "f11909c0-89c2-4c5a-8fd9-21511a619e2c";
      }

      await dispatch(getAllServices(searchParams));
    } catch (error) {
      console.error("Filter error:", error);
    }
  };

  // ✅ Handle service detail view
  const handleServiceDetail = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent onClick
    navigate(`/app/service-detail/${id}`);
  };

  // ✅ Handle book now
  const handleBookNow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent onClick
    // Navigate to booking page or open booking modal
    navigate(`/app/booking/${id}`);
  };

  // ✅ Handle retry on error
  const handleRetry = () => {
    dispatch(getAllServices({}));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search info và filters như cũ */}
      {currentSearchTerm && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">
            Kết quả tìm kiếm cho: <strong>"{currentSearchTerm}"</strong>
          </p>
        </div>
      )}

      {/* ✅ Show current filters */}
      {Object.keys(currentFilters).length > 0 && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">
            Đang áp dụng bộ lọc:{" "}
            {Object.entries(currentFilters)
              .filter(([_, value]) => value)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")}
          </p>
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar onFilter={handleFilter} />

      {/* ✅ Error State */}
      {searchError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-red-800 font-medium">Có lỗi xảy ra</h3>
              <p className="text-red-600 text-sm mt-1">{searchError.message}</p>
            </div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {/* ✅ Loading State */}
      {searching && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A9D8F]"></div>
          <p className="mt-4 text-gray-600">Đang tìm kiếm dịch vụ...</p>
        </div>
      )}

      {/* ✅ Services Grid - Cập nhật với 2 nút */}
      {!searching && services.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-lg transition"
            >
              {/* Service Image Placeholder */}
              <div className="w-full h-28 bg-gradient-to-r from-teal-100 to-blue-100 rounded mb-3 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-teal-600"
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
              </div>

              {/* Service Info */}
              <div className="text-center w-full flex-1">
                <div className="font-medium text-gray-800 mb-1 line-clamp-2">
                  {service.name}
                </div>

                <div className="text-orange-600 font-semibold mt-1">
                  {service.discount_percent > 0 ? (
                    <>
                      <span className="line-through text-gray-400 text-sm mr-1">
                        {service.price.toLocaleString()} đ
                      </span>
                      <span>
                        {(
                          (service.price * (100 - service.discount_percent)) /
                          100
                        ).toLocaleString()}{" "}
                        đ
                      </span>
                    </>
                  ) : (
                    `${service.price.toLocaleString()} đ`
                  )}
                </div>

                <div className="text-xs text-gray-400 mt-1">
                  Đã bán: {service.purchases}
                  {service.star > 0 && <span> | ⭐ {service.star}/5</span>}
                </div>

                {/* Status badge */}
                <div className="mt-2 mb-3">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      service.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {service.is_active ? "Đang hoạt động" : "Tạm dừng"}
                  </span>
                </div>
              </div>

              {/* ✅ Action Buttons */}
              <div className="flex flex-col gap-2 mt-auto">
                <button
                  onClick={(e) => handleServiceDetail(service.id, e)}
                  className="w-full px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span>Xem chi tiết</span>
                </button>

                <button
                  onClick={(e) => handleBookNow(service.id, e)}
                  disabled={!service.is_active}
                  className="w-full px-3 py-2 bg-[#2A9D8F] text-white text-sm rounded-lg hover:bg-[#238276] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                >
                  <svg
                    className="w-4 h-4"
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
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!searching && services.length === 0 && !searchError && (
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy dịch vụ nào
          </h3>
          <p className="text-gray-500 text-center">
            {currentSearchTerm
              ? `Không có kết quả cho "${currentSearchTerm}". Thử tìm kiếm với từ khóa khác.`
              : "Hiện tại chưa có dịch vụ nào. Vui lòng thử lại sau."}
          </p>
          <button
            onClick={() => {
              setCurrentSearchTerm("");
              setCurrentFilters({});
              dispatch(getAllServices({}));
            }}
            className="mt-4 px-4 py-2 bg-[#2A9D8F] text-white rounded-lg hover:bg-[#238276] transition-colors"
          >
            Xem tất cả dịch vụ
          </button>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
