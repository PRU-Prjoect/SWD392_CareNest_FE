import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createRoomBooking } from '@/store/slices/roomBookingSlice';
import { getRooms } from '@/store/slices/roomSlice';
import { getHotelById } from '@/store/slices/hotelSlice';
import type { AppDispatch, RootState } from '@/store/store';
import DateTimePicker from '@/components/DateTimePicker/DateTimePicker';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// Extend dayjs with UTC plugin
dayjs.extend(utc);

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

// Interface cho Room
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

const PetHotelBooking: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { creating, createError } = useSelector((state: RootState) => state.roomBooking);
  const { user } = useSelector((state: RootState) => state.auth);
  const { rooms, loading: roomsLoading } = useSelector((state: RootState) => state.room);
  const { loading: hotelLoading } = useSelector((state: RootState) => state.hotel);

  // State để kiểm tra xem roomId là ID của phòng hay của khách sạn
  const [isHotelId, setIsHotelId] = useState(false);
  const [hotelRooms, setHotelRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  
  // Flag để theo dõi xem đã tải dữ liệu phòng chưa
  const [hasLoadedRooms, setHasLoadedRooms] = useState(false);

  const [formData, setFormData] = useState({
    room_detail_id: '',
    customer_id: user?.id || '',
    check_in_date: '',
    check_out_date: '',
    feeding_schedule: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'), // Đảm bảo UTC
    medication_schedule: dayjs().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'), // Đảm bảo UTC
    total_night: 1,
    total_amount: 0,
    status: true,
  });

  // Store the feeding schedule description separately for any additional notes
  const [feedingScheduleDesc, setFeedingScheduleDesc] = useState('');
  const [medicationScheduleDesc, setMedicationScheduleDesc] = useState('');

  const [roomPrice, setRoomPrice] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Fetch rooms only once when component mounts
  useEffect(() => {
    dispatch(getRooms());
  }, [dispatch]);

  // Process rooms data after it's loaded
  useEffect(() => {
    if (roomId && rooms.length > 0 && !hasLoadedRooms) {
      setHasLoadedRooms(true);
      
      // Check if roomId matches any room
      const roomMatch = rooms.find(room => room.id === roomId);
      
      if (roomMatch) {
        // If it's a room ID, set it directly
        setIsHotelId(false);
        setFormData(prev => ({
          ...prev,
          room_detail_id: roomId
        }));
        setRoomPrice(roomMatch.daily_price || 0);
      } else {
        // It might be a hotel ID, try to fetch the hotel
        setIsHotelId(true);
        dispatch(getHotelById(roomId))
          .unwrap()
          .then(() => {
            // Filter rooms for this hotel
            const filteredRooms = rooms.filter(room => room.hotel_id === roomId);
            setHotelRooms(filteredRooms);
          })
          .catch(error => {
            console.error('Could not fetch hotel:', error);
          });
      }
    }
  }, [dispatch, roomId, rooms, hasLoadedRooms]);

  // Phần code xử lý hiển thị giá tiền
  const formatCurrency = (amount: number): string => {
    return `${amount.toLocaleString('vi-VN')}đ`;
  };

  // Update room price when a room is selected from the list
  useEffect(() => {
    if (selectedRoomId) {
      const selectedRoom = rooms.find(room => room.id === selectedRoomId);
      if (selectedRoom) {
        setRoomPrice(selectedRoom.daily_price || 0);
        setFormData(prev => ({
          ...prev,
          room_detail_id: selectedRoomId
        }));
      }
    }
  }, [selectedRoomId, rooms]);

  useEffect(() => {
    if (formData.check_in_date && formData.check_out_date) {
      const startDate = dayjs(formData.check_in_date);
      const endDate = dayjs(formData.check_out_date);
      const nights = endDate.diff(startDate, 'day');
      
      if (nights > 0) {
        setFormData({
          ...formData,
          total_night: nights,
          total_amount: nights * roomPrice
        });
      }
    }
  }, [formData.check_in_date, formData.check_out_date, roomPrice]);

  const handleDateChange = (field: string) => (value: string) => {
    // Với các trường DateTime, đảm bảo lưu ở định dạng UTC
    if (field === 'feeding_schedule' || field === 'medication_schedule') {
      setFormData({
        ...formData,
        [field]: dayjs(value).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'feeding_schedule_desc') {
      setFeedingScheduleDesc(value);
    } else if (name === 'medication_schedule_desc') {
      setMedicationScheduleDesc(value);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.room_detail_id) errors.room_detail_id = 'Room is required';
    if (!formData.customer_id) errors.customer_id = 'Customer ID is required';
    if (!formData.check_in_date) errors.check_in_date = 'Check-in date is required';
    if (!formData.check_out_date) errors.check_out_date = 'Check-out date is required';
    if (!formData.feeding_schedule) errors.feeding_schedule = 'Feeding schedule is required';
    
    const startDate = dayjs(formData.check_in_date);
    const endDate = dayjs(formData.check_out_date);
    if (endDate.isBefore(startDate) || endDate.isSame(startDate)) {
      errors.check_out_date = 'Check-out date must be after check-in date';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Đảm bảo tất cả các trường DateTime là UTC khi gửi đi
      const apiData = {
        ...formData,
        // Đảm bảo feeding_schedule và medication_schedule là UTC
        feeding_schedule: dayjs(formData.feeding_schedule).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        medication_schedule: dayjs(formData.medication_schedule).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      };

      console.log('Submitting booking with data:', apiData);
      
      const resultAction = await dispatch(createRoomBooking(apiData));
      if (createRoomBooking.fulfilled.match(resultAction)) {
        // Navigate to thank you page with booking information and include the descriptions
        navigate('/app/thank-you', {
          state: {
            ...formData,
            feeding_schedule_desc: feedingScheduleDesc,
            medication_schedule_desc: medicationScheduleDesc,
            id: new Date().getTime().toString(), // Use timestamp as temporary ID
          }
        });
      }
    } catch (error) {
      console.error('Failed to book room:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert 
          variant="error" 
          title="Authentication Required" 
          message="Please log in to book a room" 
        />
      </div>
    );
  }

  if (isHotelId && hotelRooms.length === 0 && !hotelLoading && !roomsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert 
          variant="error" 
          title="Không tìm thấy phòng" 
          message="Không tìm thấy phòng nào thuộc khách sạn này hoặc tất cả đã được đặt" 
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Đặt phòng khách sạn thú cưng</h1>
      
      {/* Hiển thị hình ảnh khách sạn */}
      <div className="mb-6 rounded-lg overflow-hidden shadow-md max-w-2xl mx-auto">
        <img 
          src={getHotelImage(roomId || '1')} 
          alt="Pet Hotel Room"
          className="w-full h-64 object-cover"
        />
      </div>
      
      {/* Hiển thị loading khi đang tải dữ liệu */}
      {(roomsLoading || hotelLoading) && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {isHotelId && hotelRooms.length > 0 ? (
        <Card className="p-6 max-w-2xl mx-auto mb-6">
          <h2 className="text-xl font-bold mb-4">Chọn phòng</h2>
          <p className="text-gray-600 mb-4">Vui lòng chọn một phòng trước khi tiếp tục.</p>
          
          <div className="grid gap-4">
            {hotelRooms.map(room => (
              <div 
                key={room.id}
                className={`border p-4 rounded-lg cursor-pointer transition-all ${
                  selectedRoomId === room.id ? 'border-teal-500 bg-teal-50' : 'hover:border-gray-400'
                }`}
                onClick={() => handleRoomSelect(room.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">Phòng {room.room_number}</h3>
                    <div className="text-sm text-gray-600">
                      {mapRoomTypeToString(room.room_type)} • Sức chứa: {room.max_capacity} thú cưng
                    </div>
                    <div className="text-sm mt-1">{room.amendities}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-teal-600 font-semibold text-lg">
                      {formatCurrency(room.daily_price)}
                    </div>
                    <div className="text-xs text-gray-500">mỗi đêm</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
      
      <Card className="p-6 max-w-2xl mx-auto">
        {createError && (
          <Alert
            variant="error"
            title="Booking Error"
            message={createError.message}
          />
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Ngày nhận phòng</label>
              <DateTimePicker
                onChange={handleDateChange('check_in_date')}
                value={formData.check_in_date}
                className="w-full"
                error={validationErrors.check_in_date}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Ngày trả phòng</label>
              <DateTimePicker
                onChange={handleDateChange('check_out_date')}
                value={formData.check_out_date}
                className="w-full"
                error={validationErrors.check_out_date}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Thời gian cho ăn
              </label>
              <DateTimePicker
                onChange={handleDateChange('feeding_schedule')}
                value={formData.feeding_schedule}
                className="w-full"
                error={validationErrors.feeding_schedule}
              />
              <p className="text-xs text-gray-500 mt-1">Chọn thời gian cho thú cưng ăn</p>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Thời gian uống thuốc (nếu có)
              </label>
              <DateTimePicker
                onChange={handleDateChange('medication_schedule')}
                value={formData.medication_schedule}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Chọn thời gian cho thú cưng uống thuốc</p>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Ghi chú về việc cho ăn (không bắt buộc)
            </label>
            <Input
              type="text"
              name="feeding_schedule_desc"
              value={feedingScheduleDesc}
              onChange={handleInputChange}
              placeholder="Mô tả chi tiết về thói quen ăn uống của thú cưng (loại thức ăn, số lượng,...)"
              className="w-full"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Ghi chú về việc dùng thuốc (không bắt buộc)
            </label>
            <Input
              type="text"
              name="medication_schedule_desc"
              value={medicationScheduleDesc}
              onChange={handleInputChange}
              placeholder="Mô tả chi tiết về thuốc men của thú cưng nếu có"
              className="w-full"
            />
          </div>
          
          <div className="border-t border-gray-200 pt-4 mb-4">
            <div className="flex justify-between mb-2">
              <span>Giá phòng:</span>
              <span>{formatCurrency(roomPrice)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Số đêm:</span>
              <span>{formData.total_night}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Tổng tiền:</span>
              <span>{formatCurrency(formData.total_amount)}</span>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              disabled={creating || (isHotelId && !selectedRoomId) || !formData.room_detail_id}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => handleSubmit(new Event('click') as unknown as React.FormEvent)}
            >
              {creating ? <span className="mr-2"><Spinner size="sm" /></span> : null}
              {isHotelId && !selectedRoomId ? 'Vui lòng chọn phòng' : 'Hoàn tất đặt phòng'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PetHotelBooking; 