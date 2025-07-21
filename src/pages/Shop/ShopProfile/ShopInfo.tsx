// pages/shop/profile/ShopInfo.tsx
import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { Clock } from "lucide-react";
import { getLoginAccount } from "@/store/slices/accountSlice";
import { getShopById, updateShop } from "@/store/slices/shopSlice";

// ✅ Định nghĩa interface mới cho cấu trúc ngày làm việc
interface WorkingDayItem {
  day: string;
  en: string;
  selected: boolean;
  startTime: string;
  endTime: string;
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
    phone: "", // ✅ Thêm phone state
  });

  // ✅ Cập nhật cấu trúc workingDays để bao gồm giờ làm việc
  const [workingDays, setWorkingDays] = useState<WorkingDayItem[]>([
    { day: "Thứ 2", en: "Monday", selected: false, startTime: "08:00", endTime: "17:00" },
    { day: "Thứ 3", en: "Tuesday", selected: false, startTime: "08:00", endTime: "17:00" },
    { day: "Thứ 4", en: "Wednesday", selected: false, startTime: "08:00", endTime: "17:00" },
    { day: "Thứ 5", en: "Thursday", selected: false, startTime: "08:00", endTime: "17:00" },
    { day: "Thứ 6", en: "Friday", selected: false, startTime: "08:00", endTime: "17:00" },
    { day: "Thứ 7", en: "Saturday", selected: false, startTime: "08:00", endTime: "17:00" },
    { day: "Chủ nhật", en: "Sunday", selected: false, startTime: "08:00", endTime: "17:00" },
  ]);

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
        phone: currentShop.phone || "", // ✅ Cập nhật phone từ API
      });

      // ✅ Parse chuỗi working_day từ API
      if (currentShop.working_day && currentShop.working_day.length > 0) {
        const updatedWorkingDays = [...workingDays];
        
        currentShop.working_day.forEach(dayString => {
          // Parse chuỗi định dạng "Thứ 2 (Monday): 08:00 - 17:00"
          const regex = /^(.+) \((.+)\): (\d{2}:\d{2}) - (\d{2}:\d{2})$/;
          const simpleRegex = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/;
          
          if (regex.test(dayString)) {
            const matches = dayString.match(regex);
            if (matches) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const [_, viDay, enDay, startTime, endTime] = matches;
              
              // Tìm và cập nhật ngày tương ứng
              const dayIndex = updatedWorkingDays.findIndex(d => 
                d.en === enDay || d.day === viDay
              );
              
              if (dayIndex !== -1) {
                updatedWorkingDays[dayIndex] = {
                  ...updatedWorkingDays[dayIndex],
                  selected: true,
                  startTime,
                  endTime
                };
              }
            }
          } else if (simpleRegex.test(dayString)) {
            // Trường hợp format cũ chỉ có tên tiếng Anh
            const dayIndex = updatedWorkingDays.findIndex(d => d.en === dayString);
            if (dayIndex !== -1) {
              updatedWorkingDays[dayIndex] = {
                ...updatedWorkingDays[dayIndex],
                selected: true
              };
            }
          }
        });
        
        setWorkingDays(updatedWorkingDays);
      }
    }
  }, [currentShop]);

  // ✅ Handler cho working days
  const handleWorkingDayChange = (index: number) => {
    setWorkingDays(days => days.map((day, i) => 
      i === index ? { ...day, selected: !day.selected } : day
    ));
  };

  // ✅ Handler cho thay đổi thời gian
  const handleTimeChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    setWorkingDays(days => days.map((day, i) => 
      i === index ? { ...day, [field]: value } : day
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    // ✅ Format working_day array để gửi lên API
    const formattedWorkingDays = workingDays
      .filter(day => day.selected)
      .map(day => `${day.day} (${day.en}): ${day.startTime} - ${day.endTime}`);

    try {
      await dispatch(
        updateShop({
          account_id: user.id,
          name: formData.name,
          description: formData.description,
          status: currentShop?.status ?? true,
          working_day: formattedWorkingDays,
          phone: formData.phone, // ✅ Thêm phone vào request
        })
      ).unwrap();

      // Refresh shop data after update
      dispatch(getShopById(user.id));
    } catch (error) {
      console.error("Update shop failed:", error);
    }
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
            
            {/* ✅ Thêm trường số điện thoại */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-lg"
                placeholder="Số điện thoại liên hệ"
                disabled={shopUpdating}
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

        {/* ✅ Ngày và giờ làm việc - UI được cập nhật với thiết kế card */}
        <div>
          <label className="block text-lg font-medium text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-teal-600" />
            Ngày và giờ làm việc
          </label>
          
          {/* Grid Layout cho các ngày trong tuần */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {workingDays.map((day, index) => (
              <div 
                key={day.en} 
                className={`rounded-xl shadow-sm border-2 transition-all duration-200 overflow-hidden
                  ${day.selected 
                    ? 'border-teal-400 bg-gradient-to-br from-teal-50 to-white' 
                    : 'border-gray-200 bg-white opacity-75 hover:border-gray-300'
                  }`}
              >
                {/* Header với tên ngày và checkbox */}
                <div className="px-4 py-3 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${day.selected ? 'bg-teal-500' : 'bg-gray-300'}`}></span>
                    <h3 className="font-medium">{day.day}</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={day.selected}
                      onChange={() => handleWorkingDayChange(index)}
                      className="sr-only"
                      disabled={shopUpdating}
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out
                      ${day.selected ? 'bg-teal-500' : 'bg-gray-200'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out
                        ${day.selected ? 'translate-x-5' : 'translate-x-1'}`}>
                      </div>
                    </div>
                  </label>
                </div>
                
                {/* Body với giờ làm việc */}
                <div className={`px-4 py-3 ${!day.selected && 'opacity-50'}`}>
                  <div className="flex items-center mb-1">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Trạng thái</span>
                    <span className={`ml-auto text-sm font-medium ${day.selected ? 'text-green-600' : 'text-gray-500'}`}>
                      {day.selected ? 'Mở cửa' : 'Đóng cửa'}
                    </span>
                  </div>
                  
                  {day.selected && (
                    <>
                      <div className="flex flex-col space-y-3 mt-3">
                        <div>
                          <label className="flex items-center text-xs text-gray-500 mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Giờ bắt đầu
                          </label>
                          <input
                            type="time"
                            value={day.startTime}
                            onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                            disabled={shopUpdating}
                          />
                        </div>
                        <div>
                          <label className="flex items-center text-xs text-gray-500 mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Giờ kết thúc
                          </label>
                          <input
                            type="time"
                            value={day.endTime}
                            onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                            disabled={shopUpdating}
                          />
                        </div>
                      </div>
                      
                      {/* Summary/Preview */}
                      <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Thời gian làm việc</span>
                          <span className="text-sm font-medium text-teal-700">{day.startTime} - {day.endTime}</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {!day.selected && (
                    <div className="text-center py-3 text-gray-400 italic text-sm">
                      Ngày nghỉ
                    </div>
                  )}
                </div>
              </div>
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
