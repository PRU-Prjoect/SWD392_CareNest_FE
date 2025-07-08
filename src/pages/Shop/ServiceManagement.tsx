import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import {
  getAllServices,
  clearAllServiceErrors,
} from "@/store/slices/serviceSlice";
import AddServiceModal from "@/components/modals/AddServiceModal";

const ServiceManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Thêm selector để lấy user info
  const { user } = useSelector((state: RootState) => state.auth);

  // ✅ Redux selectors
  const { services, searching, searchError } = useSelector(
    (state: RootState) => state.service
  );

  // ✅ Local state cho filters và modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // ✅ useEffect cập nhật với user.id dependency
  useEffect(() => {
    // ✅ Chỉ fetch khi có user.id (shopId)
    if (user?.id) {
      dispatch(getAllServices({ 
        shopId: user.id,
        sortBy: "createdAt" 
      }));
    }
  }, [dispatch, user?.id]); // ✅ Thêm user?.id vào dependencies

  useEffect(() => {
    return () => {
      dispatch(clearAllServiceErrors());
    };
  }, [dispatch]);

  // ✅ Kiểm tra user login trước khi render
  if (!user?.id) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">
            Vui lòng đăng nhập để xem danh sách dịch vụ
          </div>
        </div>
      </div>
    );
  }

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === "active" ? service.is_active : !service.is_active);

    return matchesSearch && matchesStatus;
  });

  const handleAddService = () => {
    setShowAddModal(true);
  };

  const handleViewDetail = (serviceId: string) => {
    navigate(`/shop/services/${serviceId}`);
  };

  const handleRefresh = () => {
    if (user?.id) {
      dispatch(getAllServices({ 
        shopId: user.id,
        sortBy: "createdAt" 
      }));
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };
  
  const getStatusText = (isActive: boolean) => {
    return isActive ? "Hoạt động" : "Tạm dừng";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Dịch vụ của tôi
            </h1>
            <p className="text-lg text-gray-600">
              Quản lý các dịch vụ của cửa hàng ({services.length} dịch vụ)
            </p>
            {/* ✅ Thêm thông tin shop ID để debug */}
            <p className="text-sm text-gray-500">
              Shop ID: {user.id}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={searching}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <svg
              className={`w-5 h-5 ${searching ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Làm mới</span>
          </button>
          <button
            onClick={handleAddService}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Thêm dịch vụ</span>
          </button>
        </div>
      </div>

      {/* Error Messages */}
      {searchError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Lỗi khi tải dữ liệu:</p>
          <p>{searchError.message}</p>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm dừng</option>
            </select>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-600">
              {searching ? "Đang tải..." : `${filteredServices.length} kết quả`}
            </span>
          </div>
        </div>
      </div>

      {/* ✅ Loading State */}
      {searching && services.length === 0 && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dịch vụ...</p>
        </div>
      )}

      {/* Services Grid */}
      {!searching || services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
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
                  <p className="text-teal-600 font-medium">{service.name}</p>
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
                            {service.price.toLocaleString("vi-VN")} VNĐ
                          </span>
                          <span className="text-red-600">
                            {(
                              (service.price *
                                (100 - service.discount_percent)) /
                              100
                            ).toLocaleString("vi-VN")}{" "}
                            VNĐ
                          </span>
                        </>
                      ) : (
                        `${service.price.toLocaleString("vi-VN")} VNĐ`
                      )}
                    </span>
                  </div>
                  {service.discount_percent > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Giảm giá:</span>
                      <span className="text-red-600">
                        {service.discount_percent}%
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Thời gian:</span>
                    <span className="text-gray-800">
                      {service.duration_type} phút
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Giới hạn/giờ:</span>
                    <span className="text-gray-800">
                      {service.limit_per_hour}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Đã bán:</span>
                    <span className="text-gray-800">{service.purchases}</span>
                  </div>
                  {service.star > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Đánh giá:</span>
                      <span className="text-yellow-600">
                        ⭐ {service.star}/5
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleViewDetail(service.id)}
                  className="w-full px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2"
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
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Empty State */}
      {!searching && filteredServices.length === 0 && services.length > 0 && (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
            Không tìm thấy dịch vụ
          </h3>
          <p className="text-gray-500">Thử thay đổi bộ lọc tìm kiếm</p>
        </div>
      )}

      {/* No Services State */}
      {!searching && services.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có dịch vụ nào
          </h3>
          <p className="text-gray-500 mb-4">
            Bắt đầu bằng cách thêm dịch vụ đầu tiên của bạn
          </p>
          <button
            onClick={handleAddService}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Thêm dịch vụ đầu tiên
          </button>
        </div>
      )}

      {/* ✅ Add Service Modal - Now with shopId prop */}
      <AddServiceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        shopId={user.id}
      />
    </div>
  );
};

export default ServiceManagement;
