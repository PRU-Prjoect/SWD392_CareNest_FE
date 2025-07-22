import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createRoomBooking } from '@/store/slices/roomBookingSlice';
import type { AppDispatch, RootState } from '@/store/store';
import DateTimePicker from '@/components/DateTimePicker/DateTimePicker';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import dayjs from 'dayjs';

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

const PetHotelBooking: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { creating, createError } = useSelector((state: RootState) => state.roomBooking);
  const { user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    room_detail_id: roomId || '',
    customer_id: user?.id || '',
    check_in_date: '',
    check_out_date: '',
    feeding_schedule: '',
    medication_schedule: '',
    total_night: 1,
    total_amount: 0,
    status: true,
  });

  const [roomPrice, setRoomPrice] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Here you would fetch the room details to get the price
    // For now we'll use a placeholder value
    setRoomPrice(100); // example price per night
  }, [roomId]);

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
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
      const resultAction = await dispatch(createRoomBooking(formData));
      if (createRoomBooking.fulfilled.match(resultAction)) {
        // Navigate to thank you page with booking information
        navigate('/app/thank-you', {
          state: {
            ...formData,
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
              <DateTimePicker
                onChange={handleDateChange('check_in_date')}
                value={formData.check_in_date}
                className="w-full"
                error={validationErrors.check_in_date}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
              <DateTimePicker
                onChange={handleDateChange('check_out_date')}
                value={formData.check_out_date}
                className="w-full"
                error={validationErrors.check_out_date}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Feeding Schedule (e.g., "Morning: 8AM, Evening: 6PM")
            </label>
            <Input
              type="text"
              name="feeding_schedule"
              value={formData.feeding_schedule}
              onChange={handleInputChange}
              placeholder="Describe your pet's feeding schedule"
              className="w-full"
            />
            {validationErrors.feeding_schedule && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.feeding_schedule}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medication Schedule (if applicable)
            </label>
            <Input
              type="text"
              name="medication_schedule"
              value={formData.medication_schedule}
              onChange={handleInputChange}
              placeholder="Describe any medications your pet needs"
              className="w-full"
            />
          </div>
          
          <div className="border-t border-gray-200 pt-4 mb-4">
            <div className="flex justify-between mb-2">
              <span>Price per night:</span>
              <span>${roomPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Number of nights:</span>
              <span>{formData.total_night}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${formData.total_amount.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              disabled={creating}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => handleSubmit(new Event('click') as unknown as React.FormEvent)}
            >
              {creating ? <span className="mr-2"><Spinner size="sm" /></span> : null}
              Complete Booking
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PetHotelBooking; 