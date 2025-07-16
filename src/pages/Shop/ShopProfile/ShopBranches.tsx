// pages/shop/profile/ShopBranches.tsx
import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { Plus, Edit2, Trash2, MapPin, Phone, Building } from "lucide-react";
import {
  searchSubAddresses,
  createSubAddress,
  updateSubAddress,
  deleteSubAddress,
} from "@/store/slices/subAddressSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleBranchError, handleContextualError } from "@/utils/errorHandling";

interface SubAddress {
  id: string;
  name: string;
  shop_id: string;
  phone: string | number;
  address_name: string;
  is_default: boolean;
}

const ShopBranches: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const {
    subAddresses,
    loading: subAddressLoading,
    creating: subAddressCreating,
    updating: subAddressUpdating,
    deleting: subAddressDeleting,
    error: subAddressError,
  } = useAppSelector((state) => state.subAddress);

  const [showBranchModal, setShowBranchModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<SubAddress | null>(null);

  // ✅ Fetch data khi component mount
  useEffect(() => {
    if (user?.id) {
      dispatch(searchSubAddresses({ shopId: user.id }));
    }
  }, [dispatch, user?.id]);

  // ✅ Handle CRUD chi nhánh
  const handleCreateBranch = async (
    branchData: Omit<SubAddress, "id" | "shop_id">
  ) => {
    if (!user?.id) return;

    try {
      await dispatch(
        createSubAddress({
          id: crypto.randomUUID(),
          shop_id: user.id,
          name: branchData.name,
          phone: branchData.phone.toString(),
          address_name: branchData.address_name,
          is_default: branchData.is_default,
        })
      ).unwrap();

      toast.success("Thêm chi nhánh thành công!");
      dispatch(searchSubAddresses({ shopId: user.id }));
    } catch (error: unknown) {
      console.error("Create branch failed:", error);
      handleBranchError(error);
    }
  };

  const handleUpdateBranch = async (
    branchId: string,
    branchData: Omit<SubAddress, "id" | "shop_id">
  ) => {
    if (!user?.id) return;

    try {
      await dispatch(
        updateSubAddress({
          id: branchId,
          shop_id: user.id,
          name: branchData.name,
          phone: branchData.phone.toString(),
          address_name: branchData.address_name,
          is_default: branchData.is_default,
        })
      ).unwrap();

      toast.success("Cập nhật chi nhánh thành công!");
      dispatch(searchSubAddresses({ shopId: user.id }));
    } catch (error: unknown) {
      console.error("Update branch failed:", error);
      handleBranchError(error);
    }
  };

  const handleDeleteBranch = async (branchId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa chi nhánh này?")) return;

    try {
      await dispatch(deleteSubAddress(branchId)).unwrap();
      toast.success("Xóa chi nhánh thành công!");
      if (user?.id) {
        dispatch(searchSubAddresses({ shopId: user.id }));
      }
    } catch (error: unknown) {
      console.error("Delete branch failed:", error);
      handleContextualError(error, "delete");
    }
  };

  if (subAddressLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách chi nhánh...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="space-y-6">
        {/* ✅ Hiển thị error nếu có */}
        {subAddressError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">
              Lỗi: {subAddressError.message}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Quản lý chi nhánh
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Thêm và quản lý các chi nhánh của cửa hàng
            </p>
          </div>
          <button
            onClick={() => {
              setEditingBranch(null);
              setShowBranchModal(true);
            }}
            disabled={subAddressCreating}
            className="flex items-center space-x-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-300 transition-all duration-200 font-medium disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            <span>
              {subAddressCreating ? "Đang thêm..." : "Thêm chi nhánh"}
            </span>
          </button>
        </div>

        {subAddresses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có chi nhánh nào
            </h3>
            <p className="text-gray-600">
              Hãy thêm chi nhánh đầu tiên của cửa hàng bạn
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subAddresses.map((branch) => (
              <div
                key={branch.id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-white"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {branch.name}
                      </h4>
                      {branch.is_default && (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          Mặc định
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingBranch(branch);
                        setShowBranchModal(true);
                      }}
                      disabled={subAddressUpdating}
                      className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg disabled:opacity-50 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBranch(branch.id)}
                      disabled={subAddressDeleting}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {branch.address_name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">
                      +84 {branch.phone}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Branch Modal */}
      {showBranchModal && (
        <BranchModal
          branch={editingBranch}
          onClose={() => setShowBranchModal(false)}
          onSave={(branchData) => {
            if (editingBranch) {
              handleUpdateBranch(editingBranch.id, branchData);
            } else {
              handleCreateBranch(branchData);
            }
            setShowBranchModal(false);
          }}
          creating={subAddressCreating}
          updating={subAddressUpdating}
        />
      )}
    </div>
  );
};

// ✅ Branch Modal Component (giống như code cũ)
interface BranchModalProps {
  branch: SubAddress | null;
  onClose: () => void;
  onSave: (data: Omit<SubAddress, "id" | "shop_id">) => void;
  creating: boolean;
  updating: boolean;
}

const BranchModal: React.FC<BranchModalProps> = ({
  branch,
  onClose,
  onSave,
  creating,
  updating,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address_name: "",
    is_default: false,
  });

  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name,
        phone: branch.phone.toString(),
        address_name: branch.address_name,
        is_default: branch.is_default,
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        address_name: "",
        is_default: false,
      });
    }
  }, [branch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      phone: formData.phone,
      address_name: formData.address_name,
      is_default: formData.is_default,
    });
  };

  const isLoading = creating || updating;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {branch ? "Chỉnh sửa chi nhánh" : "Thêm chi nhánh mới"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên chi nhánh *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="VD: Chi nhánh quận 1"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="0123456789"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ *
            </label>
            <textarea
              value={formData.address_name}
              onChange={(e) =>
                setFormData({ ...formData, address_name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 h-24 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Nhập địa chỉ chi tiết..."
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) =>
                  setFormData({ ...formData, is_default: e.target.checked })
                }
                className="w-5 h-5 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <span className="text-sm font-medium text-gray-700">
                Đặt làm chi nhánh mặc định
              </span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
              disabled={isLoading}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-300 transition-all duration-200 font-medium disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading
                ? branch
                  ? "Đang cập nhật..."
                  : "Đang thêm..."
                : branch
                ? "Cập nhật"
                : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopBranches;
