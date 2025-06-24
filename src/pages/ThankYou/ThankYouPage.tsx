// pages/ThankYouPage.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppointmentStatus } from "@/types/enums";

interface BookingData {
  id: string;
  serviceName: string;
  servicePrice: number;
  startTime: string;
  notes: string;
  status: AppointmentStatus;
}

const ThankYouPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy dữ liệu từ state được pass từ BookingPage
  const bookingData = location.state as BookingData;

  // Nếu không có data, redirect về home
  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Không tìm thấy thông tin cuộc hẹn
          </p>
          <button
            onClick={() => navigate("/app/home")}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Format thời gian
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const time = date.toLocaleTimeString("vi-VN", timeOptions);
    const formattedDate = date.toLocaleDateString("vi-VN", dateOptions);

    return `${time} - ${formattedDate}`;
  };

  // Format trạng thái
  const getStatusText = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.NoProgress:
        return "Chưa thực hiện";
      case AppointmentStatus.InProgress:
        return "Đang thực hiện";
      case AppointmentStatus.Finish:
        return "Đã hoàn thành";
      case AppointmentStatus.Cancel:
        return "Đã hủy";
      default:
        return "Chưa xác định";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header với animation */}
          <div className="bg-gradient-to-r from-teal-500 to-green-500 p-8 text-center text-white">
            <div className="animate-bounce text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold mb-2">
              Cảm ơn bạn đã đặt lịch hẹn!
            </h1>
            <p className="text-teal-100 text-lg">
              Chúng tôi rất vui mừng được chào đón bạn và thú cưng của mình tại{" "}
              <span className="font-semibold">Pet Care Center</span>
            </p>
          </div>

          {/* Thông tin cuộc hẹn */}
          <div className="p-8">
            <div className="flex items-center mb-6">
              <span className="text-2xl mr-3">🐾</span>
              <h2 className="text-2xl font-bold text-gray-800">
                Thông tin cuộc hẹn của bạn:
              </h2>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                <div className="text-teal-600 mr-3 mt-1">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Dịch vụ:</span>
                  <p className="text-gray-900 text-lg">
                    {bookingData.serviceName}
                  </p>
                  <p className="text-teal-600 font-semibold">
                    {bookingData.servicePrice.toLocaleString()} đ
                  </p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                <div className="text-teal-600 mr-3 mt-1">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">
                    Thời gian:
                  </span>
                  <p className="text-gray-900 text-lg">
                    {formatDateTime(bookingData.startTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                <div className="text-teal-600 mr-3 mt-1">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Địa điểm:</span>
                  <p className="text-gray-900">123 Đường ABC, Quận 1, TP.HCM</p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                <div className="text-teal-600 mr-3 mt-1">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">
                    Trạng thái:
                  </span>
                  <p className="text-gray-900">
                    {getStatusText(bookingData.status)}
                  </p>
                </div>
              </div>

              {bookingData.notes && (
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <div className="text-teal-600 mr-3 mt-1">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Ghi chú:
                    </span>
                    <p className="text-gray-900">{bookingData.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Lưu ý */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">⏰</span>
                <h3 className="text-lg font-semibold text-amber-800">Lưu ý:</h3>
              </div>
              <ul className="text-amber-700 space-y-2">
                <li>
                  • Vui lòng đến đúng giờ để trải nghiệm dịch vụ một cách tốt
                  nhất.
                </li>
                <li>
                  • Nếu có bất kỳ thay đổi nào, bạn có thể chỉnh sửa hoặc hủy
                  lịch trong phần "Lịch hẹn của tôi".
                </li>
              </ul>
            </div>

            {/* Cảm ơn */}
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">💌</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Chúng tôi rất mong được gặp bạn và thú cưng của bạn!
              </h3>
              <p className="text-gray-600">
                Nếu bạn cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi qua{" "}
                <span className="font-semibold text-teal-600">
                  0901 234 567
                </span>{" "}
                hoặc{" "}
                <span className="font-semibold text-teal-600">
                  support@petcare.com
                </span>
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/app/home")}
                className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center justify-center space-x-2"
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Quay lại trang chủ</span>
              </button>
              <button
                onClick={() => navigate("/app/appointments")}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2"
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>Xem chi tiết cuộc hẹn</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
