import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { getAllServices } from "@/store/slices/serviceSlice";
import { getAllServiceAppointments } from "@/store/slices/serviceAppointmentSlice";
import {
  getAppointmentById, // ✅ Thêm import
  updateAppointment,
} from "@/store/slices/appointmentSlice";
import { getShopById } from "@/store/slices/shopSlice";
import { AppointmentStatus } from "@/types/enums";

interface Pet {
  name: string;
  type: string;
  age: number;
}

interface ServiceOrder {
  id: string; // appointment_id
  customerName: string; // Sẽ cần API customer hoặc mock
  customerPhone: string; // Sẽ cần API customer hoặc mock
  pet: Pet; // Sẽ cần API pet hoặc mock
  services: {
    id: string; // service_id (đổi từ number thành string)
    name: string; // service name
    note: string; // appointment notes
    price: number; // service price
  }[];
  scheduledTime: string; // Parsed từ start_time
  scheduledDate: string; // Parsed từ start_time
  status: "pending" | "in-progress" | "completed" | "cancelled"; // ✅ Bỏ "confirmed"
  totalAmount: number; // Tính từ service prices
  branch: string; // Mock hoặc lấy từ shop info
  createdAt: string; // appointment start_time
  specialNote?: string; // appointment notes
  // ✅ Thêm field mới
  originalAppointment?: {
    id: string;
    customer_id: string;
    status: AppointmentStatus;
    notes: string;
    start_time: string;
  };
}

// Mapping function cho status
const mapAppointmentStatus = (
  status: AppointmentStatus
): ServiceOrder["status"] => {
  switch (status) {
    case AppointmentStatus.NoProgress:
      return "pending";
    case AppointmentStatus.InProgress:
      return "in-progress";
    case AppointmentStatus.Finish:
      return "completed";
    case AppointmentStatus.Cancel:
      return "cancelled";
    default:
      return "pending";
  }
};

