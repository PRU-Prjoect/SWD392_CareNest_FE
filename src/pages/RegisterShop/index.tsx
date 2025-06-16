import { useEffect, useState } from "react";
import { Store, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import {
  registerShop,
  resetRegisterShopState,
} from "@/store/slices/registerShopSlice";
import { toast } from "react-toastify";

// Danh sách các ngày làm việc
const workingDayOptions = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "Chủ nhật",
];

export default function RegisterShopPage() {
  // ✅ State variables được cập nhật
  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [workingDays, setWorkingDays] = useState<string[]>([]); // ✅ Thêm working days

  // ✅ Validation errors
  const [errors, setErrors] = useState({
    shopName: "",
    shopDescription: "",
    workingDays: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Lấy account data từ navigation state
  const accountData = location.state?.accountData;

  // Lấy state từ Redux store
  const { loading, success, error } = useSelector(
    (state: RootState) => state.registerShop
  );

  // ✅ Kiểm tra nếu không có account data thì redirect về register
  useEffect(() => {
    if (!accountData || !location.state?.fromRegister) {
      toast.error("Vui lòng đăng ký tài khoản trước");
      navigate("/register");
      return;
    }
  }, [accountData, location.state, navigate]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      dispatch(resetRegisterShopState());
    };
  }, [dispatch]);

  // Xử lý khi tạo shop profile thành công
  useEffect(() => {
    if (success) {
      toast.success(
        "Tạo hồ sơ cửa hàng thành công! Bạn có thể đăng nhập ngay bây giờ."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [success, navigate]);

  // Xử lý khi có lỗi từ server
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  // ✅ Handler cho working days
  const handleWorkingDayChange = (day: string) => {
    setWorkingDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const validateForm = () => {
    const newErrors = {
      shopName: "",
      shopDescription: "",
      workingDays: "",
    };
    let isValid = true;

    // Validate shop name
    if (!shopName.trim()) {
      newErrors.shopName = "Tên cửa hàng không được để trống";
      isValid = false;
    } else if (shopName.trim().length < 2) {
      newErrors.shopName = "Tên cửa hàng phải có ít nhất 2 ký tự";
      isValid = false;
    }

    // Validate shop description
    if (!shopDescription.trim()) {
      newErrors.shopDescription = "Mô tả cửa hàng không được để trống";
      isValid = false;
    }

    // Validate working days
    if (workingDays.length === 0) {
      newErrors.workingDays = "Vui lòng chọn ít nhất một ngày làm việc";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form trước khi submit
    if (!validateForm()) {
      return;
    }

    // ✅ Sử dụng account_id từ accountData
    const account_id = accountData.id;

    // ✅ Gửi request theo format API mới
    const shopData = {
      account_id: account_id,
      name: shopName.trim(), // ✅ Đổi từ shop_name
      description: shopDescription.trim(), // ✅ Đổi từ shop_description
      status: true, // ✅ Thêm status
      working_day: workingDays, // ✅ Thêm working_day
    };

    try {
      const result = await dispatch(registerShop(shopData));
      if (registerShop.fulfilled.match(result)) {
        console.log("✅ Tạo shop profile thành công:", result.payload);
      } else if (registerShop.rejected.match(result)) {
        console.error("❌ Tạo shop profile thất bại:", result.payload);
      }
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      toast.error("Có lỗi không mong muốn xảy ra");
    }
  };

  // ✅ Không render nếu không có account data
  if (!accountData) {
    return null;
  }

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
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border">
          <div className="text-center mb-6">
            <Store className="w-12 h-12 text-[#2A9D8F] mx-auto mb-3" />
            <h2 className="text-2xl font-bold mb-2">Hoàn tất đăng ký</h2>
            <p className="text-sm text-gray-600">
              Bước 2: Tạo hồ sơ cửa hàng cho{" "}
              <span className="font-semibold text-[#2A9D8F]">
                {accountData.username}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ✅ Ô nhập tên cửa hàng */}
            <div className="relative">
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Tên cửa hàng"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.shopName
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:ring-[#2A9D8F]/20 focus:border-[#2A9D8F]"
                }`}
                disabled={loading}
              />
              {errors.shopName && (
                <p className="text-red-500 text-xs mt-1">{errors.shopName}</p>
              )}
            </div>

            {/* ✅ Ô nhập mô tả cửa hàng */}
            <div className="relative">
              <textarea
                value={shopDescription}
                onChange={(e) => setShopDescription(e.target.value)}
                placeholder="Mô tả cửa hàng"
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
                  errors.shopDescription
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:ring-[#2A9D8F]/20 focus:border-[#2A9D8F]"
                }`}
                disabled={loading}
              />
              {errors.shopDescription && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.shopDescription}
                </p>
              )}
            </div>

            {/* ✅ Hiển thị thông báo status mặc định */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-green-700">
                  Cửa hàng sẽ được kích hoạt ngay sau khi đăng ký
                </span>
              </div>
            </div>

            {/* ✅ Working days selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày làm việc:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {workingDayOptions.map((day) => (
                  <label
                    key={day}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={workingDays.includes(day)}
                      onChange={() => handleWorkingDayChange(day)}
                      className="rounded border-gray-300 text-[#2A9D8F] focus:ring-[#2A9D8F]"
                      disabled={loading}
                    />
                    <span className="text-sm">{day}</span>
                  </label>
                ))}
              </div>
              {errors.workingDays && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.workingDays}
                </p>
              )}
            </div>

            {/* ✅ Nút hoàn tất */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-[#2A9D8F] text-white hover:bg-[#228B7E] shadow-md hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang tạo hồ sơ...
                </>
              ) : (
                "Hoàn tất đăng ký"
              )}
            </button>
          </form>

          <p className="text-sm text-center mt-6">
            Đã có tài khoản?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#2A9D8F] font-semibold hover:underline transition-all duration-200"
            >
              Đăng nhập ngay!
            </button>
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
          />
        </div>
      </div>
    </div>
  );
}
