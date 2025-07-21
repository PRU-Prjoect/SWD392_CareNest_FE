// pages/BookingPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { createAppointment } from "@/store/slices/appointmentSlice";
import { createServiceAppointment } from "@/store/slices/serviceAppointmentSlice";
import { getServiceById } from "@/store/slices/serviceSlice";
import { AppointmentStatus } from "@/types/enums";
import DateTimePicker from "@/components/DateTimePicker/DateTimePicker";

// ✅ Type guard để kiểm tra response type
interface CreateAppointmentResponse {
  id: string;
  customer_id: string;
  status: AppointmentStatus;
  notes: string;
  start_time: string;
}

const isCreateAppointmentResponse = (
  payload: any
): payload is CreateAppointmentResponse => {
  return (
    payload &&
    typeof payload === "object" &&
    "id" in payload &&
    "customer_id" in payload
  );
};

const BookingPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Lấy thông tin user từ auth state
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const { currentService, loading: serviceLoading } = useSelector(
    (state: RootState) => state.service
  );

  const { creating, createError } = useSelector(
    (state: RootState) => state.appointment
  );

  // ✅ Thêm state cho service appointment
  const {
    creating: creatingServiceAppointment,
    createError: serviceAppointmentError,
  } = useSelector((state: RootState) => state.service_appointment);

  const [formData, setFormData] = useState({
    notes: "",
    start_time: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // ✅ Kiểm tra authentication
  useEffect(() => {
    if (!isAuthenticated || !user) {
      console.warn("User not authenticated, redirecting to login");
      navigate("/login");
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch service data khi component mount
  useEffect(() => {
    if (serviceId) {
      dispatch(getServiceById(serviceId));
    }
  }, [dispatch, serviceId]);

  // ✅ Early return nếu chưa auth
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            Đang xác thực...
          </h2>
          <p className="text-gray-500 mt-2">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.start_time) {
      errors.start_time = "Vui lòng chọn thời gian bắt đầu";
    } else {
      const selectedTime = new Date(formData.start_time);
      const now = new Date();
      if (selectedTime <= now) {
        errors.start_time = "Thời gian bắt đầu phải sau thời điểm hiện tại";
      }
    }

    if (!formData.notes.trim()) {
      errors.notes = "Vui lòng nhập ghi chú cho cuộc hẹn";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!currentService) {
      alert("Không tìm thấy thông tin dịch vụ!");
      return;
    }

    // ✅ Kiểm tra authentication
    if (!isAuthenticated || !user?.id || !serviceId) {
      alert("Vui lòng đăng nhập để đặt lịch hẹn!");
      navigate("/login");
      return;
    }

    // ✅ Không cần tạo appointmentId trước nữa, để server tự generate
    const appointmentData = {
      id: crypto.randomUUID(), // ✅ Vẫn cần gửi ID để server biết structure
      customer_id: user.id,
      status: AppointmentStatus.NoProgress,
      notes: formData.notes,
      start_time: new Date(formData.start_time).toISOString(),
    };

    console.log("📤 Submitting appointment data:", {
      ...appointmentData,
      customer_info: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

    try {
      // ✅ Tạo appointment trước và lấy response object
      const appointmentResult = await dispatch(
        createAppointment(appointmentData)
      );

      if (
        appointmentResult.type === "appointment/create/fulfilled" &&
        appointmentResult.payload
      ) {
        // ✅ Sử dụng type guard để kiểm tra kiểu dữ liệu
        if (isCreateAppointmentResponse(appointmentResult.payload)) {
          const createdAppointment = appointmentResult.payload;
          console.log(
            "✅ Appointment created successfully:",
            createdAppointment
          );

          // ✅ Sử dụng ID thật từ response để tạo service appointment
          const serviceAppointmentData = {
            id: crypto.randomUUID(),
            service_id: serviceId,
            appointment_id: createdAppointment.id, // ✅ Giờ TypeScript biết chắc chắn có thuộc tính id
          };

          console.log(
            "📤 Submitting service appointment data:",
            serviceAppointmentData
          );

          const serviceAppointmentResult = await dispatch(
            createServiceAppointment(serviceAppointmentData)
          );

          if (
            serviceAppointmentResult.type ===
            "serviceAppointment/create/fulfilled"
          ) {
            console.log("✅ Service appointment created successfully");

            // Tính giá cuối cùng sau giảm giá
            const finalPrice =
              currentService.discount_percent > 0
                ? (currentService.price ?? 0 *
                    (100 - currentService.discount_percent)) /
                  100
                : currentService.price ?? 0;

            // ✅ Chuẩn bị data để pass sang ThankYouPage với ID thật
            const bookingData = {
              id: createdAppointment.id, // ✅ Sử dụng ID thật từ server
              serviceName: currentService.name,
              servicePrice: finalPrice,
              startTime: createdAppointment.start_time, // ✅ Sử dụng start_time từ server
              notes: createdAppointment.notes, // ✅ Sử dụng notes từ server
              status: createdAppointment.status, // ✅ Sử dụng status từ server
              customerInfo: {
                name: user.username || user.name || "Khách hàng",
                email: user.email,
              },
              // ✅ Thông tin service appointment
              serviceAppointmentId: serviceAppointmentData.id,
              // ✅ Thêm thông tin chi tiết appointment từ server
              appointmentDetails: {
                customer_id: createdAppointment.customer_id,
                created_at: new Date().toISOString(), // Hoặc từ response nếu có
              },
            };

            console.log("✅ Booking completed successfully:", {
              appointmentId: createdAppointment.id,
              serviceAppointmentId: serviceAppointmentData.id,
              customerInfo: bookingData.customerInfo,
            });

            // Navigate đến ThankYouPage
            navigate("/app/thank-you", {
              state: bookingData,
            });
          } else {
            console.error("❌ Service appointment creation failed");
            // ✅ Có thể rollback appointment nếu cần
            alert("Có lỗi xảy ra khi tạo liên kết dịch vụ. Vui lòng thử lại!");
          }
        } else {
          console.error("❌ Invalid appointment response format");
          alert("Phản hồi từ server không hợp lệ. Vui lòng thử lại!");
        }
      } else {
        console.error("❌ Appointment creation failed");
        // Error sẽ được hiển thị thông qua createError state
      }
    } catch (error) {
      console.error("❌ Booking error:", error);
      alert("Có lỗi không mong muốn xảy ra. Vui lòng thử lại!");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Loading state khi đang tải thông tin service
  if (serviceLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Đang tải...</h2>
          <p className="text-gray-500 mt-2">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  // Error state khi không tìm thấy service
  if (!currentService) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
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
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy dịch vụ
          </h2>
          <p className="text-gray-600 mb-6">
            Dịch vụ bạn muốn đặt không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={handleBack}
            className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Tính giá cuối cùng sau giảm giá
  const finalPrice =
    currentService.discount_percent > 0
      ? ((currentService.price ?? 0) * (100 - currentService.discount_percent)) / 100
      : currentService.price ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header với thông tin user */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="font-medium">Quay lại</span>
            </button>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-900">
                Đặt lịch dịch vụ
              </h1>
              <p className="text-sm text-gray-500">
                Đặt lịch cho: {user.username || user.name}
              </p>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Service info */}
          <div className="p-6 bg-gradient-to-r from-teal-50 to-blue-50 border-b">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h4M7 15h10"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {currentService.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  {currentService.discount_percent > 0 ? (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        {currentService.price?.toLocaleString()} đ
                      </span>
                      <span className="text-xl font-bold text-red-600">
                        {finalPrice?.toLocaleString()} đ
                      </span>
                      <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                        -{currentService.discount_percent}%
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-teal-700">
                      {currentService.price?.toLocaleString()} đ
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Booking form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Start time */}
              {/* ✅ Custom DateTime Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian bắt đầu <span className="text-red-500">*</span>
                </label>
                <DateTimePicker
                  value={formData.start_time}
                  onChange={(value) =>
                    setFormData({ ...formData, start_time: value })
                  }
                  placeholder="Chọn ngày và giờ cho cuộc hẹn"
                  error={formErrors.start_time}
                  minDate={new Date()} // Không cho chọn ngày trong quá khứ
                  className="w-full"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                    formErrors.notes ? "border-red-300" : "border-gray-300"
                  }`}
                  rows={4}
                  placeholder="Nhập ghi chú cho cuộc hẹn (yêu cầu đặc biệt, thông tin thú cưng...)"
                  required
                />
                {formErrors.notes && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.notes}
                  </p>
                )}
              </div>

              {/* ✅ Hiển thị trạng thái mặc định (không cho chọn) */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Chưa thực hiện
                  </span>
                </div>
              </div>

              {/* ✅ Error messages - hiển thị cả 2 loại error */}
              {(createError || serviceAppointmentError) && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex">
                    <svg
                      className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0"
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
                      <h4 className="text-sm font-medium text-red-800">
                        Đặt lịch thất bại
                      </h4>
                      {createError && (
                        <p className="text-sm text-red-700 mt-1">
                          Tạo cuộc hẹn: {createError.message}
                        </p>
                      )}
                      {serviceAppointmentError && (
                        <p className="text-sm text-red-700 mt-1">
                          Liên kết dịch vụ: {serviceAppointmentError.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ✅ Action buttons với loading state */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={creating || creatingServiceAppointment}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={
                    creating ||
                    creatingServiceAppointment ||
                    !currentService?.is_active
                  }
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  {(creating || creatingServiceAppointment) && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  )}
                  <span>
                    {creating
                      ? "Đang tạo cuộc hẹn..."
                      : creatingServiceAppointment
                      ? "Đang liên kết dịch vụ..."
                      : "Xác nhận đặt lịch"}
                  </span>
                </button>
              </div>

              {!currentService?.is_active && (
                <p className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg">
                  ⚠️ Dịch vụ đang tạm dừng, không thể đặt lịch
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
