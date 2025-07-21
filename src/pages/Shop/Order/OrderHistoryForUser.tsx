import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { getServiceById } from "@/store/slices/serviceSlice";
import { getAllServiceAppointments } from "@/store/slices/serviceAppointmentSlice";
import { getAllAppointments } from "@/store/slices/appointmentSlice";
import { getShopById } from "@/store/slices/shopSlice";
import { AppointmentStatus } from "@/types/enums";

interface OrderHistory {
  id: string;
  shopName: string; // ✅ Thay vì customerName
  shopId?: string; // ✅ Thêm shopId để fetch shop name
  shopPhone: string;
  services: {
    id: string;
    name: string;
    note: string;
    price: number;
  }[];
  completedTime: string; // ✅ Thay vì scheduledTime
  completedDate: string;
  totalAmount: number;
  createdAt: string;
  specialNote?: string;
  originalAppointment?: {
    id: string;
    customer_id: string;
    status: AppointmentStatus;
    notes: string;
    start_time: string;
  };
}

// ✅ Thêm interface ServiceDetail
interface ServiceDetail {
  id: string;
  name: string;
  note: string;
  price: number;
  shopId: string;
}

const OrderHistoryForUser = () => {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Lấy user info (customer) từ auth state
  const { user } = useSelector((state: RootState) => state.auth);

  // ✅ Đơn giản hóa activeTab - chỉ cần filter theo thời gian
  const [activeTab, setActiveTab] = useState<
    "all" | "this-month" | "this-year"
  >("all");

  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [shopNames, setShopNames] = useState<{ [key: string]: string }>({});

  // ✅ Component hiển thị tên shop (đã được cập nhật)
  const ShopName: React.FC<{ shopId: string; defaultName?: string }> = ({
    shopId,
    defaultName = `Shop ${shopId.slice(-4)}`,
  }) => {
    const [name, setName] = useState<string>(defaultName);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const loadShopName = async () => {
        if (shopNames[shopId]) {
          setName(shopNames[shopId]);
          return;
        }

        setLoading(true);
        try {
          const result = await dispatch(getShopById(shopId)).unwrap();
          const shopName = result.data.name;

          setShopNames((prev) => ({
            ...prev,
            [shopId]: shopName,
          }));

          setName(shopName);
        } catch (error) {
          console.error(`Failed to fetch shop ${shopId}:`, error);
          setName(defaultName);
        } finally {
          setLoading(false);
        }
      };

      if (shopId) {
        loadShopName();
      }
    }, [shopId, defaultName]);

    if (loading) {
      return <span className="animate-pulse">Đang tải...</span>;
    }

    return <span>{name}</span>;
  };

  // ✅ Sửa phần useEffect chính với type safety
  useEffect(() => {
    const fetchCustomerOrders = async () => {
      if (!user?.id) {
        console.log("❌ No customer ID found");
        setOrders([]);
        setLoading(false);
        return;
      }

      const customerId = user.id;
      setLoading(true);

      try {
        console.log("🚀 Fetching completed orders for customer:", customerId);

        const customerAppointmentsResult = await dispatch(
          getAllAppointments({
            customerId: customerId,
            status: AppointmentStatus.Finish,
          })
        ).unwrap();

        const completedAppointments = customerAppointmentsResult.data;

        if (completedAppointments.length === 0) {
          console.log("ℹ️ No completed appointments found");
          setOrders([]);
          setLoading(false);
          return;
        }

        const orderPromises = completedAppointments.map(
          async (appointment: any) => {
            try {
              const serviceAppointmentsResult = await dispatch(
                getAllServiceAppointments({ appointmentId: appointment.id })
              ).unwrap();

              const serviceAppointments = serviceAppointmentsResult.data;

              // ✅ Lấy service details cho mỗi service_id, trả về Promise<ServiceDetail | null>
              const servicePromises = serviceAppointments.map(
                async (sa: any): Promise<ServiceDetail | null> => {
                  try {
                    const serviceResult = await dispatch(
                      getServiceById(sa.service_id)
                    ).unwrap();

                    return {
                      id: serviceResult.data.id,
                      name: serviceResult.data.name,
                      note: appointment.notes || "",
                      price: serviceResult.data.price ?? 0, // Thêm giá trị mặc định là 0 nếu price là undefined
                      shopId: serviceResult.data.shop_id,
                    };
                  } catch (error) {
                    console.error(
                      `Error fetching service ${sa.service_id}:`,
                      error
                    );
                    return null;
                  }
                }
              );

              // ✅ Filter với type guard để đảm bảo các phần tử trong mảng `services` là `ServiceDetail`
              const services = (await Promise.all(servicePromises)).filter(
                (service): service is ServiceDetail => service !== null
              );

              if (services.length === 0) {
                console.log(
                  `No services found for appointment ${appointment.id}`
                );
                return null;
              }

              const completedTime = new Date(appointment.start_time);
              const completedDate = completedTime.toLocaleDateString("vi-VN");
              const completedTimeStr = completedTime.toLocaleTimeString(
                "vi-VN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              );

              return {
                id: appointment.id,
                shopName: `Shop ${services[0]?.shopId?.slice(-4) || ""}`,
                shopId: services.length > 0 ? services[0].shopId : undefined, // ✅ Safe access
                shopPhone: "0900000000",
                services: services.map((service) => ({
                  id: service.id, // ✅ Không cần optional chaining
                  name: service.name,
                  note: service.note,
                  price: service.price,
                })),
                completedTime: completedTimeStr,
                completedDate,
                totalAmount: services.reduce(
                  (sum, service) => sum + service.price, // ✅ Không cần optional chaining
                  0
                ),
                createdAt: appointment.start_time,
                specialNote: appointment.notes,
                originalAppointment: {
                  id: appointment.id,
                  customer_id: appointment.customer_id,
                  status: appointment.status,
                  notes: appointment.notes,
                  start_time: appointment.start_time,
                },
              } as OrderHistory;
            } catch (error) {
              console.error("Error processing appointment:", error);
              return null;
            }
          }
        );

        const transformedOrders = (await Promise.all(orderPromises)).filter(
          (order): order is OrderHistory => order !== null // ✅ Thêm type guard
        );

        setOrders(transformedOrders);
        console.log(
          `✅ Successfully loaded ${transformedOrders.length} completed orders`
        );
      } catch (error) {
        console.error("❌ Error fetching customer orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerOrders();
  }, [dispatch, user?.id]);

  // ✅ Filtered orders theo thời gian
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    switch (activeTab) {
      case "this-month":
        return orders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return (
            orderDate.getMonth() === thisMonth &&
            orderDate.getFullYear() === thisYear
          );
        });
      case "this-year":
        return orders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getFullYear() === thisYear;
        });
      default:
        return orders;
    }
  }, [orders, activeTab]);

  // ✅ Kiểm tra user login
  if (!user?.id) {
    return (
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">
            Vui lòng đăng nhập để xem lịch sử đơn hàng
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Đang tải lịch sử...</span>
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

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-800">
              Lịch sử đơn hàng thành công
            </h1>

            <p className="text-sm text-gray-500">
              Tổng số đơn hoàn thành:{" "}
              <span className="font-bold text-2xl">{orders.length}</span> | Đang
              hiển thị:{" "}
              <span className="font-bold text-2xl">
                {filteredOrders.length}
              </span>
            </p>
          </div>
        </div>

        {/* Reload button */}
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

      {/* ✅ Simplified Filters */}
      <div className="grid grid-cols-3 md:flex md:space-x-2 gap-2 mb-6">
        {[
          {
            key: "all",
            label: "Tất cả",
            color: "bg-green-500",
            count: orders.length,
          },
          {
            key: "this-month",
            label: "Tháng này",
            color: "bg-blue-500",
            count: orders.filter((o) => {
              const orderDate = new Date(o.createdAt);
              const now = new Date();
              return (
                orderDate.getMonth() === now.getMonth() &&
                orderDate.getFullYear() === now.getFullYear()
              );
            }).length,
          },
          {
            key: "this-year",
            label: "Năm này",
            color: "bg-purple-500",
            count: orders.filter((o) => {
              const orderDate = new Date(o.createdAt);
              const now = new Date();
              return orderDate.getFullYear() === now.getFullYear();
            }).length,
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
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Chưa có đơn hàng hoàn thành
            </h3>
            <p className="text-gray-500">
              Lịch sử đơn hàng của bạn sẽ hiển thị tại đây
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
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
                  <span className="px-3 py-1 text-xs font-medium rounded-full border bg-green-100 text-green-800 border-green-200">
                    ✨ Hoàn thành
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {getRelativeTime(order.createdAt)}
                </div>
              </div>

              {/* Shop & Service Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">🏪 Cửa hàng:</span>
                    <span className="font-medium text-gray-800">
                      {/* ✅ Sử dụng shopId từ order thay vì customer_id */}
                      {order.shopId ? (
                        <ShopName
                          shopId={order.shopId}
                          defaultName={order.shopName}
                        />
                      ) : (
                        order.shopName
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">📅</span>
                    <span className="text-gray-600">
                      {order.completedTime}, {order.completedDate}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
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
                    <span>✅</span>
                    <span>
                      Dịch vụ đã hoàn thành vào {order.completedTime},{" "}
                      {order.completedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* ✅ Chỉ có nút xem chi tiết, không có action buttons */}
              <div className="flex justify-end">
                <button
                  onClick={() => alert(`Chi tiết đơn hàng ${order.id}`)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline mr-2"
                  >
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
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistoryForUser;