const OrderManagement = () => {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Lấy user info từ auth state
  const { user } = useSelector((state: RootState) => state.auth);

  // Redux state
  const { services, loading: servicesLoading } = useSelector(
    (state: RootState) => state.service
  );
  const { serviceAppointments, loading: serviceAppointmentsLoading } =
    useSelector((state: RootState) => state.service_appointment);
  const { appointments, loading: appointmentsLoading } = useSelector(
    (state: RootState) => state.appointment
  );
  const { currentShop, loading: shopLoading } = useSelector(
    (state: RootState) => state.shop
  );

  // ✅ Cập nhật activeTab type
  const [activeTab, setActiveTab] = useState<
    "pending" | "in-progress" | "today" | "completed" | "cancelled" | "all"
  >("pending");

  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch dữ liệu đã được cập nhật
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user?.id) {
        console.log("❌ No user ID found, skipping data fetch");
        setOrders([]);
        setLoading(false);
        return;
      }

      const shopId = user.id;
      setLoading(true);

      try {
        console.log("🚀 Fetching data for shop:", shopId);

        // ✅ Fetch shop info trước tiên
        await dispatch(getShopById(shopId));

        // ✅ Fetch services của shop hiện tại
        const servicesResult = await dispatch(
          getAllServices({ shopId })
        ).unwrap();

        const shopServices = servicesResult.data;

        if (shopServices.length === 0) {
          console.log("ℹ️ No services found for shop:", shopId);
          setOrders([]);
          return;
        }

        // ✅ Lấy service appointments cho tất cả services
        const serviceIds = shopServices.map((service) => service.id);
        const serviceAppointmentPromises = serviceIds.map((serviceId) =>
          dispatch(getAllServiceAppointments({ serviceId })).unwrap()
        );

        const serviceAppointmentResults = await Promise.allSettled(
          serviceAppointmentPromises
        );
        const allServiceAppointments = serviceAppointmentResults
          .filter((result) => result.status === "fulfilled")
          .flatMap((result) => (result as any).value.data);

        if (allServiceAppointments.length === 0) {
          console.log("ℹ️ No service appointments found for shop:", shopId);
          setOrders([]);
          return;
        }

        // ✅ Thay đổi: Lấy appointments chi tiết bằng getAppointmentById
        const appointmentIds = [
          ...new Set(allServiceAppointments.map((sa) => sa.appointment_id)),
        ];

        const appointmentPromises = appointmentIds.map(
          (appointmentId) =>
            dispatch(getAppointmentById(appointmentId)).unwrap() // ✅ Đổi từ getAllAppointments
        );

        const appointmentResults = await Promise.allSettled(
          appointmentPromises
        );
        const allAppointments = appointmentResults
          .filter((result) => result.status === "fulfilled")
          .map((result) => (result as any).value.data); // ✅ Đổi từ flatMap thành map

        // ✅ Transform data thành ServiceOrder format
        const transformedOrders = allAppointments.map((appointment) => {
          const relatedServiceAppointments = allServiceAppointments.filter(
            (sa) => sa.appointment_id === appointment.id
          );

          const relatedServices = relatedServiceAppointments
            .map((sa) => {
              const service = shopServices.find((s) => s.id === sa.service_id);
              return service
                ? {
                    id: service.id,
                    name: service.name,
                    note: appointment.notes || "",
                    price: service.price,
                  }
                : null;
            })
            .filter(Boolean);

          // Parse thời gian
          const startTime = new Date(appointment.start_time);
          const scheduledDate = startTime.toLocaleDateString("vi-VN");
          const scheduledTime = startTime.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return {
            id: appointment.id,
            customerName: `Khách hàng ${appointment.customer_id.slice(-4)}`,
            customerPhone: "0900000000",
            pet: {
              name: "Pet",
              type: "Chó/Mèo",
              age: 1,
            },
            services: relatedServices,
            scheduledTime,
            scheduledDate,
            status: mapAppointmentStatus(appointment.status),
            totalAmount: relatedServices.reduce(
              (sum, service) => sum + service.price,
              0
            ),
            branch: currentShop?.name || "Chi nhánh Vinhome Grand Park",
            createdAt: appointment.start_time,
            specialNote: appointment.notes,
            // ✅ Thêm thông tin từ API để debug
            originalAppointment: {
              id: appointment.id,
              customer_id: appointment.customer_id,
              status: appointment.status,
              notes: appointment.notes,
              start_time: appointment.start_time,
            },
          } as ServiceOrder;
        });

        setOrders(transformedOrders);
        console.log(
          `✅ Successfully loaded ${transformedOrders.length} orders for shop:`,
          shopId
        );
      } catch (error) {
        console.error("❌ Error fetching data for shop:", shopId, error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [dispatch, user?.id]);

  // ✅ Auto-refresh mỗi 30 giây chỉ khi có user.id
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      if (!loading) {
        console.log("🔄 Auto-refreshing order data...");
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loading, user?.id]);

  // ✅ Sửa lại filteredOrders để khớp với enum thực tế
  const filteredOrders = useMemo(() => {
    const today = new Date().toLocaleDateString("vi-VN");

    switch (activeTab) {
      case "pending":
        return orders.filter((order) => order.status === "pending");
      case "in-progress":
        return orders.filter((order) => order.status === "in-progress");
      case "today":
        return orders.filter((order) => order.scheduledDate === today);
      case "completed":
        return orders.filter((order) => order.status === "completed");
      case "cancelled":
        return orders.filter((order) => order.status === "cancelled");
      default:
        return orders;
    }
  }, [orders, activeTab]);

  // ✅ Loading state kiểm tra cả user
  const isLoading = loading || shopLoading || !user?.id;

  // ✅ Kiểm tra user login
  if (!user?.id) {
    return (
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">
            Vui lòng đăng nhập để xem quản lý đơn hàng
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  // ✅ Xử lý khi không có shop data sau khi đã fetch
  if (!currentShop) {
    return (
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">
            Không tìm thấy thông tin cửa hàng cho user: {user.id}
          </div>
        </div>
      </div>
    );
  }

  // Get relative time
  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const orderTime = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - orderTime.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Vừa mới";
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    return `${Math.floor(diffInHours / 24)} ngày trước`;
  };

  // ✅ Cập nhật getStatusConfig
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-orange-100 text-orange-800 border-orange-200", // ✅ Đổi màu
          text: "Chờ xử lý", // ✅ Đổi text
          icon: "⏳",
        };
      case "in-progress":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          text: "Đang thực hiện",
          icon: "🔄",
        };
      case "completed":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          text: "Hoàn thành",
          icon: "✨",
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          text: "Đã hủy",
          icon: "❌",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          text: status,
          icon: "❓",
        };
    }
  };

  // ✅ Cập nhật handleConfirmOrder
  const handleConfirmOrder = async (orderId: string) => {
    try {
      const appointment = appointments.find((apt) => apt.id === orderId);
      if (appointment) {
        await dispatch(
          updateAppointment({
            ...appointment,
            status: AppointmentStatus.InProgress, // ✅ Đổi từ CONFIRMED
            location_type: appointment.location_type || "",
            end_time: appointment.end_time || "",
          })
        ).unwrap();

        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? { ...order, status: "in-progress" as const } // ✅ Đổi thành in-progress
              : order
          )
        );

        alert(
          `Đã chuyển đơn hàng ${orderId} sang trạng thái "Đang thực hiện". Thông báo đã được gửi cho khách hàng.`
        );
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("Có lỗi xảy ra khi cập nhật đơn hàng");
    }
  };

  const handleCallCustomer = (phone: string, customerName: string) => {
    if (window.confirm(`Gọi cho ${customerName} (${phone})?`)) {
      window.open(`tel:${phone}`);
    }
  };

  const handleMessageCustomer = (phone: string, customerName: string) => {
    const message = prompt(
      `Gửi tin nhắn cho ${customerName}:`,
      "Xin chào! Chúng tôi xác nhận lịch hẹn của bạn..."
    );
    if (message) {
      alert(`Đã gửi tin nhắn cho ${customerName}: "${message}"`);
    }
  };

  const handleViewDetail = (order: ServiceOrder) => {
    alert(`Chi tiết đơn hàng ${order.id} - Sẽ mở modal/page chi tiết`);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-800">
              Quản lý đơn hàng dịch vụ
            </h1>
            <p className="text-sm md:text-2xl text-[#00809D] font-bold">
              {currentShop?.name || "Cửa hàng chăm sóc thú cưng Pettiny"}
            </p>
            <p className="text-sm text-gray-500">
              Tổng số đơn:{" "}
              <span className="font-bold text-2xl">{orders.length}</span> | Đang
              hiển thị:{" "}
              <span className="font-bold text-2xl">
                {filteredOrders.length}
              </span>
            </p>
          </div>
        </div>

        {/* Simple reload button */}
        <div className="flex items-center text-sm">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#91C8E4] text-white rounded-lg hover:bg-[#4682A9] transition-colors font-medium"
          >
            🔄 Reload
          </button>
        </div>
      </div>

      {/* ✅ Cập nhật Quick Filters */}
      <div className="grid grid-cols-2 md:flex md:space-x-2 gap-2 mb-6">
        {[
          {
            key: "pending",
            label: "Chờ xử lý", // ✅ Đổi text
            color: "bg-orange-500", // ✅ Đổi màu
            count: orders.filter((o) => o.status === "pending").length,
          },
          {
            key: "today",
            label: "Hôm nay",
            color: "bg-blue-500",
            count: orders.filter(
              (o) => o.scheduledDate === new Date().toLocaleDateString("vi-VN")
            ).length,
          },
          {
            key: "in-progress",
            label: "Đang thực hiện",
            color: "bg-yellow-500",
            count: orders.filter((o) => o.status === "in-progress").length,
          },
          {
            key: "completed",
            label: "Hoàn thành",
            color: "bg-green-500",
            count: orders.filter((o) => o.status === "completed").length,
          },
          {
            key: "cancelled", // ✅ Thêm cancelled tab
            label: "Đã hủy",
            color: "bg-red-500",
            count: orders.filter((o) => o.status === "cancelled").length,
          },
          {
            key: "all",
            label: "Tất cả",
            color: "bg-gray-500",
            count: orders.length,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`relative px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition-all duration-200 text-sm md:text-base ${
              activeTab === tab.key
                ? `${tab.color} text-white shadow-lg scale-105`
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:shadow-md"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`absolute -top-2 -right-2 w-5 h-5 text-xs rounded-full flex items-center justify-center ${
                  activeTab === tab.key
                    ? "bg-white text-gray-800"
                    : "bg-red-500 text-white"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders Cards */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Không có đơn hàng
            </h3>
            <p className="text-gray-500">Chưa có đơn hàng nào trong mục này</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-all duration-200"
              >
                {/* Card Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex items-center space-x-3 mb-2 md:mb-0">
                    <h3 className="text-lg font-bold text-gray-800">
                      Mã: <span className="text-[#06d5c4]">#{order.id}</span>
                    </h3>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${statusConfig.color}`}
                    >
                      {statusConfig.icon} {statusConfig.text}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {getRelativeTime(order.createdAt)}
                  </div>
                </div>

                {/* ✅ Customer & Appointment Info - Đơn giản hóa */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">👤</span>
                      <span className="font-medium text-gray-800">
                        ID: {order.originalAppointment?.customer_id.slice(-8)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">📅</span>
                      <span className="text-gray-600">
                        {order.scheduledTime}, {order.scheduledDate}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">📋</span>
                      <span className="text-gray-800">
                        Trạng thái: {order.originalAppointment?.status}
                      </span>
                    </div>
                    {order.originalAppointment?.notes && (
                      <div className="flex items-start space-x-2 text-sm">
                        <span className="text-gray-500 mt-0.5">💬</span>
                        <span className="text-gray-700 italic">
                          "{order.originalAppointment.notes}"
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Service Details */}
                <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-gray-800">
                        {order.services[0]?.name}
                      </span>
                      <span className="font-bold text-teal-600">
                        {order.totalAmount.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>🕐</span>
                      <span>
                        {order.scheduledTime}, {order.scheduledDate}
                      </span>
                    </div>
                    {order.specialNote && (
                      <div className="flex items-start space-x-2 text-sm">
                        <span className="text-gray-500 mt-0.5">💬</span>
                        <span className="text-gray-700 italic">
                          "{order.specialNote}"
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {order.status === "pending" && (
                    <button
                      onClick={() => handleConfirmOrder(order.id)}
                      className="flex-1 md:flex-none px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
                    >
                      ✅ Xác nhận
                    </button>
                  )}

                  <button
                    onClick={() =>
                      handleCallCustomer(
                        order.customerPhone,
                        order.customerName
                      )
                    }
                    className="flex-1 md:flex-none px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                  >
                    📞 Gọi
                  </button>

                  <button
                    onClick={() =>
                      handleMessageCustomer(
                        order.customerPhone,
                        order.customerName
                      )
                    }
                    className="flex-1 md:flex-none px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium text-sm"
                  >
                    💬 Nhắn tin
                  </button>

                  <button
                    onClick={() => handleViewDetail(order)}
                    className="flex-1 md:flex-none px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm"
                  >
                    👁️ Chi tiết
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
