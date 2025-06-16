import React, { useState, useEffect } from 'react';
import type { Hotel, Room, HotelWithRooms } from '../../types/hotel';

const HotelManagement: React.FC = () => {
  const [hotels, setHotels] = useState<HotelWithRooms[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<HotelWithRooms | null>(null);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Sample data
  const sampleHotels: HotelWithRooms[] = [
    {
      id: 1,
      name: 'Pet Paradise Hotel',
      description: 'Khách sạn cao cấp dành cho thú cưng',
      total_room: 20,
      available_room: 15,
      shop_id: 1,
      sub_address_id: 1,
      is_active: true,
      star: 5,
      rooms: [
        {
          id: 1,
          hotel_id: 1,
          room_number: 'A01',
          room_type: 'VIP',
          max_capability: 2,
          daily_price: 500000,
          is_available: true,
          amenities: 'Điều hòa, Camera, Đồ chơi cao cấp',
          star: 5
        },
        {
          id: 2,
          hotel_id: 1,
          room_number: 'B01',
          room_type: 'Standard',
          max_capability: 1,
          daily_price: 300000,
          is_available: false,
          amenities: 'Quạt, Đồ chơi cơ bản',
          star: 3
        }
      ]
    },
    {
      id: 2,
      name: 'Cozy Pet Inn',
      description: 'Khách sạn ấm cúng cho thú cưng nhỏ',
      total_room: 15,
      available_room: 12,
      shop_id: 1,
      sub_address_id: 2,
      is_active: true,
      star: 4,
      rooms: []
    }
  ];

  useEffect(() => {
    setHotels(sampleHotels);
  }, []);

  const handleAddHotel = () => {
    setEditingHotel(null);
    setShowHotelModal(true);
  };

  const handleEditHotel = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setShowHotelModal(true);
  };

  const handleDeleteHotel = (hotelId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa khách sạn này?')) {
      setHotels(hotels.filter(h => h.id !== hotelId));
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

  const handleDeleteRoom = (roomId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      setHotels(hotels.map(hotel => ({
        ...hotel,
        rooms: hotel.rooms.filter(r => r.id !== roomId)
      })));
    }
  };

  const getRoomTypeColor = (type: Room['room_type']) => {
    switch (type) {
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
          >
            + Thêm khách sạn mới
          </button>
        </div>

        {/* Danh sách khách sạn */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header khách sạn */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{hotel.name}</h2>
                    <div className="flex items-center mt-1">
                      {[...Array(hotel.star)].map((_, i) => (
                        <span key={i} className="text-yellow-400">⭐</span>
                      ))}
                      <span className="ml-2 text-sm text-gray-500">({hotel.star} sao)</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditHotel(hotel)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteHotel(hotel.id)}
                      className="text-red-600 hover:text-red-800"
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
                  >
                    + Thêm phòng
                  </button>
                </div>

                {hotel.rooms.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {hotel.rooms.map((room) => (
                      <div key={room.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Phòng {room.room_number}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoomTypeColor(room.room_type)}`}>
                              {room.room_type}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditRoom(room)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        <div className="text-xs text-gray-600 space-y-1">
                          <p>Sức chứa: {room.max_capability} thú cưng</p>
                          <p>Giá: {room.daily_price.toLocaleString('vi-VN')}đ/ngày</p>
                          <p>Tiện nghi: {room.amenities}</p>
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
          ))}
        </div>

        {/* Thống kê tổng quan */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Tổng khách sạn</h3>
            <p className="text-2xl font-bold text-gray-900">{hotels.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Tổng phòng</h3>
            <p className="text-2xl font-bold text-blue-600">
              {hotels.reduce((sum, hotel) => sum + hotel.total_room, 0)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Phòng trống</h3>
            <p className="text-2xl font-bold text-green-600">
              {hotels.reduce((sum, hotel) => sum + hotel.available_room, 0)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Tỷ lệ lấp đầy</h3>
            <p className="text-2xl font-bold text-purple-600">
              {hotels.length > 0 ? 
                Math.round(((hotels.reduce((sum, hotel) => sum + hotel.total_room, 0) - 
                hotels.reduce((sum, hotel) => sum + hotel.available_room, 0)) / 
                hotels.reduce((sum, hotel) => sum + hotel.total_room, 0)) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Modal thêm/sửa khách sạn */}
      {showHotelModal && (
        <HotelModal
          hotel={editingHotel}
          isOpen={showHotelModal}
          onClose={() => setShowHotelModal(false)}
          onSave={(hotelData) => {
            if (editingHotel) {
              // Update hotel
              setHotels(hotels.map(h => h.id === editingHotel.id ? { ...h, ...hotelData } : h));
            } else {
              // Add new hotel
              const newHotel: HotelWithRooms = {
                ...hotelData,
                id: Date.now(),
                rooms: []
              };
              setHotels([...hotels, newHotel]);
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
              setHotels(hotels.map(hotel => ({
                ...hotel,
                rooms: hotel.rooms.map(r => r.id === editingRoom.id ? { ...r, ...roomData } : r)
              })));
            } else {
              // Add new room
              const newRoom: Room = {
                ...roomData,
                id: Date.now(),
                hotel_id: selectedHotel!.id
              };
              setHotels(hotels.map(hotel => 
                hotel.id === selectedHotel!.id 
                  ? { ...hotel, rooms: [...hotel.rooms, newRoom] }
                  : hotel
              ));
            }
            setShowRoomModal(false);
          }}
        />
      )}
    </div>
  );
};

export default HotelManagement;
