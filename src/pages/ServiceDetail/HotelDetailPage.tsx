import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { MapPin, Star, Calendar, Clock, ChevronLeft, Phone, Info, Home } from 'lucide-react';
import { getHotelById } from '../../store/slices/hotelSlice';
import { getRooms } from '../../store/slices/roomSlice';
import type { AppDispatch, RootState } from '../../store/store';
import { handleContextualError } from '../../utils/errorHandling';

// Định nghĩa interfaces
interface Room {
  id: string;
  room_number: number;
  room_type: number;
  max_capacity: number;
  daily_price: number;
  is_available: boolean;
  amendities: string;
  star: number;
  hotel_id: string;
  images?: string[];
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

// Map room type to color
const getRoomTypeColor = (type: number) => {
  const typeString = mapRoomTypeToString(type);
  switch (typeString) {
    case 'VIP': return 'bg-purple-100 text-purple-800';
    case 'Suite': return 'bg-amber-100 text-amber-800';
    case 'Standard': return 'bg-blue-100 text-blue-800';
    case 'Economy': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Lấy thông tin khách sạn và phòng từ Redux store
  const { currentHotel, loading: hotelLoading, error: hotelError } = useSelector((state: RootState) => state.hotel);
  const { rooms, loading: roomsLoading } = useSelector((state: RootState) => state.room);
  
  // Local state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingDays, setBookingDays] = useState(1);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Lấy thông tin khách sạn và phòng khi component được mount
  useEffect(() => {
    if (id) {
      dispatch(getHotelById(id))
        .unwrap()
        .then(() => {
          dispatch(getRooms());
        })
        .catch((error) => {
          handleContextualError(error, "fetch");
        });
    }
  }, [dispatch, id]);
  
  // Xử lý lỗi
  useEffect(() => {
    if (hotelError) {
      handleContextualError(hotelError, "fetch");
    }
  }, [hotelError]);
  
  // Filter phòng theo khách sạn hiện tại
  const hotelRooms = rooms.filter(room => room.hotel_id === id);
  
  // Xử lý khi chọn phòng
  const handleSelectRoom = (room: Room) => {
    if (!room.is_available) {
      toast.warning("Phòng này hiện đã được đặt");
      return;
    }
    
    setSelectedRoom(room);
    setShowBookingModal(true);
  };
  
  // Xử lý khi thay đổi số ngày đặt phòng
  const handleChangeDays = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 30) {
      setBookingDays(value);
    }
  };
  
  // Xử lý đặt phòng
  const handleBookRoom = () => {
    if (!selectedRoom || !selectedDate) {
      toast.warning("Vui lòng chọn ngày đặt phòng");
      return;
    }
    
    // Chuyển hướng đến trang đặt phòng với thông tin phòng đã chọn
    navigate('/booking', {
      state: {
        hotelId: id,
        hotelName: currentHotel?.name,
        roomId: selectedRoom.id,
        roomNumber: selectedRoom.room_number,
        roomType: mapRoomTypeToString(selectedRoom.room_type),
        price: selectedRoom.daily_price,
        checkInDate: selectedDate,
        days: bookingDays,
        totalPrice: selectedRoom.daily_price * bookingDays
      }
    });
  };
  
  // Handle quay lại
  const handleBack = () => {
    navigate(-1);
  };
  
  // Loading state
  if (hotelLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin khách sạn...</p>
        </div>
      </div>
    );
  }
  
  // Error state hoặc không tìm thấy khách sạn
  if (!currentHotel || hotelError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy khách sạn</h2>
          <p className="text-gray-600 mb-6">
            Khách sạn bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => navigate('/hotel-services')}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Quay lại danh sách khách sạn
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <ToastContainer position="top-right" />
      
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Quay lại"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentHotel.name}</h1>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{currentHotel.address_name || 'Địa chỉ chưa cập nhật'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Hotel info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hotel images (placeholder) */}
            <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center">
              <Home className="w-16 h-16 text-gray-400" />
            </div>
            
            {/* Hotel description */}
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
                  <div className="flex items-center justify-center">
                    <p className="text-xl font-bold text-yellow-600 mr-1">
                      {currentHotel.avg_rating?.toFixed(1) || '5.0'}
                    </p>
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Danh sách phòng</h2>
                <div className="text-sm text-gray-500">
                  {roomsLoading ? 'Đang tải...' : `${hotelRooms.length} phòng`}
                </div>
              </div>
              
              {roomsLoading ? (
                <div className="py-12 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
                </div>
              ) : hotelRooms.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-gray-500">Không có phòng nào</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {hotelRooms.map(room => (
                    <div 
                      key={room.id} 
                      className={`border rounded-lg p-4 transition-shadow hover:shadow-md ${!room.is_available ? 'opacity-60' : ''}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 mr-3">
                              Phòng {room.room_number}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs ${getRoomTypeColor(room.room_type)}`}>
                              {mapRoomTypeToString(room.room_type)}
                            </span>
                            <div className="ml-auto md:hidden">
                              <span className="text-lg font-bold text-teal-600">
                                {room.daily_price.toLocaleString('vi-VN')}đ
                              </span>
                              <span className="text-sm text-gray-500">/ngày</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <Star className="w-4 h-4 mr-1 text-yellow-500" />
                              <span>{room.star} sao</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>Sức chứa: {room.max_capacity} thú cưng</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Tiện nghi:</span> {room.amendities || 'Chưa cập nhật'}
                          </p>
                          
                          <div className="mt-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${room.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {room.is_available ? 'Còn phòng' : 'Đã đặt'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <div className="hidden md:block mb-2">
                            <span className="text-lg font-bold text-teal-600">
                              {room.daily_price.toLocaleString('vi-VN')}đ
                            </span>
                            <span className="text-sm text-gray-500">/ngày</span>
                          </div>
                          
                          <button
                            onClick={() => handleSelectRoom(room)}
                            disabled={!room.is_available}
                            className={`px-4 py-2 rounded-lg ${
                              room.is_available
                                ? 'bg-teal-600 text-white hover:bg-teal-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            } transition-colors`}
                          >
                            {room.is_available ? 'Đặt phòng' : 'Hết phòng'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right column - Booking form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Liên hệ đặt phòng</h3>
              
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
              
              <div className="text-gray-700 mb-4">
                <h4 className="font-medium mb-2">Giới thiệu</h4>
                <p className="text-sm text-gray-600 line-clamp-4">
                  {currentHotel.description}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-2">Thông tin khách sạn</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng số phòng:</span>
                    <span className="font-medium">{currentHotel.total_room}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phòng trống:</span>
                    <span className="font-medium text-green-600">{currentHotel.available_room}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Đánh giá:</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-1">{currentHotel.avg_rating?.toFixed(1) || '5.0'}</span>
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/booking', { state: { hotelId: id } })}
                className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Đặt phòng ngay
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking modal */}
      {showBookingModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Đặt phòng {selectedRoom.room_number}</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày nhận phòng
                </label>
                <input
                  type="date"
                  value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số ngày
                </label>
                <input
                  type="number"
                  value={bookingDays}
                  onChange={handleChangeDays}
                  min="1"
                  max="30"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Giá phòng:</span>
                  <span>{selectedRoom.daily_price.toLocaleString('vi-VN')}đ/ngày</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Số ngày:</span>
                  <span>{bookingDays} ngày</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-gray-200 mt-2">
                  <span>Tổng tiền:</span>
                  <span className="text-teal-600">
                    {(selectedRoom.daily_price * bookingDays).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleBookRoom}
                disabled={!selectedDate}
                className={`px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors ${!selectedDate ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetailPage; 