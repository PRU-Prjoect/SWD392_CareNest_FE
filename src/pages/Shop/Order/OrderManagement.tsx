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
import { getCustomerById } from "@/store/slices/customerSlice";

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

// ✅ THÊM: Function chuyển đổi enum sang tiếng Việt
const translateAppointmentStatus = (
  status: AppointmentStatus | undefined
): string => {
  if (!status) {
    return "Không xác định";
  }

  switch (status) {
    case AppointmentStatus.Finish:
      return "Hoàn thành";
    case AppointmentStatus.Cancel:
      return "Đã hủy";
    case AppointmentStatus.InProgress:
      return "Đang thực hiện";
    case AppointmentStatus.NoProgress:
      return "Chưa xác nhận";
    default:
      return status;
  }
};
const OrderManagement = () => {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Lấy user info từ auth state
  const { user } = useSelector((state: RootState) => state.auth);

  const { currentShop, loading: shopLoading } = useSelector(
    (state: RootState) => state.shop
  );

  // ✅ Cập nhật activeTab type
  const [activeTab, setActiveTab] = useState<
    "pending" | "in-progress" | "today" | "completed" | "cancelled" | "all"
  >("pending");

  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerNames, setCustomerNames] = useState<{ [key: string]: string }>(
    {}
  );

  const fetchCustomerName = async (customerId: string) => {
    if (customerNames[customerId]) return customerNames[customerId];

    try {
      const result = await dispatch(getCustomerById(customerId)).unwrap();
      const customerName = result.data.full_name;

      setCustomerNames((prev) => ({
        ...prev,
        [customerId]: customerName,
      }));

      return customerName;
    } catch (error) {
      console.error(`Failed to fetch customer ${customerId}:`, error);
      return `Khách hàng ${customerId.slice(-4)}`;
    }
  };

  const CustomerName: React.FC<{ customerId: string }> = ({ customerId }) => {
    const [name, setName] = useState<string>(
      `Khách hàng ${customerId.slice(-4)}`
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const loadCustomerName = async () => {
        if (customerNames[customerId]) {
          setName(customerNames[customerId]);
          return;
        }

        setLoading(true);
        try {
          const result = await dispatch(getCustomerById(customerId)).unwrap();
          const customerName = result.data.full_name;

          setCustomerNames((prev) => ({
            ...prev,
            [customerId]: customerName,
          }));

          setName(customerName);
        } catch (error) {
          console.error(`Failed to fetch customer ${customerId}:`, error);
          setName(`Khách hàng ${customerId.slice(-4)}`);
        } finally {
          setLoading(false);
        }
      };

      loadCustomerName();
    }, [customerId]);

    if (loading) {
      return <span className="animate-pulse">Đang tải...</span>;
    }

    return <span>{name}</span>;
  };

  // ✅ Fetch dữ liệu đã được cập nhật (bỏ function fetchCustomerName ở đây)
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

  useEffect(() => {
    const fetchAllCustomerNames = async () => {
      const uniqueCustomerIds = [
        ...new Set(
          orders
            .map((order) => order.originalAppointment?.customer_id)
            .filter(Boolean)
        ),
      ];

      const promises = uniqueCustomerIds.map((customerId) =>
        fetchCustomerName(customerId)
      );

      await Promise.allSettled(promises);
    };

    if (orders.length > 0) {
      fetchAllCustomerNames();
    }
  }, [orders]);

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
  // ✅ THAY ĐỔI: Sử dụng data từ orders thay vì appointments
  const handleConfirmOrder = async (orderId: string) => {
    try {
      // ✅ Tìm order từ orders array
      const order = orders.find((o) => o.id === orderId);
      if (!order || !order.originalAppointment) {
        alert("Không tìm thấy thông tin đơn hàng");
        return;
      }

      // ✅ Sử dụng originalAppointment data
      const appointmentData = order.originalAppointment;

      await dispatch(
        updateAppointment({
          id: appointmentData.id,
          customer_id: appointmentData.customer_id,
          status: AppointmentStatus.InProgress,
          notes: appointmentData.notes,
          start_time: appointmentData.start_time,
          location_type: "", // ✅ Default value
          end_time: "", // ✅ Default value
        })
      ).unwrap();

      // ✅ Update local state
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: "in-progress" as const,
                // ✅ Update originalAppointment status too
                originalAppointment: {
                  ...o.originalAppointment!,
                  status: AppointmentStatus.InProgress,
                },
              }
            : o
        )
      );

      alert(
        `Đã chuyển đơn hàng ${orderId} sang trạng thái "Đang thực hiện". Thông báo đã được gửi cho khách hàng.`
      );
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("Có lỗi xảy ra khi cập nhật đơn hàng");
    }
  };

  // Thêm hàm này bên cạnh handleConfirmOrder
  const handleCancelOrder = async (orderId: string) => {
    // Hỏi xác nhận trước khi hủy
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      return;
    }

    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order || !order.originalAppointment) {
        alert("Không tìm thấy thông tin đơn hàng để hủy.");
        return;
      }

      const appointmentData = order.originalAppointment;

      // ✅ Gọi API để cập nhật trạng thái thành Cancel
      await dispatch(
        updateAppointment({
          id: appointmentData.id,
          customer_id: appointmentData.customer_id,
          status: AppointmentStatus.Cancel, // <-- Thay đổi trạng thái
          notes: appointmentData.notes,
          start_time: appointmentData.start_time,
          location_type: "",
          end_time: "",
        })
      ).unwrap();

      // ✅ Cập nhật lại state của component để UI thay đổi ngay lập tức
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: "cancelled" as const, // <-- Cập nhật status local
                originalAppointment: {
                  ...o.originalAppointment!,
                  status: AppointmentStatus.Cancel,
                },
              }
            : o
        )
      );

      alert(`Đã hủy thành công đơn hàng ${orderId}.`);
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      alert("Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.");
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
              Quản lý đơn hàng dịch vụ
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
            <svg
              fill="currentColor"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="inline mr-2"
            >
              <path d="M4,12a1,1,0,0,1-2,0A9.983,9.983,0,0,1,18.242,4.206V2.758a1,1,0,1,1,2,0v4a1,1,0,0,1-1,1h-4a1,1,0,0,1,0-2h1.743A7.986,7.986,0,0,0,4,12Zm17-1a1,1,0,0,0-1,1A7.986,7.986,0,0,1,7.015,18.242H8.757a1,1,0,1,0,0-2h-4a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V19.794A9.984,9.984,0,0,0,22,12,1,1,0,0,0,21,11Z" />
            </svg>
            Reload
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

                {/* ✅ Customer & Appointment Info - THAY ĐỔI: Cập nhật hiển thị status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">👤</span>
                      <span className="font-medium text-gray-800">
                        <CustomerName
                          customerId={
                            order.originalAppointment?.customer_id || ""
                          }
                        />
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
                        Trạng thái:{" "}
                        <span className="font-bold">
                          {translateAppointmentStatus(
                            order.originalAppointment?.status
                          )}
                        </span>
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
                      <span className="text-2xl font-bold text-teal-600">
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
                <div className="flex flex-wrap items-center gap-2">
                  {/* Nút Xác nhận */}
                  {order.status === "pending" && (
                    <button
                      onClick={() => handleConfirmOrder(order.id)}
                      className="flex-1 md:flex-none px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline mr-2 w-4 h-4"
                      >
                        <path
                          d="M7.29417 12.9577L10.5048 16.1681L17.6729 9"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                      Xác nhận
                    </button>
                  )}

                  {/* ✅ NÚT HỦY ĐƠN MỚI */}
                  {/* Chỉ hiển thị khi đơn hàng đang chờ hoặc đang thực hiện */}
                  {(order.status === "pending" ||
                    order.status === "in-progress") && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="flex-1 md:flex-none px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline mr-2 w-4 h-4"
                      >
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15 9L9 15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 9L15 15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Hủy đơn
                    </button>
                  )}

                  {/* Nút Chi tiết */}
                  <button
                    onClick={() => handleViewDetail(order)}
                    className="flex-1 md:flex-none px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="inline mr-2 w-4 h-4"
                    >
                      {/* ... path svg chi tiết ... */}
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.9944 15.5C13.9274 15.5 15.4944 13.933 15.4944 12C15.4944 10.067 13.9274 8.5 11.9944 8.5C10.0614 8.5 8.49439 10.067 8.49439 12C8.49439 13.933 10.0614 15.5 11.9944 15.5ZM11.9944 13.4944C11.1691 13.4944 10.5 12.8253 10.5 12C10.5 11.1747 11.1691 10.5056 11.9944 10.5056C12.8197 10.5056 13.4888 11.1747 13.4888 12C13.4888 12.8253 12.8197 13.4944 11.9944 13.4944Z"
                        fill="currentColor"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 5C7.18879 5 3.9167 7.60905 2.1893 9.47978C0.857392 10.9222 0.857393 13.0778 2.1893 14.5202C3.9167 16.391 7.18879 19 12 19C16.8112 19 20.0833 16.391 21.8107 14.5202C23.1426 13.0778 23.1426 10.9222 21.8107 9.47978C20.0833 7.60905 16.8112 5 12 5ZM3.65868 10.8366C5.18832 9.18002 7.9669 7 12 7C16.0331 7 18.8117 9.18002 20.3413 10.8366C20.9657 11.5128 20.9657 12.4872 20.3413 13.1634C18.8117 14.82 16.0331 17 12 17C7.9669 17 5.18832 14.82 3.65868 13.1634C3.03426 12.4872 3.03426 11.5128 3.65868 10.8366Z"
                        fill="currentColor"
                      />
                    </svg>
                    Chi tiết
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
