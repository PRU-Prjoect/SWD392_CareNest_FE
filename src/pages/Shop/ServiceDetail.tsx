// pages/Shop/ServiceDetail.tsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import {
  getServiceById,
  deleteService,
  updateService,
  clearAllServiceErrors,
  clearUpdateError,
  clearDeleteError,
} from "@/store/slices/serviceSlice";
import { toast } from "react-toastify";
import EditServiceModal from "@/components/modals/EditServiceModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const prevUpdatingRef = useRef(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { currentService, loading, updating, error, updateError, deleteError } =
    useSelector((state: RootState) => state.service);

  // ✅ Local state cho modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getServiceById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    return () => {
      dispatch(clearAllServiceErrors());
    };
  }, [dispatch]);

  // ✅ Auto refresh data sau khi update thành công
  useEffect(() => {
    // ✅ Chỉ close modal khi updating chuyển từ true → false (tức là vừa hoàn thành)
    if (prevUpdatingRef.current && !updating && !updateError && showEditModal) {
      setShowEditModal(false);
      if (id) {
        dispatch(getServiceById(id));
      }
    }
    prevUpdatingRef.current = updating;
  }, [updating, updateError, showEditModal, dispatch, id]);

  const handleEdit = () => {
    dispatch(clearUpdateError());
    setShowEditModal(true);
    console.log("DEBUG: handleEdit called, setShowEditModal(true)");
  };

  const handleDelete = () => {
    if (!currentService) return;

    // ✅ Kiểm tra điều kiện xóa
    if (currentService.is_active) {
      toast.error(
        "Không thể xóa dịch vụ đang hoạt động. Vui lòng tắt dịch vụ trước khi xóa."
      );
      return;
    }

    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentService) return;

    try {
      const result = await dispatch(deleteService(currentService.id));

      if (deleteService.fulfilled.match(result)) {
        toast.success("Xóa dịch vụ thành công!");
        navigate("/shop/services");
      }
    } catch (error) {
      toast.error("Xóa dịch vụ thất bại!");
      console.error("Delete failed:", error);
    }
  };

  const handleBack = () => {
    navigate("/shop/services");
  };

  // Loading state
  if (loading && !currentService) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin dịch vụ...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !currentService) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-red-400 mx-auto mb-4"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không thể tải thông tin dịch vụ
            </h3>
            <p className="text-gray-500 mb-4">{error.message}</p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentService) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy dịch vụ
            </h3>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header với nút quay lại */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
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
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Chi tiết dịch vụ
              </h1>
              <p className="text-gray-600">Xem và quản lý thông tin dịch vụ</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span>Chỉnh sửa</span>
            </button>

            <button
              onClick={handleDelete}
              disabled={currentService.is_active}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              title={
                currentService.is_active
                  ? "Không thể xóa dịch vụ đang hoạt động"
                  : "Xóa dịch vụ"
              }
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Xóa</span>
            </button>
          </div>
        </div>
        {/* Error Messages */}
        {(updateError || deleteError) && (
          <div className="mb-6 space-y-2">
            {updateError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="font-medium">Lỗi khi cập nhật dịch vụ:</p>
                <p>{updateError.message}</p>
              </div>
            )}
            {deleteError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="font-medium">Lỗi khi xóa dịch vụ:</p>
                <p>{deleteError.message}</p>
              </div>
            )}
          </div>
        )}
        {/* Service Detail Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Service Image Placeholder */}
          <div className="h-64 bg-gradient-to-r from-teal-100 to-blue-100 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-20 h-20 text-teal-600 mx-auto mb-4"
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
              <p className="text-teal-600 font-medium text-xl">
                {currentService.name}
              </p>
            </div>
          </div>

          {/* Service Info */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {currentService.name}
                  </h2>
                  <span
                    className={`px-3 py-1 text-sm rounded-full border ${
                      currentService.is_active
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {currentService.is_active ? "Hoạt động" : "Tạm dừng"}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Mô tả
                  </h3>
                  <p className="text-gray-800">
                    {currentService.description || "Không có mô tả"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Giá dịch vụ
                    </h3>
                    <div className="text-lg font-semibold text-gray-800">
                      {currentService.discount_percent > 0 ? (
                        <>
                          <span className="line-through text-gray-400 text-base mr-2">
                            {currentService.price.toLocaleString("vi-VN")} VNĐ
                          </span>
                          <span className="text-red-600">
                            {(
                              (currentService.price *
                                (100 - currentService.discount_percent)) /
                              100
                            ).toLocaleString("vi-VN")}{" "}
                            VNĐ
                          </span>
                        </>
                      ) : (
                        `${currentService.price.toLocaleString("vi-VN")} VNĐ`
                      )}
                    </div>
                  </div>

                  {currentService.discount_percent > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Giảm giá
                      </h3>
                      <p className="text-lg font-semibold text-red-600">
                        {currentService.discount_percent}%
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Service Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Thời gian dịch vụ
                    </h3>
                    <p className="text-lg font-semibold text-gray-800">
                      {currentService.duration_type} phút
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Giới hạn/giờ
                    </h3>
                    <p className="text-lg font-semibold text-gray-800">
                      {currentService.limit_per_hour} khách
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Đã bán
                    </h3>
                    <p className="text-lg font-semibold text-gray-800">
                      {currentService.purchases} lần
                    </p>
                  </div>

                  {currentService.star > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Đánh giá
                      </h3>
                      <p className="text-lg font-semibold text-yellow-600">
                        ⭐ {currentService.star}/5
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Thông tin hệ thống
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">ID:</span>{" "}
                      {currentService.id}
                    </p>
                    <p>
                      <span className="font-medium">Shop ID:</span>{" "}
                      {currentService.shop_id}
                    </p>
                    <p>
                      <span className="font-medium">Service Type ID:</span>{" "}
                      {currentService.service_type_id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning cho service active */}
            {currentService.is_active && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
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
                      Dịch vụ đang hoạt động
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Bạn cần tắt dịch vụ trước khi có thể xóa. Sử dụng nút
                      "Chỉnh sửa" để thay đổi trạng thái dịch vụ.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <EditServiceModal
          isOpen={showEditModal}
          onClose={() => {
            console.log("DEBUG: Closing edit modal");
            setShowEditModal(false);
          }}
          service={currentService}
        />

        {/* ✅ Delete Confirm Modal */}
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            dispatch(clearDeleteError());
          }}
          onConfirm={handleConfirmDelete}
          serviceName={currentService.name}
        />
      </div>
    </div>
  );
};

export default ServiceDetail;
