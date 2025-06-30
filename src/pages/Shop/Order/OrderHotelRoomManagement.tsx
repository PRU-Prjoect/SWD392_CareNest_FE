import React, { useState, useEffect } from "react";

interface Pet {
  id: number;
  name: string;
  type: string;
  age: number;
  avatar?: string;
  specialRequirements?: string[];
}

interface HotelBooking {
  id: string;
  roomNumber: string;
  roomType: "VIP" | "Suite" | "Standard" | "Economy";
  customerName: string;
  customerPhone: string;
  pets: Pet[];
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  duration: { days: number; nights: number };
  status:
    | "arriving-today"
    | "in-house"
    | "departing-soon"
    | "checked-out"
    | "cancelled";
  dailyPrice: number;
  addOns: { name: string; price: number }[];
  totalAmount: number;
  specialNote?: string;
  careChecklist?: {
    date: string;
    fed: boolean;
    walked: boolean;
    medication: boolean;
    playtime: boolean;
  }[];
  createdAt: string;
}

const OrderHotelRoomManagement = () => {
  const [activeTab, setActiveTab] = useState<
    | "arriving-today"
    | "in-house"
    | "departing-soon"
    | "checked-out"
    | "cancelled"
    | "all"
  >("arriving-today");
  const [bookings, setBookings] = useState<HotelBooking[]>([]);
  const [hotelOccupancy, setHotelOccupancy] = useState({
    occupied: 5,
    total: 20,
  });

  // Dữ liệu mẫu cho hotel bookings
  const mockBookings: HotelBooking[] = [
    {
      id: "HTL001234",
      roomNumber: "A01",
      roomType: "VIP",
      customerName: "Nguyễn Văn A",
      customerPhone: "0901234567",
      pets: [
        {
          id: 1,
          name: "Max",
          type: "Golden Retriever",
          age: 3,
          avatar:
            "https://i.pinimg.com/736x/cb/af/5b/cbaf5b442f87104b60fd1bc38fdc7db6.jpg",
          specialRequirements: ["Medication 2x/day", "Vegetarian diet"],
        },
      ],
      checkInDate: "29/06/2025",
      checkInTime: "14:00",
      checkOutDate: "01/07/2025",
      checkOutTime: "11:00",
      duration: { days: 3, nights: 2 },
      status: "arriving-today",
      dailyPrice: 500000,
      addOns: [
        { name: "Grooming premium", price: 200000 },
        { name: "Special food", price: 100000 },
      ],
      totalAmount: 1800000,
      specialNote: "Max cần thuốc mỗi sáng và tối",
      careChecklist: [
        {
          date: "29/06",
          fed: true,
          walked: true,
          medication: true,
          playtime: false,
        },
      ],
      createdAt: "2025-06-28T10:00:00Z",
    },
    {
      id: "HTL001235",
      roomNumber: "B05",
      roomType: "Standard",
      customerName: "Trần Thị B",
      customerPhone: "0987654321",
      pets: [
        {
          id: 2,
          name: "Luna",
          type: "Persian Cat",
          age: 2,
          avatar:
            "https://i.pinimg.com/736x/85/15/45/85154540f095922c15ffcdf3f83b6523.jpg",
          specialRequirements: ["Daily brushing"],
        },
        {
          id: 3,
          name: "Milo",
          type: "Maine Coon",
          age: 1,
          avatar:
            "https://i.pinimg.com/736x/35/f5/1f/35f51f284152dbd89d07a6ec54a89785.jpg",
        },
      ],
      checkInDate: "28/06/2025",
      checkInTime: "15:00",
      checkOutDate: "30/06/2025",
      checkOutTime: "12:00",
      duration: { days: 2, nights: 1 },
      status: "in-house",
      dailyPrice: 300000,
      addOns: [],
      totalAmount: 600000,
      careChecklist: [
        {
          date: "28/06",
          fed: true,
          walked: true,
          medication: false,
          playtime: true,
        },
        {
          date: "29/06",
          fed: true,
          walked: true,
          medication: false,
          playtime: true,
        },
      ],
      createdAt: "2025-06-27T16:00:00Z",
    },
  ];

  useEffect(() => {
    setBookings(mockBookings);
  }, []);

  // Get status configuration for hotel bookings
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "arriving-today":
        return {
          color: "border-l-4 border-blue-500 bg-blue-50",
          badge: "bg-blue-100 text-blue-800 border-blue-200",
          text: "Arriving today",
          icon: "🏨",
        };
      case "in-house":
        return {
          color: "border-l-4 border-green-500 bg-green-50",
          badge: "bg-green-100 text-green-800 border-green-200",
          text: "In house",
          icon: "🏠",
        };
      case "departing-soon":
        return {
          color: "border-l-4 border-yellow-500 bg-yellow-50",
          badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
          text: "Departing soon",
          icon: "🚪",
        };
      case "checked-out":
        return {
          color: "border-l-4 border-gray-500 bg-gray-50",
          badge: "bg-gray-100 text-gray-800 border-gray-200",
          text: "Checked out",
          icon: "✅",
        };
      case "cancelled":
        return {
          color: "border-l-4 border-red-300 bg-red-50",
          badge: "bg-red-100 text-red-800 border-red-200",
          text: "Cancelled",
          icon: "❌",
        };
      default:
        return {
          color: "border-l-4 border-gray-300 bg-white",
          badge: "bg-gray-100 text-gray-800 border-gray-200",
          text: status,
          icon: "❓",
        };
    }
  };

  // Get room type styling
  const getRoomTypeStyle = (roomType: string) => {
    switch (roomType) {
      case "VIP":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 border-amber-200";
      case "Suite":
        return "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200";
      case "Standard":
        return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200";
      case "Economy":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Calculate progress percentage for stay duration
  const getStayProgress = (booking: HotelBooking) => {
    const now = new Date();
    const checkIn = new Date(
      `${booking.checkInDate.split("/").reverse().join("-")}T${
        booking.checkInTime
      }`
    );
    const checkOut = new Date(
      `${booking.checkOutDate.split("/").reverse().join("-")}T${
        booking.checkOutTime
      }`
    );

    if (now < checkIn) return 0;
    if (now > checkOut) return 100;

    const totalDuration = checkOut.getTime() - checkIn.getTime();
    const elapsed = now.getTime() - checkIn.getTime();
    return Math.round((elapsed / totalDuration) * 100);
  };

  // Filter bookings
  const filteredBookings = () => {
    switch (activeTab) {
      case "arriving-today":
        return bookings.filter(
          (booking) => booking.status === "arriving-today"
        );
      case "in-house":
        return bookings.filter((booking) => booking.status === "in-house");
      case "departing-soon":
        return bookings.filter(
          (booking) => booking.status === "departing-soon"
        );
      case "checked-out":
        return bookings.filter((booking) => booking.status === "checked-out");
      case "cancelled":
        return bookings.filter((booking) => booking.status === "cancelled");
      default:
        return bookings;
    }
  };

  // Action handlers
  const handleCheckIn = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: "in-house" as const }
          : booking
      )
    );
    alert(`Đã check-in cho booking ${bookingId}`);
  };

  const handleRoomService = (bookingId: string) => {
    alert(`Đặt room service cho booking ${bookingId}`);
  };

  const handleDailyReport = (booking: HotelBooking) => {
    alert(
      `Báo cáo hàng ngày cho ${booking.pets
        .map((p) => p.name)
        .join(", ")} - Phòng ${booking.roomNumber}`
    );
  };

  const handleRoomStatus = (roomNumber: string) => {
    alert(`Trạng thái phòng ${roomNumber}`);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Quản lý đặt phòng khách sạn 🐾
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Pet Paradise Hotel - Chi nhánh Vinhomes
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
                {hotelOccupancy.occupied}
              </div>
              <div className="text-sm text-gray-500">Phòng đang sử dụng</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">
                {hotelOccupancy.total - hotelOccupancy.occupied}
              </div>
              <div className="text-sm text-gray-500">Phòng trống</div>
            </div>
          </div>
          <div className="flex-1 max-w-xs ml-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Occupancy Rate</span>
              <span>
                {Math.round(
                  (hotelOccupancy.occupied / hotelOccupancy.total) * 100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    (hotelOccupancy.occupied / hotelOccupancy.total) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="grid grid-cols-2 md:flex md:space-x-2 gap-2 mb-6">
        {[
          {
            key: "arriving-today",
            label: "Check-in hôm nay",
            color: "bg-blue-500",
            count: bookings.filter((b) => b.status === "arriving-today").length,
          },
          {
            key: "in-house",
            label: "Đang ở",
            color: "bg-green-500",
            count: bookings.filter((b) => b.status === "in-house").length,
          },
          {
            key: "departing-soon",
            label: "Sắp check-out",
            color: "bg-yellow-500",
            count: bookings.filter((b) => b.status === "departing-soon").length,
          },
          {
            key: "checked-out",
            label: "Đã check-out",
            color: "bg-gray-500",
            count: bookings.filter((b) => b.status === "checked-out").length,
          },
          {
            key: "all",
            label: "Tất cả",
            color: "bg-purple-500",
            count: bookings.length,
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

      {/* Hotel Booking Cards */}
      <div className="space-y-4">
        {filteredBookings().length === 0 ? (
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
            const statusConfig = getStatusConfig(booking.status);
            const roomTypeStyle = getRoomTypeStyle(booking.roomType);
            const stayProgress = getStayProgress(booking);

            return (
              <div
                key={booking.id}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-200 ${statusConfig.color}`}
              >
                {/* Card Header */}
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 mb-2 md:mb-0">
                      <div
                        className={`px-3 py-1 rounded-lg font-bold text-lg ${roomTypeStyle}`}
                      >
                        Phòng {booking.roomType} {booking.roomNumber}
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full border ${statusConfig.badge}`}
                      >
                        {statusConfig.icon} {statusConfig.text}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">#{booking.id}</div>
                  </div>

                  {/* Duration Badge */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      📅 {booking.duration.days} ngày {booking.duration.nights}{" "}
                      đêm
                    </span>
                    {booking.pets.length > 1 && (
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        🐾 {booking.pets.length} thú cưng
                      </span>
                    )}
                  </div>

                  {/* Timeline Visual */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span className="font-medium">
                        Check-in: {booking.checkInDate} - {booking.checkInTime}
                      </span>
                      <span className="font-medium">
                        Check-out: {booking.checkOutDate} -{" "}
                        {booking.checkOutTime}
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

                  {/* Pet & Guest Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">👤</span>
                        <span className="font-medium text-gray-800">
                          {booking.customerName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">📞</span>
                        <span className="text-gray-600">
                          {booking.customerPhone}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {booking.pets.map((pet, index) => (
                        <div
                          key={pet.id}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {pet.avatar ? (
                              <img
                                src={pet.avatar}
                                alt={pet.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-lg">🐕</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {pet.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {pet.type}, {pet.age} tuổi
                            </div>
                            {pet.specialRequirements &&
                              pet.specialRequirements.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {pet.specialRequirements.map((req, i) => (
                                    <span
                                      key={i}
                                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                                    >
                                      ⚠️ {req}
                                    </span>
                                  ))}
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Revenue Details */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">
                          Phòng ({booking.duration.days} ngày ×{" "}
                          {booking.dailyPrice.toLocaleString("vi-VN")}đ)
                        </span>
                        <span className="font-medium">
                          {(
                            booking.duration.days * booking.dailyPrice
                          ).toLocaleString("vi-VN")}
                          đ
                        </span>
                      </div>
                      {booking.addOns.map((addon, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-600">{addon.name}</span>
                          <span className="text-gray-700">
                            +{addon.price.toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                        <span className="font-bold text-gray-800">
                          Tổng cộng
                        </span>
                        <span className="font-bold text-green-600 text-lg">
                          {booking.totalAmount.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Daily Care Checklist */}
                  {booking.careChecklist &&
                    booking.careChecklist.length > 0 && (
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-800 mb-2">
                          📋 Daily Care Progress
                        </h4>
                        <div className="space-y-2">
                          {booking.careChecklist.map((day, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm text-gray-600">
                                {day.date}
                              </span>
                              <div className="flex space-x-2">
                                <span
                                  className={`text-xs px-2 py-1 rounded ${
                                    day.fed
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  🍽️ {day.fed ? "✓" : "⏳"}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded ${
                                    day.walked
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  🚶 {day.walked ? "✓" : "⏳"}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded ${
                                    day.medication
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  💊 {day.medication ? "✓" : "⏳"}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded ${
                                    day.playtime
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  🎾 {day.playtime ? "✓" : "⏳"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Special Notes */}
                  {booking.specialNote && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <span className="text-yellow-600 mt-0.5">💬</span>
                        <span className="text-yellow-800 text-sm italic">
                          "{booking.specialNote}"
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {booking.status === "arriving-today" && (
                      <button
                        onClick={() => handleCheckIn(booking.id)}
                        className="flex-1 md:flex-none px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                      >
                        🏨 Check-in
                      </button>
                    )}

                    {(booking.status === "in-house" ||
                      booking.status === "arriving-today") && (
                      <button
                        onClick={() => handleRoomService(booking.id)}
                        className="flex-1 md:flex-none px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium text-sm"
                      >
                        🍽️ Room Service
                      </button>
                    )}

                    <button
                      onClick={() => handleDailyReport(booking)}
                      className="flex-1 md:flex-none px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
                    >
                      📋 Daily Report
                    </button>

                    <button
                      onClick={() => handleRoomStatus(booking.roomNumber)}
                      className="flex-1 md:flex-none px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
                    >
                      🏠 Room Status
                    </button>

                    <button
                      onClick={() =>
                        window.open(`tel:${booking.customerPhone}`)
                      }
                      className="flex-1 md:flex-none px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm"
                    >
                      💬 Contact
                    </button>
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
