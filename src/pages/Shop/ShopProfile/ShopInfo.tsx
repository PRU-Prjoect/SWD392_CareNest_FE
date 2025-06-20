// pages/shop/profile/ShopInfo.tsx
import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { Clock } from "lucide-react";
import { getLoginAccount } from "@/store/slices/accountSlice";
import { getShopById, updateShop } from "@/store/slices/shopSlice";

interface Account {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  img_url?: string;
}

interface Shop {
  account_id: string;
  name: string;
  description: string;
  status: boolean;
  working_day: string[];
}

const ShopInfo: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const {
    currentAccount,
    loadingLogin,
    error: accountError,
  } = useAppSelector((state) => state.account);
  const {
    currentShop,
    loading: shopLoading,
    updating: shopUpdating,
    error: shopError,
  } = useAppSelector((state) => state.shop);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    working_day: [] as string[],
  });

  // ✅ Fetch data khi component mount
  useEffect(() => {
    if (user?.id) {
      dispatch(getLoginAccount());
      dispatch(getShopById(user.id));
    }
  }, [dispatch, user?.id]);

  // ✅ Update form khi có data từ API
  useEffect(() => {
    if (currentShop) {
      setFormData({
        name: currentShop.name,
        description: currentShop.description,
        working_day: currentShop.working_day || [],
      });
    }
  }, [currentShop]);

  const workingDaysOptions = [
    { key: "Monday", label: "Thứ 2" },
    { key: "Tuesday", label: "Thứ 3" },
    { key: "Wednesday", label: "Thứ 4" },
    { key: "Thursday", label: "Thứ 5" },
    { key: "Friday", label: "Thứ 6" },
    { key: "Saturday", label: "Thứ 7" },
    { key: "Sunday", label: "Chủ nhật" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      await dispatch(
        updateShop({
          account_id: user.id,
          name: formData.name,
          description: formData.description,
          status: currentShop?.status ?? true,
          working_day: formData.working_day,
        })
      ).unwrap();

      // Refresh shop data after update
      dispatch(getShopById(user.id));
    } catch (error) {
      console.error("Update shop failed:", error);
    }
  };

  const toggleWorkingDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      working_day: prev.working_day.includes(day)
        ? prev.working_day.filter((d) => d !== day)
        : [...prev.working_day, day],
    }));
  };

  if (loadingLogin || shopLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ✅ Hiển thị error nếu có */}
        {(shopError || accountError) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">
              Lỗi: {shopError?.message || accountError?.message}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tên cửa hàng *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-lg"
                required
                disabled={shopUpdating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Email (Không thể thay đổi)
              </label>
              <input
                type="email"
                value={currentAccount?.email || ""}
                disabled
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100 text-gray-500 text-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Mô tả cửa hàng
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Mô tả về cửa hàng của bạn..."
              disabled={shopUpdating}
            />
          </div>
        </div>

        {/* ✅ Ngày làm việc */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            <Clock className="w-5 h-5 inline mr-2" />
            Ngày làm việc
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {workingDaysOptions.map(({ key, label }) => (
              <label
                key={key}
                className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.working_day.includes(key)
                    ? "border-teal-500 bg-teal-50 text-teal-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-teal-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.working_day.includes(key)}
                  onChange={() => toggleWorkingDay(key)}
                  className="sr-only"
                  disabled={shopUpdating}
                />
                <span className="text-sm font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={shopUpdating}
            className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-300 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {shopUpdating ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShopInfo;
