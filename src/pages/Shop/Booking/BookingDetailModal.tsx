// components/BookingDetailModal.tsx
import React from 'react';
import { RoomBooking, TimelineEvent } from '../../../types/booking';
import { formatCurrency, formatDateTime } from '../../../utils/helper';

interface BookingDetailModalProps {
  booking: RoomBooking;
  onClose: () => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ booking, onClose }) => {
  const timelineEvents: TimelineEvent[] = [
    {
      date: booking.booking_date,
      event: 'Đặt phòng',
      completed: true
    },
    {
      date: `${booking.check_in_date}T15:00:00`,
      event: 'Check-in',
      completed: booking.status === 'checked_in' || booking.status === 'checked_out'
    },
    {
      date: `${booking.check_out_date}T12:00:00`,
      event: 'Check-out dự kiến',
      completed: booking.status === 'checked_out'
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chi tiết đặt phòng #{booking.id}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="booking-detail-sections">
            {/* Room Information */}
            <div className="detail-section">
              <h3>🏨 Thông tin phòng</h3>
              <div className="room-detail">
                <p><strong>Số phòng:</strong> {booking.room?.room_number}</p>
                <p><strong>Loại phòng:</strong> {booking.room?.room_type}</p>
                <p><strong>Giá phòng:</strong> {formatCurrency(booking.room?.daily_price || 0)}/đêm</p>
                <p><strong>Sức chứa:</strong> {booking.room?.max_capability} người</p>
                <p><strong>Tiện nghi:</strong> {booking.room?.amenities}</p>
                <p><strong>Đánh giá:</strong> {'⭐'.repeat(booking.room?.star || 0)}</p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="detail-section">
              <h3>👤 Thông tin khách hàng</h3>
              <div className="customer-detail">
                <p><strong>Họ tên:</strong> {booking.customer_name}</p>
                <p><strong>Số điện thoại:</strong> {booking.customer_phone}</p>
                {booking.customer_email && (
                  <p><strong>Email:</strong> {booking.customer_email}</p>
                )}
              </div>
            </div>

            {/* Booking Information */}
            <div className="detail-section">
              <h3>📅 Thông tin đặt phòng</h3>
              <div className="booking-detail">
                <p><strong>Ngày đặt:</strong> {formatDateTime(booking.booking_date)}</p>
                <p><strong>Check-in:</strong> {formatDateTime(`${booking.check_in_date}T15:00:00`)}</p>
                <p><strong>Check-out:</strong> {formatDateTime(`${booking.check_out_date}T12:00:00`)}</p>
                <p><strong>Số đêm:</strong> {booking.total_night} đêm</p>
                <p><strong>Tổng tiền:</strong> {formatCurrency(booking.total_amount)}</p>
                <p><strong>Trạng thái:</strong> 
                  <span className={`status-badge status-${booking.status}`}>
                    {getStatusText(booking.status)}
                  </span>
                </p>
              </div>
            </div>

            {/* Special Services */}
            {(booking.feeding_schedule || booking.medication_schedule) && (
              <div className="detail-section">
                <h3>🐾 Dịch vụ đặc biệt</h3>
                <div className="services-detail">
                  {booking.feeding_schedule && (
                    <p><strong>Lịch cho ăn:</strong> {booking.feeding_schedule}</p>
                  )}
                  {booking.medication_schedule && (
                    <p><strong>Lịch uống thuốc:</strong> {booking.medication_schedule}</p>
                  )}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="detail-section">
              <h3>📅 Lịch trình</h3>
              <div className="timeline">
                {timelineEvents.map((event, index) => (
                  <div key={index} className={`timeline-item ${event.completed ? 'completed' : 'pending'}`}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <span className="timeline-date">{formatDateTime(event.date)}</span>
                      <span className="timeline-event">{event.event}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Đóng</button>
          <button className="btn-primary">Chỉnh sửa</button>
        </div>
      </div>
    </div>
  );
};

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'confirmed': 'Đã đặt',
    'checked_in': 'Đang ở',
    'checked_out': 'Đã trả phòng',
    'cancelled': 'Đã hủy'
  };
  return statusMap[status] || status;
};

export default BookingDetailModal;
