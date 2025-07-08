// components/modals/AddServiceModal.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { createService, clearCreateError } from "@/store/slices/serviceSlice";
import { searchServiceTypes } from "@/store/slices/serviceTypeShopSlice";
import { toast } from "react-toastify";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopId?: string; // Add shopId prop
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  onClose,
  shopId, // Add shopId to destructuring
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { creating, createError } = useSelector(
    (state: RootState) => state.service
  );
  const { serviceTypes, searching } = useSelector(
    (state: RootState) => state.serviceTypeShop
  );
  // Get user from auth state as fallback
  const { user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    limit_per_hour: 1,
    duration_type: 60,
    is_active: true,
    discount_percent: 0,
    service_type_id: "",
  });

  // Fetch service types when component mounts
  useEffect(() => {
    if (isOpen) {
      dispatch(searchServiceTypes());
    }
  }, [dispatch, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : [
              "price",
              "limit_per_hour",
              "duration_type",
              "discount_percent",
            ].includes(name)
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.service_type_id) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    if (formData.price <= 0) {
      toast.error("Giá dịch vụ phải lớn hơn 0!");
      return;
    }

    // Determine which shop ID to use
    const effectiveShopId = shopId || user?.id;
    
    if (!effectiveShopId) {
      toast.error("Không tìm thấy thông tin cửa hàng!");
      return;
    }

    try {
      const result = await dispatch(
        createService({
          id: crypto.randomUUID(),
          ...formData,
          shop_id: effectiveShopId, // Use the passed shopId or user ID from auth state
          star: 0,
          purchases: 0,
        })
      );

      if (createService.fulfilled.match(result)) {
        toast.success("Thêm dịch vụ thành công!");
        onClose();
        // Reset form
        setFormData({
          name: "",
          description: "",
          price: 0,
          limit_per_hour: 1,
          duration_type: 60,
          is_active: true,
          discount_percent: 0,
          service_type_id: "",
        });
      }
    } catch (error) {
      toast.error("Thêm dịch vụ thất bại!");
      console.error("Create service error:", error);
    }
  };

  const handleClose = () => {
    dispatch(clearCreateError());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto relative">
        {/* Nút đóng popup */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold"
          aria-label="Đóng"
          disabled={creating}
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold mb-4 text-center">
          Thêm dịch vụ mới
        </h3>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Nhập thông tin dịch vụ mới
        </p>

        {createError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {createError.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tên dịch vụ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên dịch vụ *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
                required
                disabled={creating}
              />
            </div>

            {/* Loại dịch vụ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại dịch vụ *
              </label>
              <select
                name="service_type_id"
                value={formData.service_type_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
                required
                disabled={creating || searching}
              >
                <option value="">Chọn loại dịch vụ</option>
                {serviceTypes.map((serviceType) => (
                  <option key={serviceType.id} value={serviceType.id}>
                    {serviceType.name}
                  </option>
                ))}
              </select>
              {searching && (
                <div className="text-sm text-gray-500 mt-1">
                  Đang tải loại dịch vụ...
                </div>
              )}
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
              disabled={creating}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Giá */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá (VNĐ) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
                required
                min="0"
                disabled={creating}
              />
            </div>

            {/* Giảm giá */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giảm giá (%)
              </label>
              <input
                type="number"
                name="discount_percent"
                value={formData.discount_percent}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
                min="0"
                max="100"
                disabled={creating}
              />
            </div>

            {/* Giới hạn mỗi giờ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới hạn khách/giờ *
              </label>
              <input
                type="number"
                name="limit_per_hour"
                value={formData.limit_per_hour}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
                required
                min="1"
                disabled={creating}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Thời gian */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian (phút)
              </label>
              <input
                type="number"
                name="duration_type"
                value={formData.duration_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
                min="0"
                disabled={creating}
              />
            </div>

            {/* Trạng thái */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#2A9D8F] focus:ring-[#2A9D8F] border-gray-300 rounded"
                  disabled={creating}
                />
                <label className="ml-2 text-sm text-gray-700">
                  Kích hoạt dịch vụ
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              disabled={creating}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex-1 py-3 bg-[#2A9D8F] text-white rounded-md hover:bg-[#228B7E] transition disabled:opacity-50"
            >
              {creating ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang thêm...
                </>
              ) : (
                "Thêm dịch vụ"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;
