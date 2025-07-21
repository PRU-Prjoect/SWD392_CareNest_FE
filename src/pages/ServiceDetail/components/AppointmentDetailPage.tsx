// pages/AppointmentDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { getAppointmentById } from "@/store/slices/appointmentSlice";
import { getAllServiceAppointments } from "@/store/slices/serviceAppointmentSlice";
import { getServiceById } from "@/store/slices/serviceSlice";
import { getShopById } from "@/store/slices/shopSlice";
import { AppointmentStatus } from "@/types/enums";

interface AppointmentData {
  id: string;
  customer_id: string;
  status: AppointmentStatus;
  notes: string;
  start_time: string;
  location_type?: string;
  end_time?: string;
}

// Define interfaces for service appointment data
interface ServiceAppointment {
  appointment_id: string;
  service_id: string;
}

// Define the shape of data returned from API
interface ServiceData {
  id: string;
  name: string;
  price?: number;
  shop_id: string;
  // other properties from API might be here
}

interface ServiceDetail {
  id: string;
  name: string;
  price: number;
  shop_id: string;
}

interface ShopDetail {
  id: string;
  name: string;
  address: string;
  phone: string;
}

const AppointmentDetailPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  const [services, setServices] = useState<ServiceDetail[]>([]);
  const [shop, setShop] = useState<ShopDetail | null>(null);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (!appointmentId) {
        setError("Không tìm thấy mã cuộc hẹn");
        setLoading(false);
        return;
      }

      try {
        // Fetch appointment data
        const appointmentResult = await dispatch(getAppointmentById(appointmentId)).unwrap();
        const appointmentData = appointmentResult.data;
        setAppointment(appointmentData);

        // Fetch related service appointments
        const serviceAppointmentsResult = await dispatch(
          getAllServiceAppointments({ appointmentId: appointmentId })
        ).unwrap();
        
        // Ensure serviceAppointmentsResult.data is treated as an array of ServiceAppointment
        const serviceAppointments = Array.isArray(serviceAppointmentsResult.data) 
          ? serviceAppointmentsResult.data 
          : [];

        // Fetch service details and shop info
        const servicePromises = serviceAppointments.map(
          async (sa: ServiceAppointment) => {
            const serviceResult = await dispatch(
              getServiceById(sa.service_id)
            ).unwrap();
            return serviceResult.data;
          }
        );

        const serviceDetailsFromApi = await Promise.all(servicePromises);
        
        // Transform service data to match ServiceDetail interface
        const transformedServices: ServiceDetail[] = serviceDetailsFromApi.map((service: ServiceData) => ({
          id: service.id,
          name: service.name,
          price: service.price ?? 0, // Default to 0 if price is undefined
          shop_id: service.shop_id
        }));
        
        setServices(transformedServices);

        // If we have services, get shop details from the first service
        if (transformedServices.length > 0) {
          const shopId = transformedServices[0].shop_id;
          const shopResult = await dispatch(getShopById(shopId)).unwrap();
          
          // Use type assertion after checking the shape
          const shopData = shopResult.data as unknown as {
            id?: string;
            name?: string;
            address?: string;
            phone?: string;
          };
          
          // Log the actual shape of the data for debugging
          console.log('Shop data from API:', shopData);
          
          // Use a more defensive approach to extract shop data
          setShop({
            id: shopData?.id ?? '',
            name: shopData?.name ?? '',
            address: shopData?.address ?? 'Chưa cập nhật địa chỉ',
            phone: shopData?.phone ?? ''
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching appointment details:", err);
        setError("Có lỗi xảy ra khi tải thông tin cuộc hẹn");
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [appointmentId, dispatch]);

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

  // Get status color
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.NoProgress:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case AppointmentStatus.InProgress:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case AppointmentStatus.Finish:
        return "bg-green-100 text-green-800 border-green-200";
      case AppointmentStatus.Cancel:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin cuộc hẹn...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {error || "Không tìm thấy thông tin cuộc hẹn"}
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

  const totalAmount = services.reduce((sum, service) => sum + service.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-green-500 p-8 text-center text-white">
            <div className="text-6xl mb-4">📋</div>
            <h1 className="text-3xl font-bold mb-2">
              Chi tiết cuộc hẹn
            </h1>
            <p className="text-teal-100 text-lg">
              Mã cuộc hẹn: <span className="font-semibold">#{appointment.id}</span>
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
              {/* Dịch vụ */}
              {services.map(service => (
                <div key={service.id} className="flex items-start p-4 bg-gray-50 rounded-lg">
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
                      {service.name}
                    </p>
                    <p className="text-teal-600 font-semibold">
                      {service.price.toLocaleString()} đ
                    </p>
                  </div>
                </div>
              ))}

              {/* Tổng tiền */}
              <div className="flex items-start p-4 bg-teal-50 rounded-lg">
                <div className="text-teal-600 mr-3 mt-1">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Tổng tiền:</span>
                  <p className="text-teal-600 font-bold text-xl">
                    {totalAmount.toLocaleString()} đ
                  </p>
                </div>
              </div>

              {/* Thời gian */}
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
                    {formatDateTime(appointment.start_time)}
                  </p>
                </div>
              </div>

              {/* Địa điểm */}
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
                  <p className="text-gray-900">
                    {shop ? shop.address : "Chưa có thông tin địa chỉ"}
                  </p>
                  {shop && (
                    <p className="text-gray-600 text-sm">
                      <span className="font-semibold">{shop.name}</span> • {shop.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Trạng thái */}
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
                  <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ml-2 ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </p>
                </div>
              </div>

              {/* Ghi chú */}
              {appointment.notes && (
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
                    <p className="text-gray-900">{appointment.notes}</p>
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
                  • Nếu có bất kỳ thay đổi nào, bạn có thể liên hệ với cửa hàng
                  qua số điện thoại được cung cấp.
                </li>
              </ul>
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
              
              {appointment.status !== AppointmentStatus.Cancel && (
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Quản lý cuộc hẹn</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailPage; 