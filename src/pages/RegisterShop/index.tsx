// File: src/pages/RegisterPage.tsx (thêm vào form đăng ký)
import { useState } from "react";
import {
  User,
  Home,
  Store,
  Mail,
  Lock,
  Phone,
  MapPin,
  Building,
  Briefcase,
  Clock,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  interface FormData {
    businessName: string;
    businessAddress: string;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
    businessFields: string[]; // Thay vì never[]
    representativeName: string;
    workScheduleType: string;
    allWeekHours: {
      startTime: string;
      endTime: string;
    };
    customSchedule: {
      monday: { isWorking: boolean; startTime: string; endTime: string };
      tuesday: { isWorking: boolean; startTime: string; endTime: string };
      wednesday: { isWorking: boolean; startTime: string; endTime: string };
      thursday: { isWorking: boolean; startTime: string; endTime: string };
      friday: { isWorking: boolean; startTime: string; endTime: string };
      saturday: { isWorking: boolean; startTime: string; endTime: string };
      sunday: { isWorking: boolean; startTime: string; endTime: string };
    };
  }

  type DayKey =
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";

  // Sử dụng interface trong useState
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    businessAddress: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessFields: [] as string[], // Khởi tạo đúng kiểu
    representativeName: "",
    workScheduleType: "",
    allWeekHours: {
      startTime: "08:00",
      endTime: "17:00",
    },
    customSchedule: {
      monday: { isWorking: true, startTime: "08:00", endTime: "17:00" },
      tuesday: { isWorking: true, startTime: "08:00", endTime: "17:00" },
      wednesday: { isWorking: true, startTime: "08:00", endTime: "17:00" },
      thursday: { isWorking: true, startTime: "08:00", endTime: "17:00" },
      friday: { isWorking: true, startTime: "08:00", endTime: "17:00" },
      saturday: { isWorking: true, startTime: "08:00", endTime: "14:00" },
      sunday: { isWorking: false, startTime: "08:00", endTime: "17:00" },
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Danh sách lĩnh vực kinh doanh
  const businessFieldOptions = [
    "Massage",
    "Grooming",
    "Lưu trú",
    "Dịch vụ thú y",
    "Huấn luyện",
    "Chụp ảnh",
    "Tổ chức tiệc",
    "Chăm sóc đặc biệt",
  ];

  // Danh sách các ngày trong tuần
  const daysOfWeek = [
    { key: "monday", label: "Thứ 2" },
    { key: "tuesday", label: "Thứ 3" },
    { key: "wednesday", label: "Thứ 4" },
    { key: "thursday", label: "Thứ 5" },
    { key: "friday", label: "Thứ 6" },
    { key: "saturday", label: "Thứ 7" },
    { key: "sunday", label: "Chủ nhật" },
  ];

  // Xử lý thay đổi checkbox cho lĩnh vực kinh doanh
  const handleBusinessFieldChange = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      businessFields: prev.businessFields.includes(field)
        ? prev.businessFields.filter((f) => f !== field)
        : [...prev.businessFields, field],
    }));
  };

  // Xử lý thay đổi input thông thường
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý thay đổi loại lịch làm việc
  const handleWorkScheduleTypeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      workScheduleType: e.target.value,
    }));
  };

  // Xử lý thay đổi giờ làm việc toàn tuần
  const handleAllWeekHoursChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      allWeekHours: {
        ...prev.allWeekHours,
        [field]: value,
      },
    }));
  };

  // Cập nhật function với đúng kiểu
  const handleCustomScheduleChange = (
    day: DayKey,
    field: "isWorking" | "startTime" | "endTime",
    value: boolean | string
  ) => {
    setFormData((prev) => ({
      ...prev,
      customSchedule: {
        ...prev.customSchedule,
        [day]: {
          ...prev.customSchedule[day],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
  };

  return (
    <div className="min-h-screen flex bg-white relative">
      {/* Icon quay về trang homepage */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 right-4 text-[#2A9D8F] hover:text-[#228B7E] transition-colors duration-200 z-10"
        title="Quay lại trang chính"
      >
        <Home className="w-6 h-6" />
      </button>

      {/* Bên phải: Form đăng ký */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border my-8">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Đăng ký cửa hàng
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Điền thông tin để đăng ký tài khoản doanh nghiệp
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Tên doanh nghiệp/cửa hàng */}
            <div className="relative">
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="Tên doanh nghiệp/Tên cửa hàng"
                className="w-full px-4 py-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent"
                required
              />
              <Store className="absolute top-3.5 right-3 w-5 h-5 text-gray-400" />
            </div>

            {/* Địa chỉ doanh nghiệp */}
            <div className="relative">
              <textarea
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleInputChange}
                placeholder="Địa chỉ đầy đủ (số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                className="w-full px-4 py-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent resize-none"
                rows="3"
                required
              />
              <MapPin className="absolute top-3.5 right-3 w-5 h-5 text-gray-400" />
            </div>

            {/* Số điện thoại */}
            <div className="relative">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Số điện thoại liên hệ chính"
                className="w-full px-4 py-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent"
                required
              />
              <Phone className="absolute top-3.5 right-3 w-5 h-5 text-gray-400" />
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email liên hệ chính"
                className="w-full px-4 py-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent"
                required
              />
              <Mail className="absolute top-3.5 right-3 w-5 h-5 text-gray-400" />
            </div>

            {/* Mật khẩu */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Mật khẩu (ít nhất 8 ký tự)"
                className="w-full px-4 py-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent"
                required
                minLength="8"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3.5 right-3 cursor-pointer text-gray-500"
              >
                <Lock className="w-5 h-5" />
              </div>
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Nhập lại mật khẩu"
                className="w-full px-4 py-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent"
                required
              />
              <div
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-3.5 right-3 cursor-pointer text-gray-500"
              >
                <Lock className="w-5 h-5" />
              </div>
            </div>

            {/* Lĩnh vực kinh doanh */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Briefcase className="w-4 h-4 mr-2" />
                Lĩnh vực kinh doanh (chọn nhiều):
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-lg p-3">
                {businessFieldOptions.map((field) => (
                  <label
                    key={field}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={formData.businessFields.includes(field)}
                      onChange={() => handleBusinessFieldChange(field)}
                      className="rounded border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F]"
                    />
                    <span>{field}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Ngày làm việc */}
            <div className="space-y-4">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Clock className="w-4 h-4 mr-2" />
                Ngày làm việc:
              </label>

              {/* Dropdown chọn loại lịch */}
              <div className="relative">
                <select
                  value={formData.workScheduleType}
                  onChange={handleWorkScheduleTypeChange}
                  className="w-full px-4 py-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent appearance-none bg-white"
                  required
                >
                  <option value="">Chọn loại lịch làm việc</option>
                  <option value="all-week">Toàn bộ các ngày trong tuần</option>
                  <option value="custom">Tùy chỉnh</option>
                </select>
                <ChevronDown className="absolute top-3.5 right-3 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Hiển thị component tương ứng */}
              {formData.workScheduleType === "all-week" && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Giờ làm việc (áp dụng cho tất cả các ngày)
                  </h4>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">
                        Giờ bắt đầu
                      </label>
                      <input
                        type="time"
                        value={formData.allWeekHours.startTime}
                        onChange={(e) =>
                          handleAllWeekHoursChange("startTime", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
                      />
                    </div>
                    <span className="text-gray-500 mt-6">-</span>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">
                        Giờ kết thúc
                      </label>
                      <input
                        type="time"
                        value={formData.allWeekHours.endTime}
                        onChange={(e) =>
                          handleAllWeekHoursChange("endTime", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Ví dụ: 8:00 - 17:00. Muốn tùy chỉnh chi tiết hơn, hãy chọn
                    "Tùy chỉnh" ở trên.
                  </p>
                </div>
              )}

              {formData.workScheduleType === "custom" && (
                <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Tùy chỉnh lịch làm việc theo từng ngày
                  </h4>
                  {daysOfWeek.map((day) => (
                    <div
                      key={day.key}
                      className="flex items-center space-x-3 p-3 bg-white rounded border"
                    >
                      <div className="w-20">
                        <span className="text-sm font-medium text-gray-700">
                          {day.label}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.customSchedule[day.key].isWorking}
                          onChange={(e) =>
                            handleCustomScheduleChange(
                              day.key,
                              "isWorking",
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F]"
                        />
                        <span className="text-xs text-gray-600">Làm việc</span>
                      </div>

                      {formData.customSchedule[day.key].isWorking && (
                        <>
                          <div className="flex-1">
                            <input
                              type="time"
                              value={formData.customSchedule[day.key].startTime}
                              onChange={(e) =>
                                handleCustomScheduleChange(
                                  day.key,
                                  "startTime",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#2A9D8F]"
                            />
                          </div>
                          <span className="text-gray-500 text-sm">-</span>
                          <div className="flex-1">
                            <input
                              type="time"
                              value={formData.customSchedule[day.key].endTime}
                              onChange={(e) =>
                                handleCustomScheduleChange(
                                  day.key,
                                  "endTime",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#2A9D8F]"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tên người đại diện */}
            <div className="relative">
              <input
                type="text"
                name="representativeName"
                value={formData.representativeName}
                onChange={handleInputChange}
                placeholder="Tên người đại diện/Chủ doanh nghiệp"
                className="w-full px-4 py-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] focus:border-transparent"
                required
              />
              <User className="absolute top-3.5 right-3 w-5 h-5 text-gray-400" />
            </div>

            {/* Nút đăng ký */}
            <button
              type="submit"
              className="w-full bg-[#2A9D8F] text-white py-3 rounded-lg hover:bg-[#228B7E] transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              Đăng ký tài khoản
            </button>
          </form>

          <p className="text-sm text-center mt-6">
            <a
              href="/login"
              className="text-[#2A9D8F] font-semibold hover:underline transition-all duration-200"
            >
              Đã có tài khoản? Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>

      {/* Bên trái: Logo + mô tả */}
      <div className="w-1/2 bg-[#E7F3F5] flex flex-col justify-center items-center">
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8 rounded-lg">
          <img
            src="/public/image/Xanh_dương_pastel_Cầu_vồng_Chương_trình_Đọc_viết_Logo-removebg-preview 1.png"
            alt="Logo"
            className="w-full h-auto object-contain max-w-full"
            style={{
              maxWidth: "100%",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              userSelect: "none",
              transform: "scale(1)",
              transformOrigin: "center center",
            }}
          />
        </div>
      </div>
    </div>
  );
}
