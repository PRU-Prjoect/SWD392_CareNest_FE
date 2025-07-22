import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getHotelById } from '@/store/slices/hotelSlice';
import { getRoomBookings } from '@/store/slices/roomBookingSlice';
import { getRooms } from '@/store/slices/roomSlice';
import type { AppDispatch, RootState } from '@/store/store';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { MapPin, Phone, ArrowLeft, Calendar, Clock, DollarSign } from 'lucide-react';

// Thêm danh sách hình ảnh cố định cho khách sạn
const hotelImages = [
  'https://i.pinimg.com/736x/62/bc/13/62bc13771bf76b97e28f881e2431d03d.jpg',
  'https://i.pinimg.com/736x/0e/f5/44/0ef544ff32f62a595148c85330645277.jpg'
];

// Hàm lấy hình ảnh khách sạn dựa trên ID
const getHotelImage = (id: string): string => {
  // Chuyển id thành số để có thể sử dụng làm index
  const idSum = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return hotelImages[idSum % hotelImages.length];
};

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

// Map booking status to display string
const getBookingStatusLabel = (status: boolean) => {
  return status ? 'Đang hoạt động' : 'Đã hủy';
};

// Map booking status to color
const getBookingStatusColor = (status: boolean) => {
  return status 
    ? 'bg-green-100 text-green-800 border-green-200' 
    : 'bg-red-100 text-red-800 border-red-200';
};

const HotelBookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { currentHotel, loading: hotelLoading } = useSelector((state: RootState) => state.hotel);
  const { roomBookings, loading: bookingsLoading } = useSelector((state: RootState) => state.roomBooking);
  const { rooms, loading: roomsLoading } = useSelector((state: RootState) => state.room);
  
  const [activeTab, setActiveTab] = useState<'info' | 'bookings'>('info');

  useEffect(() => {
    if (id) {
      // Fetch hotel details
      dispatch(getHotelById(id));
      
      // Fetch rooms for this hotel
      dispatch(getRooms());
      
      // Fetch bookings 
      dispatch(getRoomBookings());
    }
  }, [dispatch, id]);
  
  // Filter rooms and bookings for this hotel
  const hotelRooms = rooms.filter(room => room.hotel_id === id);
  
  // Create a map of room_id -> room details for quick lookup
  const roomsMap = hotelRooms.reduce((map, room) => {
    map[room.id] = room;
    return map;
  }, {} as Record<string, any>);
  
  // Get all bookings for rooms in this hotel
  const hotelBookings = roomBookings.filter(booking => {
    const room = hotelRooms.find(r => r.id === booking.room_detail_id);
    return !!room;
  });

  // Handlers
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleViewBooking = (bookingId: string) => {
    // Navigate to booking details page when implemented
    console.log(`View booking ${bookingId}`);
  };

  if (hotelLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!currentHotel) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <div className="mb-6 text-red-500">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy khách sạn</h2>
          <p className="text-gray-600 mb-6">Khách sạn bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <button 
            onClick={() => navigate('/app/hotel-services')}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Quay lại danh sách khách sạn
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center mb-4">
            <button
              onClick={handleBack}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentHotel.name}</h1>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{currentHotel.address_name || 'Địa chỉ chưa cập nhật'}</span>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'info'
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Thông tin khách sạn
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'bookings'
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Đặt phòng ({hotelBookings.length})
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'info' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Hotel details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hotel image placeholder */}
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center overflow-hidden">
                {/* Hiển thị hình ảnh thực từ URL cố định */}
                {id && (
                  <img 
                    src={getHotelImage(id)}
                    alt={currentHotel.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              {/* Hotel information */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin khách sạn</h2>
                <p className="text-gray-700 mb-6">{currentHotel.description}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Tổng số phòng</p>
                    <p className="text-xl font-bold text-blue-600">{currentHotel.total_room}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Phòng trống</p>
                    <p className="text-xl font-bold text-green-600">{currentHotel.available_room}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Đánh giá</p>
                    <p className="text-xl font-bold text-yellow-600">
                      {currentHotel.avg_rating?.toFixed(1) || '5.0'}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <p className={`text-lg font-bold ${currentHotel.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {currentHotel.is_active ? 'Đang hoạt động' : 'Tạm dừng'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Room list */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Danh sách phòng</h2>
                
                {roomsLoading ? (
                  <div className="py-6 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
                  </div>
                ) : hotelRooms.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">Không có phòng nào</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hotelRooms.map(room => (
                      <div key={room.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between mb-2">
                          <h3 className="text-lg font-semibold">Phòng {room.room_number}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            room.is_available 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {room.is_available ? 'Còn trống' : 'Đã đặt'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                          <div className="flex items-center">
                            <span className="font-medium mr-1">Loại:</span>
                            {mapRoomTypeToString(room.room_type)}
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-1">Sao:</span>
                            {room.star}
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-1">Sức chứa:</span>
                            {room.max_capacity} thú cưng
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1 text-teal-600" />
                            {room.daily_price.toLocaleString('vi-VN')}đ/ngày
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 border-t pt-2 mt-2">
                          <span className="font-medium">Tiện nghi:</span> {room.amendities || 'Chưa cập nhật'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Right column - Contact information */}
            <div>
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Liên hệ</h3>
                
                <div className="border-b pb-4 mb-4">
                  <div className="flex items-center text-gray-700 mb-3">
                    <Phone className="w-5 h-5 mr-2 text-teal-600" />
                    <span>+84 123 456 789</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-5 h-5 mr-2 text-teal-600" />
                    <span>{currentHotel.address_name || 'Địa chỉ chưa cập nhật'}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate(`/app/hotel-booking/${id}`)}
                  className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Đặt phòng ngay
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Danh sách đặt phòng</h2>
            
            {bookingsLoading ? (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
              </div>
            ) : hotelBookings.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mb-4">
                  <Calendar className="w-16 h-16 mx-auto text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Không có đặt phòng nào</h3>
                <p className="text-gray-500">Hiện tại chưa có ai đặt phòng tại khách sạn này.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phòng
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày nhận - trả
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số đêm
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tổng tiền
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {hotelBookings.map((booking) => {
                      // Find room details
                      const room = roomsMap[booking.room_detail_id];
                      return (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              Phòng {room ? room.room_number : 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {room ? mapRoomTypeToString(room.room_type) : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {booking.check_in_date ? format(parseISO(booking.check_in_date), 'dd/MM/yyyy', { locale: vi }) : 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.check_out_date ? format(parseISO(booking.check_out_date), 'dd/MM/yyyy', { locale: vi }) : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{booking.total_night} đêm</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.total_amount.toLocaleString('vi-VN')}đ
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full border ${getBookingStatusColor(booking.status)}`}>
                              {getBookingStatusLabel(booking.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleViewBooking(booking.id)}
                              className="text-teal-600 hover:text-teal-900"
                            >
                              Chi tiết
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelBookingDetail; 