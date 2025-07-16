import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import {
  searchHotels,
  createHotel,
  updateHotel,
  deleteHotel,
  
} from '../../../store/slices/hotelSlice';
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom
} from '../../../store/slices/roomSlice';
import { searchSubAddresses } from '../../../store/slices/subAddressSlice';

// Định nghĩa interfaces dựa trên cấu trúc trong slice
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
}

interface Hotel {
  id: string;
  name: string;
  description: string;
  total_room: number;
  available_room: number;
  shop_id: string;
  sub_address_id: string;
  is_active: boolean;
}

interface HotelWithRooms extends Hotel {
  rooms: Room[];
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

const HotelManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedHotel, setSelectedHotel] = useState<HotelWithRooms | null>(null);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [shopId, setShopId] = useState<string>('');

  // Lấy data từ Redux store
  const {
    hotels,
    loading: hotelsLoading,
    error: hotelsError,
    creating: hotelCreating,
    updating: hotelUpdating,
    deleting: hotelDeleting,

  } = useSelector((state: RootState) => state.hotel);

  const {
    rooms,
    loading: roomsLoading,
    // error: roomsError,
    creating: roomCreating,
    updating: roomUpdating,
    deleting: roomDeleting
  } = useSelector((state: RootState) => state.room);

  // Lấy thông tin shop từ Redux auth
  const { user } = useSelector((state: RootState) => state.auth);

  // Kết hợp hotels và rooms để tạo HotelWithRooms
  const hotelsWithRooms: HotelWithRooms[] = hotels.map(hotel => ({
    ...hotel,
    rooms: rooms.filter(room => room.hotel_id === hotel.id)
  }));

  // Lấy danh sách khách sạn khi component được mount
  useEffect(() => {
    if (user && user.id) {
      setShopId(user.id);
      // Tìm kiếm khách sạn theo shop ID
      dispatch(searchHotels({ shopId: user.id }));
    }
  }, [dispatch, user]);

  // Lấy danh sách phòng khi có danh sách khách sạn
  useEffect(() => {
    if (hotels.length > 0) {
      dispatch(getRooms());
    }
  }, [dispatch, hotels]);

  const handleAddHotel = () => {
    setEditingHotel(null);
    setShowHotelModal(true);
  };

  const handleEditHotel = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setShowHotelModal(true);
  };

  const handleDeleteHotel = (hotelId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa khách sạn này?')) {
      dispatch(deleteHotel(hotelId));
    }
  };

  const handleAddRoom = (hotel: HotelWithRooms) => {
    setSelectedHotel(hotel);
    setEditingRoom(null);
    setShowRoomModal(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setShowRoomModal(true);
  };

  const handleDeleteRoom = (roomId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      dispatch(deleteRoom(roomId));
    }
  };

  const getRoomTypeColor = (type: number) => {
    const typeString = mapRoomTypeToString(type);
    switch (typeString) {
      case 'VIP': return 'bg-purple-100 text-purple-800';
      case 'Suite': return 'bg-gold-100 text-gold-800';
      case 'Standard': return 'bg-blue-100 text-blue-800';
      case 'Economy': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý khách sạn thú cưng
          </h1>
          <button
            onClick={handleAddHotel}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            disabled={hotelCreating}
          >
            {hotelCreating ? 'Đang tạo...' : '+ Thêm khách sạn mới'}
          </button>
        </div>

        {/* Hiển thị lỗi nếu có */}
        {hotelsError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {hotelsError.message}
          </div>
        )}

        {/* Loading indicator */}
        {hotelsLoading && (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
            <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
          </div>
        )}

        {/* Danh sách khách sạn */}
        {!hotelsLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hotelsWithRooms.length > 0 ? (
              hotelsWithRooms.map((hotel) => (
                <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Header khách sạn */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{hotel.name}</h2>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-yellow-400 ${i < Math.round(hotel.rooms.reduce((sum, room) => sum + room.star, 0) / (hotel.rooms.length || 1)) ? 'opacity-100' : 'opacity-30'}`}>⭐</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditHotel(hotel)}
                          className="text-blue-600 hover:text-blue-800"
                          disabled={hotelUpdating}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteHotel(hotel.id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={hotelDeleting}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{hotel.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Tổng phòng:</span>
                        <span className="ml-2 font-medium">{hotel.total_room}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Phòng trống:</span>
                        <span className="ml-2 font-medium text-green-600">{hotel.available_room}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        hotel.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {hotel.is_active ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                    </div>
                  </div>

                  {/* Danh sách phòng */}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Danh sách phòng ({hotel.rooms.length})
                      </h3>
                      <button
                        onClick={() => handleAddRoom(hotel)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                        disabled={roomCreating}
                      >
                        {roomCreating ? 'Đang tạo...' : '+ Thêm phòng'}
                      </button>
                    </div>

                    {roomsLoading && (
                      <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                      </div>
                    )}

                    {!roomsLoading && hotel.rooms.length > 0 ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {hotel.rooms.map((room) => (
                          <div key={room.id} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  Phòng {room.room_number}
                                </h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoomTypeColor(room.room_type)}`}>
                                  {mapRoomTypeToString(room.room_type)}
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditRoom(room)}
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                  disabled={roomUpdating}
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDeleteRoom(room.id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                  disabled={roomDeleting}
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>

                            <div className="text-xs text-gray-600 space-y-1">
                              <p>Sức chứa: {room.max_capacity} thú cưng</p>
                              <p>Giá: {room.daily_price.toLocaleString('vi-VN')}đ/ngày</p>
                              <p>Tiện nghi: {room.amendities}</p>
                              <p className={`${room.is_available ? 'text-green-600' : 'text-red-600'}`}>
                                {room.is_available ? 'Có sẵn' : 'Đã đặt'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Chưa có phòng nào</p>
                        <p className="text-sm">Nhấn "Thêm phòng" để bắt đầu</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-10 bg-white rounded-lg shadow-md">
                <p className="text-gray-500 mb-4">Chưa có khách sạn nào</p>
                <button
                  onClick={handleAddHotel}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  + Thêm khách sạn mới
                </button>
              </div>
            )}
          </div>
        )}

        {/* Thống kê tổng quan */}
        {!hotelsLoading && hotelsWithRooms.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-500">Tổng khách sạn</h3>
              <p className="text-2xl font-bold text-gray-900">{hotelsWithRooms.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-500">Tổng phòng</h3>
              <p className="text-2xl font-bold text-blue-600">
                {hotelsWithRooms.reduce((sum, hotel) => sum + hotel.total_room, 0)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-500">Phòng trống</h3>
              <p className="text-2xl font-bold text-green-600">
                {hotelsWithRooms.reduce((sum, hotel) => sum + hotel.available_room, 0)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-sm font-medium text-gray-500">Tỷ lệ lấp đầy</h3>
              <p className="text-2xl font-bold text-purple-600">
                {hotelsWithRooms.length > 0 ? 
                  Math.round(((hotelsWithRooms.reduce((sum, hotel) => sum + hotel.total_room, 0) - 
                  hotelsWithRooms.reduce((sum, hotel) => sum + hotel.available_room, 0)) / 
                  hotelsWithRooms.reduce((sum, hotel) => sum + hotel.total_room, 0)) * 100) : 0}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal thêm/sửa khách sạn */}
      {showHotelModal && (
        <HotelModal
          hotel={editingHotel}
          shopId={shopId}
          isOpen={showHotelModal}
          onClose={() => setShowHotelModal(false)}
          onSave={(hotelData) => {
            if (editingHotel) {
              // Update hotel
              dispatch(updateHotel({
                ...hotelData,
                id: editingHotel.id
              }));
            } else {
              // Add new hotel
              dispatch(createHotel(hotelData));
            }
            setShowHotelModal(false);
          }}
        />
      )}

      {/* Modal thêm/sửa phòng */}
      {showRoomModal && (
        <RoomModal
          room={editingRoom}
          hotel={selectedHotel}
          isOpen={showRoomModal}
          onClose={() => setShowRoomModal(false)}
          onSave={(roomData) => {
            if (editingRoom) {
              // Update room
              dispatch(updateRoom({
                ...roomData,
                id: editingRoom.id,
                hotel_id: editingRoom.hotel_id
              }));
            } else {
              // Add new room
              dispatch(createRoom({
                ...roomData,
                hotel_id: selectedHotel!.id
              }));
            }
            setShowRoomModal(false);
          }}
        />
      )}
    </div>
  );
};

interface RoomModalProps {
  room: Room | null;
  hotel: HotelWithRooms | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (room: Omit<Room, 'id' | 'hotel_id'>) => void;
}

const RoomModal: React.FC<RoomModalProps> = ({ room, hotel, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    room_number: 1,
    room_type: 1,
    max_capacity: 1,
    daily_price: 0,
    is_available: true,
    amendities: '',
    star: 3
  });

  useEffect(() => {
    if (room) {
      setFormData({
        room_number: room.room_number,
        room_type: room.room_type,
        max_capacity: room.max_capacity,
        daily_price: room.daily_price,
        is_available: room.is_available,
        amendities: room.amendities,
        star: room.star
      });
    } else {
      setFormData({
        room_number: 1,
        room_type: 1,
        max_capacity: 1,
        daily_price: 0,
        is_available: true,
        amendities: '',
        star: 3
      });
    }
  }, [room, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {room ? 'Chỉnh sửa phòng' : `Thêm phòng mới - ${hotel?.name}`}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số phòng *
              </label>
              <input
                type="number"
                value={formData.room_number}
                onChange={(e) => setFormData({...formData, room_number: parseInt(e.target.value) || 1})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại phòng
              </label>
              <select
                value={formData.room_type}
                onChange={(e) => setFormData({...formData, room_type: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={0}>Economy</option>
                <option value={1}>Standard</option>
                <option value={2}>Suite</option>
                <option value={3}>VIP</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sức chứa *
              </label>
              <input
                type="number"
                value={formData.max_capacity}
                onChange={(e) => setFormData({...formData, max_capacity: parseInt(e.target.value) || 1})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá/ngày (VNĐ) *
              </label>
              <input
                type="number"
                value={formData.daily_price}
                onChange={(e) => setFormData({...formData, daily_price: parseInt(e.target.value) || 0})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiện nghi
            </label>
            <textarea
              value={formData.amendities}
              onChange={(e) => setFormData({...formData, amendities: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="VD: Điều hòa, Camera, Đồ chơi..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đánh giá sao
            </label>
            <select
              value={formData.star}
              onChange={(e) => setFormData({...formData, star: parseInt(e.target.value)})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {[1, 2, 3, 4, 5].map(star => (
                <option key={star} value={star}>{star} sao</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Phòng có sẵn</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 transition-all duration-200 font-medium"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition-all duration-200 font-medium shadow-sm"
            >
              {room ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface HotelModalProps {
  hotel: Hotel | null;
  shopId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (hotel: Omit<Hotel, 'id'>) => void;
}

const HotelModal: React.FC<HotelModalProps> = ({ hotel, shopId, isOpen, onClose, onSave }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    total_room: 0,
    available_room: 0,
    shop_id: '',
    sub_address_id: '1', // Giá trị mặc định, có thể cần điều chỉnh
    is_active: true,
  });
  
  // Get subAddresses from Redux store
  const { subAddresses, searching: loadingAddresses } = useSelector((state: RootState) => state.subAddress);

  // Fetch sub-addresses when component mounts
  useEffect(() => {
    if (shopId) {
      dispatch(searchSubAddresses({ shopId }));
    }
  }, [dispatch, shopId]);

  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name,
        description: hotel.description,
        total_room: hotel.total_room,
        available_room: hotel.available_room,
        shop_id: hotel.shop_id,
        sub_address_id: hotel.sub_address_id,
        is_active: hotel.is_active,
      });
    } else {
      // Reset form khi thêm mới
      setFormData({
        name: '',
        description: '',
        total_room: 0,
        available_room: 0,
        shop_id: shopId,
        sub_address_id: subAddresses.length > 0 ? subAddresses[0].id : '1',
        is_active: true,
      });
    }
  }, [hotel, shopId, isOpen, subAddresses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {hotel ? 'Chỉnh sửa khách sạn' : 'Thêm khách sạn mới'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên khách sạn *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="VD: Pet Paradise Hotel"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Mô tả về khách sạn thú cưng..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ *
            </label>
            {loadingAddresses ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-t-2 border-teal-500 border-solid rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500">Đang tải...</span>
              </div>
            ) : (
              <select
                value={formData.sub_address_id}
                onChange={(e) => setFormData({...formData, sub_address_id: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
              >
                {subAddresses.length > 0 ? (
                  subAddresses.map(address => (
                    <option key={address.id} value={address.id}>{address.address_name}</option>
                  ))
                ) : (
                  <option value="">Không có địa chỉ nào</option>
                )}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tổng số phòng *
              </label>
              <input
                type="number"
                value={formData.total_room}
                onChange={(e) => {
                  const totalRooms = parseInt(e.target.value) || 0;
                  setFormData({
                    ...formData, 
                    total_room: totalRooms,
                    available_room: Math.min(formData.available_room, totalRooms)
                  });
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phòng trống
              </label>
              <input
                type="number"
                value={formData.available_room}
                onChange={(e) => setFormData({...formData, available_room: parseInt(e.target.value) || 0})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                min="0"
                max={formData.total_room}
              />
            </div>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Khách sạn đang hoạt động</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              {hotel ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HotelManagement;
