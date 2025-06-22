// components/modals/EditServiceModal.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { updateService, clearUpdateError } from "@/store/slices/serviceSlice";
import { toast } from "react-toastify";

interface ServiceData {
  id: string;
  name: string;
  is_active: boolean;
  shop_id: string;
  description: string;
  discount_percent: number;
  price: number;
  limit_per_hour: number;
  duration_type: number;
  star: number;
  purchases: number;
  service_type_id: string;
}

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceData | null;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({
  isOpen,
  onClose,
  service,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { updating, updateError } = useSelector(
    (state: RootState) => state.service
  );

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    limit_per_hour: 1,
    duration_type: 60,
    is_active: true,
    shop_id: "",
    discount_percent: 0,
    star: 0,
    purchases: 0,
    service_type_id: "",
  });

  useEffect(() => {
    if (service) {
      setFormData(service);
    }
  }, [service]);

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
              "star",
              "purchases",
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

    try {
      const result = await dispatch(updateService(formData));

      if (updateService.fulfilled.match(result)) {
        toast.success("Cập nhật dịch vụ thành công!");
        onClose();
      }
    } catch (error) {
      toast.error("Cập nhật dịch vụ thất bại!");
      console.error("Update service error:", error);
    }
  };

  const handleClose = () => {
    dispatch(clearUpdateError());
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
          disabled={updating}
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold mb-4 text-center">
          Chỉnh sửa dịch vụ
        </h3>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Cập nhật thông tin dịch vụ
        </p>

        {updateError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {updateError.message}
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
                disabled={updating}
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
                disabled={updating}
              >
                <option value="">Chọn loại dịch vụ</option>
                <option value="f11909c0-89c2-4c5a-8fd9-21511a619e2c">
                  Chăm sóc thú cưng
                </option>
              </select>
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
              disabled={updating}
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
                disabled={updating}
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
                disabled={updating}
              />
            </div>

            {/* Giới hạn mỗi giờ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới hạn/giờ *
              </label>
              <input
                type="number"
                name="limit_per_hour"
                value={formData.limit_per_hour}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
                required
                min="1"
                disabled={updating}
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
                disabled={updating}
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
                  disabled={updating}
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
              disabled={updating}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={updating}
              className="flex-1 py-3 bg-[#2A9D8F] text-white rounded-md hover:bg-[#228B7E] transition disabled:opacity-50"
            >
              {updating ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật dịch vụ"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditServiceModal;
