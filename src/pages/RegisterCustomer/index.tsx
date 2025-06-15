// pages/RegisterCustomer/index.tsx
import { useEffect, useState } from "react";
import { User, Calendar, Users, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import {
  registerCustomer,
  resetRegisterCustomerState,
} from "@/store/slices/registerCustomerSlice"; // ✅ Sử dụng registerCustomerSlice
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function RegisterCustomerPage() {
  const [fullName, setFullName] = useState("");
  const [sex, setSex] = useState("");
  const [birthday, setBirthday] = useState("");
  const [errors, setErrors] = useState({
    fullName: "",
    sex: "",
    birthday: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Lấy account data từ navigation state
  const accountData = location.state?.accountData;

  // Lấy state từ Redux store
  const { loading, success, error } = useSelector(
    (state: RootState) => state.registerCustomer // ✅ Sử dụng registerCustomer state
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
      dispatch(resetRegisterCustomerState());
    };
  }, [dispatch]);

  // Xử lý khi tạo customer profile thành công
  useEffect(() => {
    if (success) {
      toast.success("Tạo hồ sơ thành công! Bạn có thể đăng nhập ngay bây giờ.");
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

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      sex: "",
      birthday: "",
    };
    let isValid = true;

    // Validate full name
    if (!fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống";
      isValid = false;
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Họ và tên phải có ít nhất 2 ký tự";
      isValid = false;
    }

    // Validate sex
    if (!sex) {
      newErrors.sex = "Vui lòng chọn giới tính";
      isValid = false;
    }

    // Validate birthday
    if (!birthday) {
      newErrors.birthday = "Vui lòng chọn ngày sinh";
      isValid = false;
    } else {
      const selectedDate = new Date(birthday);
      const today = new Date();
      if (selectedDate >= today) {
        newErrors.birthday = "Ngày sinh phải trước ngày hôm nay";
        isValid = false;
      }
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
    const account_id = accountData.id; // hoặc accountData.account_id tùy thuộc vào response structure

    // Format birthday to ISO string
    const birthdayISO = new Date(birthday).toISOString();

    // Gửi request tạo customer profile
    const customerData = {
      account_id: account_id,
      full_name: fullName.trim(),
      gender: sex,
      birthday: birthdayISO,
    };

    try {
      const result = await dispatch(registerCustomer(customerData));

      if (registerCustomer.fulfilled.match(result)) {
        console.log("✅ Tạo customer profile thành công:", result.payload);
      } else if (registerCustomer.rejected.match(result)) {
        console.error("❌ Tạo customer profile thất bại:", result.payload);
      }
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      toast.error("Có lỗi không mong muốn xảy ra");
    }
  };

  // Lấy ngày hiện tại để làm max date cho birthday
  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
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
        <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg border">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Hoàn tất đăng ký
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Bước 2: Tạo hồ sơ cá nhân cho{" "}
            <strong>{accountData.username}</strong>
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Ô nhập họ và tên */}
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Họ và tên"
                className={`w-full px-4 py-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.fullName
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:ring-[#2A9D8F]/20 focus:border-[#2A9D8F]"
                }`}
                disabled={loading}
              />
              <User className="absolute top-3.5 right-3 w-5 h-5 text-gray-400" />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Ô chọn giới tính */}
            <div className="relative">
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
                  errors.sex
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:ring-[#2A9D8F]/20 focus:border-[#2A9D8F]"
                }`}
                disabled={loading}
              >
                <option value="" disabled>
                  Chọn giới tính
                </option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
              <Users className="absolute top-3.5 right-3 w-5 h-5 text-gray-400 pointer-events-none" />
              {errors.sex && (
                <p className="text-red-500 text-xs mt-1">{errors.sex}</p>
              )}
            </div>

            {/* Ô chọn ngày sinh */}
            <div className="relative">
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                max={getCurrentDate()}
                className={`w-full px-4 py-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.birthday
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:ring-[#2A9D8F]/20 focus:border-[#2A9D8F]"
                }`}
                disabled={loading}
              />
              <Calendar className="absolute top-3.5 right-3 w-5 h-5 text-gray-400 pointer-events-none" />
              {errors.birthday && (
                <p className="text-red-500 text-xs mt-1">{errors.birthday}</p>
              )}
            </div>

            {/* Nút hoàn tất */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#2A9D8F] hover:bg-[#228B7E] text-white shadow-md hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Đang tạo hồ sơ...</span>
                </>
              ) : (
                <span>Hoàn tất đăng ký</span>
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
