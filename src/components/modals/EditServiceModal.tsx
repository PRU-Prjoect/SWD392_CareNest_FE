// components/modals/EditServiceModal.tsx
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { updateService, clearUpdateError } from "@/store/slices/serviceSlice";
import { searchServiceTypes } from "@/store/slices/serviceTypeShopSlice";
import { toast } from "react-toastify";
import { Camera, Upload } from "lucide-react";

// Cập nhật interface ServiceData để phù hợp với interface trong serviceSlice.ts
interface ServiceData {
  id: string;
  name: string;
  is_active: boolean;
  shop_id: string;
  description: string;
  discount_percent: number;
  price: number; // Giữ nguyên là number cho component này
  limit_per_hour: number;
  duration_type: number;
  star: number;
  purchases: number;
  service_type_id: string;
  img_url?: string;
  img_url_id?: string;
}

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceData | null;
  shopId?: string; // Add shopId prop
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({
  isOpen,
  onClose,
  service,
  shopId, // Add shopId to destructuring
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { updating, updateError } = useSelector(
    (state: RootState) => state.service
  );
  const { serviceTypes, searching } = useSelector(
    (state: RootState) => state.serviceTypeShop
  );
  // Get user from auth state as fallback
  const { user } = useSelector((state: RootState) => state.auth);

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
    img_url: "",
    img_url_id: "",
  });

  // ✅ States cho upload image
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (service) {
      setFormData({
        ...service,
        price: service.price || 0, // Đảm bảo price luôn là number
        img_url: service.img_url || "",
        img_url_id: service.img_url_id || "",
      });
    }
  }, [service]);

  // Fetch service types when component mounts
  useEffect(() => {
    if (isOpen) {
      dispatch(searchServiceTypes());
    }
  }, [dispatch, isOpen]);

  // ✅ Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)");
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Kích thước file không được vượt quá 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setShowImageUpload(true);
  };

  // ✅ Cancel image upload
  const handleCancelImageUpload = () => {
    setShowImageUpload(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ✅ Get current avatar URL (from preview or service)
  const getCurrentImageUrl = () => {
    if (previewUrl) return previewUrl;
    if (formData.img_url) return formData.img_url;
    return null;
  };

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

    // Determine which shop ID to use
    const effectiveShopId = shopId || user?.id || formData.shop_id;
    
    if (!effectiveShopId) {
      toast.error("Không tìm thấy thông tin cửa hàng!");
      return;
    }

    try {
      // Override the shop_id with the provided shopId or fall back to user.id
      const dataToUpdate = {
        ...formData,
        shop_id: effectiveShopId,
        img: selectedFile // Thêm file ảnh nếu có
      };
      
      const result = await dispatch(updateService(dataToUpdate));

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
          {/* ✅ Image upload section */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                {getCurrentImageUrl() ? (
                  <img
                    src={getCurrentImageUrl()!}
                    alt="Service image"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <Camera size={32} />
                    <span className="text-xs mt-1">Chưa có ảnh</span>
                  </div>
                )}
              </div>

              {/* Camera button overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-[#f5b427] rounded-full flex items-center justify-center text-white hover:bg-[#c48909] transition-colors duration-200 shadow-lg"
                title="Đổi ảnh dịch vụ"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Nhấn vào biểu tượng camera để thay đổi ảnh
            </p>
          </div>

          {/* ✅ Image preview and upload controls */}
          {showImageUpload && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium text-blue-900 mb-3 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Xem trước ảnh dịch vụ mới
              </h3>
              <div className="flex items-center gap-4">
                {previewUrl && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white shadow-md">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm text-blue-700">
                    <strong>{selectedFile?.name}</strong>
                  </p>
                  <p className="text-xs text-blue-600">
                    Kích thước:{" "}
                    {selectedFile
                      ? (selectedFile.size / 1024 / 1024).toFixed(2)
                      : 0}{" "}
                    MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCancelImageUpload}
                  className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

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
                disabled={updating || searching}
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
