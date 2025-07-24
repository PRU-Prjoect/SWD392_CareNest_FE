import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { getServiceById } from "@/store/slices/serviceSlice";
import { getAllServiceAppointments } from "@/store/slices/serviceAppointmentSlice";
import { getAllAppointments } from "@/store/slices/appointmentSlice";
import { getShopById } from "@/store/slices/shopSlice";
import { getRoomBookings } from "@/store/slices/roomBookingSlice";
import { getRoomById } from "@/store/slices/roomSlice";
import { getHotelById } from "@/store/slices/hotelSlice";
import { AppointmentStatus } from "@/types/enums";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

// ✅ Interface cho Service Detail
interface ServiceDetail {
  id: string;
  name: string;
  note: string;
  price: number;
  shopId: string;
}

interface CurrentOrder {
  id: string;
  shopName: string;
  shopId?: string;
  shopPhone: string;
  services: {
    id: string;
    name: string;
    note: string;
    price: number;
  }[];
  scheduledTime: string;
  scheduledDate: string;
  status: "pending" | "in-progress" | "cancelled";
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



interface AppointmentData {
  id: string;
  customer_id: string;
  status: AppointmentStatus;
  notes: string;
  start_time: string;
}

// Interface cho Service Appointment
interface ServiceAppointmentData {
  service_id: string;
}

// ✅ Interface cho Hotel Booking
interface HotelBookingDetail {
  id: string;
  room_detail_id: string;
  customer_id: string;
  check_in_date: string;
  check_out_date: string;
  total_night: number;
  total_amount: number;
  feeding_schedule: string;
  medication_schedule: string;
  status: number;
  room?: {
    id: string;
    room_number: number;
    room_type: number;
    daily_price: number;
    hotel_id: string;
  };
  hotel?: {
    id: string;
    name: string;
  };
}

// Interface cho Room Booking
interface RoomBookingData {
  id: string;
  room_detail_id: string;
  customer_id: string;
  check_in_date: string;
  check_out_date: string;
  total_night: number;
  total_amount: number;
  feeding_schedule: string;
  medication_schedule: string;
  status: number;
}

// Map room type từ number về string để hiển thị
const mapRoomTypeToString = (type: number): string => {
  switch (type) {
    case 0: return 'Economy';
    case 1: return 'Standard';
    case 2: return 'Suite';
    case 3: return 'VIP';
    default: return 'Standard';
  }
};

// Mapping function cho status phòng khách sạn
const mapHotelBookingStatus = (status: number): string => {
  switch (status) {
    case 1:
      return "Chưa nhận phòng";
    case 2:
      return "Đã nhận phòng";
    case 3:
      return "Đã trả phòng";
    default:
      return "Không xác định";
  }
};

// Get status color cho booking status
const getHotelBookingStatusColor = (status: number): string => {
  switch (status) {
    case 1:
      return "bg-orange-100 text-orange-800 border-orange-200";
    case 2:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case 3:
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// ✅ Mapping function cho status
const mapAppointmentStatus = (
  status: AppointmentStatus
): CurrentOrder["status"] => {
  switch (status) {
    case AppointmentStatus.NoProgress:
      return "pending";
    case AppointmentStatus.InProgress:
      return "in-progress";
    case AppointmentStatus.Cancel:
      return "cancelled";
    default:
      return "pending";
  }
};

// ✅ Function chuyển đổi enum sang tiếng Việt
const translateAppointmentStatus = (
  status: AppointmentStatus | undefined
): string => {
  if (!status) {
    return "Không xác định";
  }

  switch (status) {
    case AppointmentStatus.Cancel:
      return "Đã hủy";
    case AppointmentStatus.InProgress:
      return "Đang thực hiện";
    case AppointmentStatus.NoProgress:
      return "Chờ xác nhận";
    default:
      return status;
  }
};

const CurrentOrderForUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // ✅ Lấy user info (customer) từ auth state
  const { user } = useSelector((state: RootState) => state.auth);

  // ✅ Filter tabs cho đơn hàng hiện tại
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "in-progress" | "cancelled"
  >("all");

  // ✅ Tab giữa Services và Hotel
  const [activeSection, setActiveSection] = useState<"services" | "hotels">("services");

  const [orders, setOrders] = useState<CurrentOrder[]>([]);
  const [hotelBookings, setHotelBookings] = useState<HotelBookingDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const [shopNames, setShopNames] = useState<{ [key: string]: string }>({});

  // ✅ Component hiển thị tên shop
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

  // ✅ Fetch dữ liệu đơn hàng hiện tại (không bao gồm Finish)
  useEffect(() => {
    const fetchCurrentOrders = async () => {
      if (!user?.id) {
        console.log("❌ No customer ID found");
        setOrders([]);
        setLoading(false);
        return;
      }

      const customerId = user.id;
      setLoading(true);

      try {
        console.log("🚀 Fetching current orders for customer:", customerId);

        // ✅ Lấy appointments với tất cả trạng thái trừ Finish
        const appointmentPromises = [
          dispatch(
            getAllAppointments({
              customerId: customerId,
              status: AppointmentStatus.NoProgress,
            })
          ).unwrap(),
          dispatch(
            getAllAppointments({
              customerId: customerId,
              status: AppointmentStatus.InProgress,
            })
          ).unwrap(),
          dispatch(
            getAllAppointments({
              customerId: customerId,
              status: AppointmentStatus.Cancel,
            })
          ).unwrap(),
        ];

        const appointmentResults = await Promise.allSettled(
          appointmentPromises
        );

        const allCurrentAppointments = appointmentResults
          .filter((result): result is PromiseFulfilledResult<{data: AppointmentData[]}> => result.status === "fulfilled")
          .flatMap((result) => result.value.data);

        if (allCurrentAppointments.length === 0) {
          console.log("ℹ️ No current appointments found");
          setOrders([]);
          setLoading(false);
          return;
        }

        // ✅ Process appointments tương tự OrderHistoryForUser
        const orderPromises = allCurrentAppointments.map(
          async (appointment: AppointmentData) => {
            try {
              const serviceAppointmentsResult = await dispatch(
                getAllServiceAppointments({ appointmentId: appointment.id })
              ).unwrap();

              const serviceAppointments = serviceAppointmentsResult.data;

              const servicePromises = serviceAppointments.map(
                async (sa: ServiceAppointmentData): Promise<ServiceDetail | null> => {
                  try {
                    const serviceResult = await dispatch(
                      getServiceById(sa.service_id)
                    ).unwrap();

                    return {
                      id: serviceResult.data.id,
                      name: serviceResult.data.name,
                      note: appointment.notes || "",
                      price: serviceResult.data.price ?? 0,
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

              const services = (await Promise.all(servicePromises)).filter(
                (service): service is ServiceDetail => service !== null
              );

              if (services.length === 0) {
                console.log(
                  `No services found for appointment ${appointment.id}`
                );
                return null;
              }

              // Parse thời gian đặt lịch
              const scheduledTime = new Date(appointment.start_time);
              const scheduledDate = scheduledTime.toLocaleDateString("vi-VN");
              const scheduledTimeStr = scheduledTime.toLocaleTimeString(
                "vi-VN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              );

              return {
                id: appointment.id,
                shopName: `Shop ${services[0]?.shopId?.slice(-4) || ""}`,
                shopId: services.length > 0 ? services[0].shopId : undefined,
                shopPhone: "0900000000",
                services: services.map((service) => ({
                  id: service.id,
                  name: service.name,
                  note: service.note,
                  price: service.price,
                })),
                scheduledTime: scheduledTimeStr,
                scheduledDate,
                status: mapAppointmentStatus(appointment.status),
                totalAmount: services.reduce(
                  (sum, service) => sum + service.price,
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
              } as CurrentOrder;
            } catch (error) {
              console.error("Error processing appointment:", error);
              return null;
            }
          }
        );

        const transformedOrders = (await Promise.all(orderPromises)).filter(
          (order): order is CurrentOrder => order !== null
        );

        setOrders(transformedOrders);
        console.log(
          `✅ Successfully loaded ${transformedOrders.length} current orders`
        );
      } catch (error) {
        console.error("❌ Error fetching current orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentOrders();
  }, [dispatch, user?.id]);

  // ✅ Fetch dữ liệu đặt phòng khách sạn
  useEffect(() => {
    const fetchHotelBookings = async () => {
      if (!user?.id) {
        console.log("❌ No customer ID found");
        setHotelBookings([]);
        setLoadingHotels(false);
        return;
      }

      const customerId = user.id;
      setLoadingHotels(true);

      try {
        console.log("🚀 Fetching hotel bookings for customer:", customerId);

        // Fetch tất cả đặt phòng khách sạn của khách hàng
        const result = await dispatch(
          getRoomBookings({ customerId })
        ).unwrap();

        if (!result.data || result.data.length === 0) {
          console.log("ℹ️ No hotel bookings found");
          setHotelBookings([]);
          setLoadingHotels(false);
          return;
        }

        console.log("Fetched room bookings:", result.data);

        // Xử lý dữ liệu để thêm thông tin phòng và khách sạn
        const bookingsWithDetails = await Promise.all(
          result.data.map(async (booking: RoomBookingData) => {
            try {
              // Lấy thông tin chi tiết về phòng
              const roomResult = await dispatch(
                getRoomById(booking.room_detail_id)
              ).unwrap();

              console.log("Room data for booking:", roomResult);
              
              const room = roomResult.data;
              let hotel = null;

              // Lấy thông tin về khách sạn từ room.hotel_id
              if (room && room.hotel_id) {
                console.log("Fetching hotel with ID:", room.hotel_id);
                const hotelResult = await dispatch(
                  getHotelById(room.hotel_id)
                ).unwrap();
                
                console.log("Hotel result:", hotelResult);
                
                // Chắc chắn là chúng ta truy cập đúng trường
                hotel = {
                  id: hotelResult.data.id || "",
                  name: hotelResult.data.name || "Khách sạn không xác định"
                };
              }

              return {
                ...booking,
                room,
                hotel,
              };
            } catch (error) {
              console.error(`Error fetching details for booking ${booking.id}:`, error);
              return booking;
            }
          })
        );

        console.log("Processed bookings:", bookingsWithDetails);
        setHotelBookings(bookingsWithDetails as HotelBookingDetail[]);
        console.log(
          `✅ Successfully loaded ${bookingsWithDetails.length} hotel bookings`
        );
      } catch (error) {
        console.error("❌ Error fetching hotel bookings:", error);
        setHotelBookings([]);
      } finally {
        setLoadingHotels(false);
      }
    };

    if (activeSection === "hotels") {
      fetchHotelBookings();
    }
  }, [dispatch, user?.id, activeSection]);

  // ✅ Filtered orders theo trạng thái
  const filteredOrders = useMemo(() => {
    let result;
    switch (activeTab) {
      case "pending":
        result = orders.filter((order) => order.status === "pending");
        break;
      case "in-progress":
        result = orders.filter((order) => order.status === "in-progress");
        break;
      case "cancelled":
        result = orders.filter((order) => order.status === "cancelled");
        break;
      default:
        result = orders;
    }
    
    // Sắp xếp theo thời gian đặt (mới nhất lên đầu)
    return result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Sắp xếp giảm dần (mới nhất lên đầu)
    });
  }, [orders, activeTab]);

  // ✅ Format ngày tháng
  const formatDate = (dateString: string): string => {
    return dayjs(dateString).format('DD/MM/YYYY');
  };

  // ✅ Format giá tiền
  const formatCurrency = (amount: number): string => {
    return `${amount.toLocaleString('vi-VN')}đ`;
  };

  // ✅ Kiểm tra user login
  if (!user?.id) {
    return (
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">
            Vui lòng đăng nhập để xem đơn hàng hiện tại
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
          <span className="ml-2 text-gray-600">Đang tải đơn hàng...</span>
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

  // ✅ Status configuration
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-orange-100 text-orange-800 border-orange-200",
          text: "Chờ xác nhận",
          icon: "⏳",
        };
      case "in-progress":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          text: "Đang thực hiện",
          icon: "🔄",
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

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-800">
              Đơn hàng hiện tại
            </h1>

            <p className="text-sm text-gray-500">
              {activeSection === "services" ? (
                <>
                  Tổng số đơn:{" "}
                  <span className="font-bold text-2xl">{orders.length}</span> | Đang
                  hiển thị:{" "}
                  <span className="font-bold text-2xl">
                    {filteredOrders.length}
                  </span>
                </>
              ) : (
                <>
                  Tổng số đơn đặt phòng:{" "}
                  <span className="font-bold text-2xl">{hotelBookings.length}</span>
                </>
              )}
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

      {/* Main Section Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-3 px-6 font-medium text-sm md:text-base border-b-2 transition-colors ${
            activeSection === "services"
              ? "border-teal-500 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveSection("services")}
        >
          Dịch vụ
        </button>
        <button
          className={`py-3 px-6 font-medium text-sm md:text-base border-b-2 transition-colors ${
            activeSection === "hotels"
              ? "border-teal-500 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveSection("hotels")}
        >
          Khách sạn được đặt
        </button>
      </div>

      {/* Services Section */}
      {activeSection === "services" && (
        <>
          {/* ✅ Status Filters */}
          <div className="grid grid-cols-2 md:flex md:space-x-2 gap-2 mb-6">
            {[
              {
                key: "all",
                label: "Tất cả",
                color: "bg-gray-500",
                count: orders.length,
              },
              {
                key: "pending",
                label: "Chờ xác nhận",
                color: "bg-orange-500",
                count: orders.filter((o) => o.status === "pending").length,
              },
              {
                key: "in-progress",
                label: "Đang thực hiện",
                color: "bg-blue-500",
                count: orders.filter((o) => o.status === "in-progress").length,
              },
              {
                key: "cancelled",
                label: "Đã hủy",
                color: "bg-red-500",
                count: orders.filter((o) => o.status === "cancelled").length,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "all" | "pending" | "in-progress" | "cancelled")}
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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Đang tải đơn hàng...</span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl">📝</span>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Không có đơn hàng hiện tại
                </h3>
                <p className="text-gray-500">
                  Đơn hàng hiện tại của bạn sẽ hiển thị tại đây
                </p>
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

                    {/* Shop & Service Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">🏪 Cửa hàng:</span>
                          <span className="font-medium text-gray-800">
                            {order.shopId ? (
                              <ShopName
                                shopId={order.shopId}
                                defaultName={order.shopName}
                              />
                            ) : (
                              <span>{order.shopName || "Shop không xác định"}</span>
                            )}
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
                            {order.services?.[0]?.name || "Dịch vụ không xác định"}
                          </span>
                          <span className="text-2xl font-bold text-teal-600">
                            {order.totalAmount.toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>🕐</span>
                          <span>
                            Thời gian đặt: {order.scheduledTime},{" "}
                            {order.scheduledDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    {/* <div className="flex justify-end">
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
                    </div> */}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Hotel Bookings Section */}
      {activeSection === "hotels" && (
        <div className="space-y-4">
          {loadingHotels ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
              <span className="ml-2 text-gray-600">Đang tải đơn đặt phòng...</span>
            </div>
          ) : hotelBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">🏨</span>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Không có đơn đặt phòng khách sạn
              </h3>
              <p className="text-gray-500">
                Đơn đặt phòng khách sạn của bạn sẽ hiển thị tại đây
              </p>
              <button 
                onClick={() => navigate('/app/hotel-services')}
                className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Đặt phòng ngay
              </button>
            </div>
          ) : (
            hotelBookings.map((booking) => {
              const statusColor = getHotelBookingStatusColor(booking.status);
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-all duration-200"
                >
                  {/* Card Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 mb-2 md:mb-0">
                      <h3 className="text-lg font-bold text-gray-800">
                        Mã: <span className="text-teal-600">#{booking.id}</span>
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColor}`}
                      >
                        {mapHotelBookingStatus(booking.status)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(booking.check_in_date)}
                    </div>
                  </div>

                  {/* Hotel & Room Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">🏨 Khách sạn:</span>
                        <span className="font-medium text-gray-800">
                          {booking.hotel?.name || "Không rõ tên khách sạn"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">🔑 Phòng:</span>
                        <span className="text-gray-600">
                          {booking.room ? `${booking.room.room_number} (${mapRoomTypeToString(booking.room.room_type)})` : "Không rõ thông tin phòng"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">📅 Check-in:</span>
                        <span className="text-gray-800 font-medium">
                          {formatDate(booking.check_in_date)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">📅 Check-out:</span>
                        <span className="text-gray-800 font-medium">
                          {formatDate(booking.check_out_date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-gray-800">
                          {booking.total_night} đêm
                        </span>
                        <span className="text-2xl font-bold text-teal-600">
                          {formatCurrency(booking.total_amount)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>🕐</span>
                        <span>
                          Lịch cho ăn: {formatDate(booking.feeding_schedule)}
                        </span>
                      </div>
                      {booking.medication_schedule && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>💊</span>
                          <span>
                            Lịch uống thuốc: {formatDate(booking.medication_schedule)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate(`/app/hotel-booking-detail/${booking.room?.hotel_id || ''}`)}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default CurrentOrderForUser;
