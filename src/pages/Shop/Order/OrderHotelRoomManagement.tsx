import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { getRoomBookings, updateRoomBooking } from '../../../store/slices/roomBookingSlice';
import { getRooms } from '../../../store/slices/roomSlice';
import { searchHotels } from '../../../store/slices/hotelSlice';
import { getCustomerById } from '../../../store/slices/customerSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Use the actual room booking type from roomBookingSlice
interface RoomBooking {
  id: string;
  room_detail_id: string;
  customer_id: string;
  check_in_date: string;
  check_out_date: string;
  total_night: number;
  total_amount: number;
  feeding_schedule: string;
  medication_schedule: string;
  status: number; // 1 = not checked in, 2 = checked in, 3 = checked out
}

// Additional interface for enhanced booking data
interface EnhancedBooking extends RoomBooking {
  roomNumber?: number;
  roomType?: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerImage?: string;
  hotelName?: string;
  hotelId?: string;
  // Status helpers
  statusText?: string;
  statusIcon?: string;
  statusColor?: string;
  statusBadge?: string;
}

const OrderHotelRoomManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<string>("1"); // 1 = not checked in, 2 = checked in, 3 = checked out
  const [enhancedBookings, setEnhancedBookings] = useState<EnhancedBooking[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");
  const [loadingCustomers, setLoadingCustomers] = useState<Record<string, boolean>>({});
  
  // Get data from Redux store
  const { roomBookings, loading: bookingsLoading, error: bookingsError } = useSelector((state: RootState) => state.roomBooking);
  const { rooms, loading: roomsLoading } = useSelector((state: RootState) => state.room);
  const { hotels, loading: hotelsLoading } = useSelector((state: RootState) => state.hotel);
  const { user } = useSelector((state: RootState) => state.auth);

  // Calculate occupancy statistics
  const occupancyStats = {
    totalRooms: hotels.reduce((sum, hotel) => sum + hotel.total_room, 0),
    occupiedRooms: hotels.reduce((sum, hotel) => sum + (hotel.total_room - hotel.available_room), 0),
    upcomingBookings: roomBookings.filter(booking => booking.status === 1).length
  };

  // Fetch data when component mounts
  useEffect(() => {
    if (user && user.id) {
      // Fetch hotels owned by this shop
      dispatch(searchHotels({ shopId: user.id }));
      // Fetch all room bookings (can be filtered by customer or other params if needed)
      dispatch(getRoomBookings());
    }
  }, [dispatch, user]);

  // Fetch rooms after hotels are loaded
  useEffect(() => {
    if (hotels.length > 0) {
      // Get all rooms in hotels owned by this shop
      dispatch(getRooms());
    }
  }, [dispatch, hotels]);

  // Process and enhance bookings with additional data
  useEffect(() => {
    if (roomBookings.length > 0 && rooms.length > 0) {
      const enhanced = roomBookings.map(booking => {
        // Find room details
        const room = rooms.find(r => r.id === booking.room_detail_id);
        // Find hotel details if room exists
        const hotel = room ? hotels.find(h => h.id === room.hotel_id) : null;
        
        // Status config
        const statusConfig = getStatusConfig(booking.status);
        
        return {
          ...booking,
          roomNumber: room?.room_number,
          roomType: room?.room_type,
          hotelName: hotel?.name,
          hotelId: hotel?.id,
          statusText: statusConfig.text,
          statusIcon: statusConfig.icon,
          statusColor: statusConfig.color,
          statusBadge: statusConfig.badge,
          // Default values for customer data
          customerName: "Đang tải dữ liệu...",
          customerPhone: "Đang tải dữ liệu...",
          customerEmail: "",
          customerImage: ""
        };
      });
      
      setEnhancedBookings(enhanced);
      
      // Fetch customer data for each booking
      enhanced.forEach(booking => {
        if (booking.customer_id) {
          setLoadingCustomers(prev => ({ ...prev, [booking.customer_id]: true }));
          dispatch(getCustomerById(booking.customer_id))
            .unwrap()
            .then((response) => {
              const customer = response.data;
              
              setEnhancedBookings(prevBookings => 
                prevBookings.map(prevBooking => 
                  prevBooking.customer_id === booking.customer_id 
                    ? { 
                        ...prevBooking, 
                        customerName: customer.full_name || "Không có tên",
                        customerEmail: "Email không khả dụng", // Email not directly available in CustomerProfile
                        // Other customer details would come from the account object 
                        // but getCustomerById doesn't return account details directly
                      } 
                    : prevBooking
                )
              );
            })
            .catch(error => {
              console.error("Error fetching customer:", error);
              toast.error(`Không thể tải thông tin khách hàng: ${error.message}`);
            })
            .finally(() => {
              setLoadingCustomers(prev => ({ ...prev, [booking.customer_id]: false }));
            });
        }
      });
    }
  }, [roomBookings, rooms, hotels, dispatch]);

  // Check for errors
  useEffect(() => {
    if (bookingsError) {
      toast.error(`Error loading bookings: ${bookingsError.message}`);
    }
  }, [bookingsError]);

  // Get status configuration for hotel bookings
  const getStatusConfig = (status: number) => {
    switch (status) {
      case 1: // Not checked in yet
        return {
          color: "border-l-4 border-blue-500 bg-blue-50",
          badge: "bg-blue-100 text-blue-800 border-blue-200",
          text: "Chưa nhận phòng",
          icon: "🏨",
        };
      case 2: // Checked in
        return {
          color: "border-l-4 border-green-500 bg-green-50",
          badge: "bg-green-100 text-green-800 border-green-200",
          text: "Đã nhận phòng",
          icon: "🏠",
        };
      case 3: // Checked out
        return {
          color: "border-l-4 border-gray-500 bg-gray-50",
          badge: "bg-gray-100 text-gray-800 border-gray-200",
          text: "Đã trả phòng",
          icon: "✅",
        };
      default:
        return {
          color: "border-l-4 border-gray-300 bg-white",
          badge: "bg-gray-100 text-gray-800 border-gray-200",
          text: "Không xác định",
          icon: "❓",
        };
    }
  };

  // Get room type styling
  const getRoomTypeStyle = (roomType?: number) => {
    if (roomType === undefined) return "bg-gray-100 text-gray-800 border-gray-200";
    
    switch (roomType) {
      case 3: // VIP
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 border-amber-200";
      case 2: // Suite
        return "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200";
      case 1: // Standard
        return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200";
      case 0: // Economy
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Map room type to string
  const mapRoomTypeToString = (type?: number): string => {
    if (type === undefined) return "Không xác định";
    
    switch (type) {
      case 0: return 'Economy';
      case 1: return 'Standard';
      case 2: return 'Suite';
      case 3: return 'VIP';
      default: return 'Standard';
    }
  };

  // Calculate progress percentage for stay duration
  const getStayProgress = (booking: EnhancedBooking) => {
    // Ưu tiên kiểm tra status trước - nếu đã check-out (status=3) thì luôn hiển thị 100%
    if (booking.status === 3) return 100;
    
    const now = new Date();
    const checkIn = new Date(booking.check_in_date);
    const checkOut = new Date(booking.check_out_date);

    if (now < checkIn) return 0;
    if (now > checkOut) return 100;

    const totalDuration = checkOut.getTime() - checkIn.getTime();
    const elapsed = now.getTime() - checkIn.getTime();
    return Math.round((elapsed / totalDuration) * 100);
  };

  // Format dates to display format (DD/MM/YYYY)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Filter bookings based on activeTab and selectedHotelId
  const filteredBookings = () => {
    const statusFilter = parseInt(activeTab);
    return enhancedBookings.filter(booking => {
      // Status filter is always applied
      const statusMatches = booking.status === statusFilter;
      
      // Apply hotel filter if one is selected
      const hotelMatches = selectedHotelId ? booking.hotelId === selectedHotelId : true;
      
      return statusMatches && hotelMatches;
    });
  };

  // Add hotel filter after hotel list
  const renderHotelSelector = () => {
    if (hotels.length <= 1) return null;
    
    return (
      <div className="mb-4">
        <label htmlFor="hotel-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Lọc theo khách sạn
        </label>
        <select
          id="hotel-filter"
          value={selectedHotelId}
          onChange={(e) => setSelectedHotelId(e.target.value)}
          className="w-full sm:w-auto border border-gray-300 rounded-md py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Tất cả khách sạn</option>
          {hotels.map(hotel => (
            <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
          ))}
        </select>
      </div>
    );
  };

  // Action handlers
  const handleCheckIn = (bookingId: string) => {
    // Find the booking that needs to be updated
    const booking = enhancedBookings.find(b => b.id === bookingId);
    
    if (booking) {
      // Update booking status to 2 (checked in) via API
      dispatch(updateRoomBooking({
        ...booking,
        status: 2 // Update to "checked in" status
      }))
      .unwrap()
      .then(() => {
        toast.success(`Khách hàng đã được check-in thành công!`);
        // Refresh bookings list
        dispatch(getRoomBookings());
      })
      .catch((error) => {
        toast.error(`Lỗi khi check-in: ${error.message}`);
      });
    } else {
      toast.error("Không tìm thấy thông tin booking");
    }
  };

  // Handle checkout action
  const handleCheckOut = (bookingId: string) => {
    // Find the booking that needs to be updated
    const booking = enhancedBookings.find(b => b.id === bookingId);
    
    if (booking) {
      // Update booking status to 3 (checked out) via API
      dispatch(updateRoomBooking({
        ...booking,
        status: 3 // Update to "checked out" status
      }))
      .unwrap()
      .then(() => {
        toast.success(`Khách hàng đã được check-out thành công!`);
        // Refresh bookings list
        dispatch(getRoomBookings());
      })
      .catch((error) => {
        toast.error(`Lỗi khi check-out: ${error.message}`);
      });
    } else {
      toast.error("Không tìm thấy thông tin booking");
    }
  };

  const handleRoomService = (bookingId: string) => {
    // This would ideally open a form or detailed view with room service options
    toast.info(`Đã mở dịch vụ phòng cho booking #${bookingId}`);
  };

  const handleDailyReport = (booking: EnhancedBooking) => {
    // This would ideally open a daily care report form or view
    toast.info(`Báo cáo chăm sóc hàng ngày cho booking #${booking.id}`);
    
    // Example would be a modal with checkboxes for feeding, medication, etc.
  };

  const handleViewDetails = (booking: EnhancedBooking) => {
    // This would navigate to a detailed view of the booking
    toast.info(`Xem chi tiết booking #${booking.id}`);
  };

  const handleRoomStatus = (roomNumber?: number) => {
    toast.info(`Checking status for room ${roomNumber || 'Unknown'}`);
  };

  // Get room stars display (based on room type)
  const getRoomStars = (roomType?: number) => {
    if (roomType === undefined) return 3;
    
    switch (roomType) {
      case 0: return 2; // Economy
      case 1: return 3; // Standard
      case 2: return 4; // Suite
      case 3: return 5; // VIP
      default: return 3;
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Quản lý đặt phòng khách sạn 🐾
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              {hotels.length > 0 ? `${hotels[0].name}` : 'Khách sạn thú cưng'}
            </p>
          </div>
        </div>
      </div>

      {/* Hotel Occupancy Dashboard */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          📊 Tình trạng khách sạn
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {occupancyStats.occupiedRooms}
              </div>
              <div className="text-sm text-gray-500">Phòng đang sử dụng</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">
                {occupancyStats.totalRooms - occupancyStats.occupiedRooms}
              </div>
              <div className="text-sm text-gray-500">Phòng trống</div>
            </div>
          </div>
          <div className="flex-1 max-w-xs ml-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Occupancy Rate</span>
              <span>
                {occupancyStats.totalRooms > 0 ? 
                  Math.round((occupancyStats.occupiedRooms / occupancyStats.totalRooms) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${occupancyStats.totalRooms > 0 ? 
                    (occupancyStats.occupiedRooms / occupancyStats.totalRooms) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hotel selector */}
      {renderHotelSelector()}

      {/* Quick Filters */}
      <div className="grid grid-cols-2 md:flex md:space-x-2 gap-2 mb-6">
        {[
          {
            key: "1",
            label: "Chưa nhận phòng",
            color: "bg-blue-500",
            count: enhancedBookings.filter(b => b.status === 1).length,
          },
          {
            key: "2",
            label: "Đang ở",
            color: "bg-green-500",
            count: enhancedBookings.filter(b => b.status === 2).length,
          },
          {
            key: "3",
            label: "Đã trả phòng",
            color: "bg-gray-500",
            count: enhancedBookings.filter(b => b.status === 3).length,
          }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
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

      {/* Loading indicator */}
      {(bookingsLoading || roomsLoading || hotelsLoading) && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
          <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Hotel Booking Cards */}
      <div className="space-y-4">
        {!bookingsLoading && !roomsLoading && !hotelsLoading && filteredBookings().length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">🏨</span>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              Không có booking
            </h3>
            <p className="text-gray-500">Chưa có booking nào trong mục này</p>
          </div>
        ) : (
          filteredBookings().map((booking) => {
            const stayProgress = getStayProgress(booking);
            const isLoadingCustomer = loadingCustomers[booking.customer_id];

            return (
              <div
                key={booking.id}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-200 ${booking.statusColor}`}
              >
                {/* Card Header */}
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 mb-2 md:mb-0">
                      <div
                        className={`px-3 py-1 rounded-lg font-bold text-lg ${getRoomTypeStyle(booking.roomType)}`}
                      >
                        Phòng {mapRoomTypeToString(booking.roomType)} {booking.roomNumber}
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${booking.statusBadge}`}
                      >
                        {booking.statusIcon} {booking.statusText}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <div className="mr-2">#{booking.id}</div>
                      <div className="flex">
                        {Array.from({ length: getRoomStars(booking.roomType) }).map((_, i) => (
                          <span key={i} className="text-yellow-400">⭐</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      📅 {booking.total_night} đêm
                    </span>
                  </div>

                  {/* Timeline Visual */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span className="font-medium">
                        Check-in: {formatDate(booking.check_in_date)}
                      </span>
                      <span className="font-medium">
                        Check-out: {formatDate(booking.check_out_date)}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${stayProgress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Bắt đầu</span>
                        <span>{stayProgress}% completed</span>
                        <span>Kết thúc</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500 font-bold">👤Khách hàng:</span>
                        <span className="font-medium text-gray-800">
                          {isLoadingCustomer ? (
                            <span className="inline-block w-24 h-4 bg-gray-200 animate-pulse rounded"></span>
                          ) : (
                            booking.customerName
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Details */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">
                          Tổng cộng
                        </span>
                        <span className="font-bold text-green-600 text-lg">
                          {booking.total_amount.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Feeding Schedule */}
                  {booking.feeding_schedule ? (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-800 mb-2">
                        🍽️ Lịch cho ăn
                      </h4>
                      <p className="text-sm text-gray-700">{booking.feeding_schedule}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-800 mb-2">
                        🍽️ Lịch cho ăn
                      </h4>
                      <p className="text-sm text-gray-500">Chưa có thông tin lịch cho ăn</p>
                    </div>
                  )}

                  {/* Medication Schedule */}
                  {booking.medication_schedule ? (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <span className="text-yellow-600 mt-0.5 font-bold">💊 Lịch sử dụng thuốc:</span>
                        <span className="text-yellow-800 text-sm">
                          {booking.medication_schedule}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border-l-4 border-gray-200 p-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <span className="text-gray-500 mt-0.5">💊</span>
                        <span className="text-gray-500 text-sm">
                          Không có lịch sử dụng thuốc
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {booking.status === 1 && (
                      <button
                        onClick={() => handleCheckIn(booking.id)}
                        className="flex-1 md:flex-none px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                      >
                        🏨 Check-in
                      </button>
                    )}
                    
                    {booking.status === 2 && (
                      <button
                        onClick={() => handleCheckOut(booking.id)}
                        className="flex-1 md:flex-none px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                      >
                        🚪 Check-out
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OrderHotelRoomManagement;
