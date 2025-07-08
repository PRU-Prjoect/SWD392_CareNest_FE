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

  const bookingData = location.state as BookingData;

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center w-full max-w-md">
          <p className="text-gray-600 mb-4">
            Không tìm thấy thông tin cuộc hẹn
          </p>
          <button
            onClick={() => navigate("/app/home")}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 w-full sm:w-auto"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-h-[95vh] overflow-y-auto">
          {/* Header với animation */}
          <div className="bg-gradient-to-r from-teal-500 to-green-500 p-4 sm:p-6 text-center text-white">
            <div className="animate-bounce text-3xl sm:text-4xl mb-2 sm:mb-4">🎉</div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
              Cảm ơn bạn đã đặt lịch hẹn!
            </h1>
            <p className="text-teal-100 text-sm sm:text-base">
              Cảm ơn bạn đã đặt hàng – chúng tôi rất háo hức được chăm sóc cho thú cưng của bạn!
            </p>
          </div>

          {/* Thông tin cuộc hẹn */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Lưu ý */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center mb-2 sm:mb-3">
                <span className="text-xl sm:text-2xl mr-2 sm:mr-3">⏰</span>
                <h3 className="text-base sm:text-lg font-semibold text-amber-800">Lưu ý:</h3>
              </div>
              <ul className="text-amber-700 space-y-1 sm:space-y-2 text-sm sm:text-base">
                <li>
                  • Vui lòng đến đúng giờ để trải nghiệm dịch vụ một cách tốt nhất.
                </li>
                <li>
                  • Nếu có bất kỳ thay đổi nào, bạn có thể chỉnh sửa hoặc hủy lịch trong phần "Lịch hẹn của tôi".
                </li>
              </ul>
            </div>

            {/* Cảm ơn */}
            <div className="text-center">
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-4">💌</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                Chúng tôi rất mong được gặp bạn và thú cưng của bạn!
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Nếu bạn cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi qua{" "}
                <span className="font-semibold text-teal-600">
                  0919845822
                </span>{" "}
                hoặc{" "}
                <span className="font-semibold text-teal-600">
                  carenest@gmail.com
                </span>
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 sm:gap-4">
              <button
                onClick={() => navigate("/app/home")}
                className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
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
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
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
