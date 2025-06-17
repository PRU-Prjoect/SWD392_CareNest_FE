// components/BookingManagement.tsx
import React, { useState, useEffect } from 'react';
import { 
  RoomBooking, 
  BookingFilters, 
  BookingStats, 
  BookingStatus,
  Room,
  Customer 
} from '../../../types';
import BookingTable from '../Booking/BookingTable';
import BookingFiltersComponent from '../Booking/BookingFilters';
import BookingStatsCards from '../Booking/BookingStatsCards';
import BookingDetailModal from '../Booking/BookingDetailModal';
import '../component/BookingManagement.css';

interface BookingManagementProps {
  initialBookings?: RoomBooking[];
}

const BookingManagement: React.FC<BookingManagementProps> = ({ 
  initialBookings = [] 
}) => {
  const [bookings, setBookings] = useState<RoomBooking[]>(initialBookings);
  const [filteredBookings, setFilteredBookings] = useState<RoomBooking[]>(initialBookings);
  const [filters, setFilters] = useState<BookingFilters>({});
  const [selectedBooking, setSelectedBooking] = useState<RoomBooking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<BookingStats>({
    total_bookings: 0,
    current_guests: 0,
    monthly_revenue: 0,
    occupancy_rate: 0
  });

  // Mock data với cấu trúc mới
  const mockBookings: RoomBooking[] = [
    {
      id: 1,
      room_detail_id: 1,
      customer_id: 1,
      customer_name: "Nguyễn Văn A",
      customer_phone: "0901234567",
      customer_email: "nguyenvana@email.com",
      check_in_date: "2025-06-15",
      check_out_date: "2025-06-18",
      total_night: 3,
      total_amount: 1500000,
      booking_date: "2025-06-14T14:30:00",
      feeding_schedule: "Sáng 7h, Chiều 17h",
      medication_schedule: "Uống thuốc tim 2 lần/ngày",
      status: "checked_in",
      room: {
        id: 1,
        hotel_id: 1,
        room_number: "A01",
        room_type: "VIP",
        max_capability: 2,
        daily_price: 500000,
        is_available: false,
        amenities: "Điều hòa, Camera, Đồ chơi cao cấp, Giường king size",
        star: 5,
        created_at: new Date("2025-01-01"),
        updated_at: new Date("2025-06-14")
      },
      customer: {
        id: 1,
        name: "Nguyễn Văn A",
        phone: "0901234567",
        email: "nguyenvana@email.com",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        id_card: "123456789"
      }
    },
    {
      id: 2,
      room_detail_id: 2,
      customer_id: 2,
      customer_name: "Trần Thị B",
      customer_phone: "0987654321",
      customer_email: "tranthib@email.com",
      check_in_date: "2025-06-16",
      check_out_date: "2025-06-17",
      total_night: 1,
      total_amount: 300000,
      booking_date: "2025-06-15T10:00:00",
      status: "confirmed",
      room: {
        id: 2,
        hotel_id: 1,
        room_number: "B02",
        room_type: "Standard",
        max_capability: 2,
        daily_price: 300000,
        is_available: true,
        amenities: "Điều hòa, Camera, WiFi",
        star: 3,
        created_at: new Date("2025-01-01"),
        updated_at: new Date("2025-06-15")
      },
      customer: {
        id: 2,
        name: "Trần Thị B",
        phone: "0987654321",
        email: "tranthib@email.com",
        address: "456 Đường XYZ, Quận 3, TP.HCM"
      }
    }
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
    calculateStats();
  }, [filters, bookings]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBookings(mockBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.booking_date);
      return bookingDate.getMonth() === currentMonth && 
             bookingDate.getFullYear() === currentYear;
    });

    const currentGuests = bookings.filter(booking => 
      booking.status === 'checked_in'
    ).length;
    
    const monthlyRevenue = monthlyBookings.reduce((sum, booking) => 
      sum + booking.total_amount, 0
    );
    
    setStats({
      total_bookings: monthlyBookings.length,
      current_guests: currentGuests,
      monthly_revenue: monthlyRevenue,
      occupancy_rate: Math.round((currentGuests / 20) * 100)
    });
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.customer_name.toLowerCase().includes(searchLower) ||
        booking.room?.room_number.toLowerCase().includes(searchLower) ||
        booking.customer_phone.includes(filters.search!)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(booking => booking.status === filters.status);
    }

    if (filters.room_type) {
      filtered = filtered.filter(booking => 
        booking.room?.room_type === filters.room_type
      );
    }

    if (filters.check_in_from) {
      filtered = filtered.filter(booking => 
        booking.check_in_date >= filters.check_in_from!
      );
    }

    if (filters.check_in_to) {
      filtered = filtered.filter(booking => 
        booking.check_in_date <= filters.check_in_to!
      );
    }

    setFilteredBookings(filtered);
  };

  const handleViewDetails = (booking: RoomBooking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleEditBooking = (booking: RoomBooking) => {
    console.log('Edit booking:', booking);
    // Implement edit logic
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đặt phòng này?')) {
      try {
        setBookings(prev => prev.map(booking =>
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' as BookingStatus } 
            : booking
        ));
      } catch (error) {
        console.error('Error cancelling booking:', error);
      }
    }
  };

  const handleCheckIn = async (bookingId: number) => {
    try {
      setBookings(prev => prev.map(booking =>
        booking.id === bookingId 
          ? { ...booking, status: 'checked_in' as BookingStatus } 
          : booking
      ));
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  const handleCheckOut = async (bookingId: number) => {
    try {
      setBookings(prev => prev.map(booking =>
        booking.id === bookingId 
          ? { ...booking, status: 'checked_out' as BookingStatus } 
          : booking
      ));
    } catch (error) {
      console.error('Error checking out:', error);
    }
  };

  return (
    <div className="booking-management">
      <div className="booking-header">
        <h1>🏨 Quản lý Đặt phòng Khách sạn Thú cưng</h1>
        <button className="btn-primary">
          + Thêm đặt phòng mới
        </button>
      </div>

      <BookingStatsCards stats={stats} />

      <div className="booking-content">
        <BookingFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
        />

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <BookingTable
            bookings={filteredBookings}
            onViewDetails={handleViewDetails}
            onEdit={handleEditBooking}
            onCancel={handleCancelBooking}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
        )}
      </div>

      {isModalOpen && selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BookingManagement;
