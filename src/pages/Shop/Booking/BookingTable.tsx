// components/BookingTable.tsx
import React from 'react';
import { RoomBooking } from '../../../types';
import { formatCurrency, formatDate, getStatusIcon, getStatusText } from '../../../utils/helper';

interface BookingTableProps {
  bookings: RoomBooking[];
  onViewDetails: (booking: RoomBooking) => void;
  onEdit: (booking: RoomBooking) => void;
  onCancel: (bookingId: number) => void;
  onCheckIn: (bookingId: number) => void;
  onCheckOut: (bookingId: number) => void;
}

const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  onViewDetails,
  onEdit,
  onCancel,
  onCheckIn,
  onCheckOut
}) => {
  const getActionButtons = (booking: RoomBooking) => {
    const buttons = [
      <button
        key="view"
        className="btn-icon btn-view"
        onClick={() => onViewDetails(booking)}
        title="Xem chi tiết"
      >
        👁️
      </button>
    ];

    if (booking.status === 'confirmed') {
      buttons.push(
        <button
          key="checkin"
          className="btn-icon btn-checkin"
          onClick={() => onCheckIn(booking.id)}
          title="Check-in"
        >
          🏨
        </button>
      );
    }

    if (booking.status === 'checked_in') {
      buttons.push(
        <button
          key="checkout"
          className="btn-icon btn-checkout"
          onClick={() => onCheckOut(booking.id)}
          title="Check-out"
        >
          🚪
        </button>
      );
    }

    if (booking.status !== 'checked_out' && booking.status !== 'cancelled') {
      buttons.push(
        <button
          key="edit"
          className="btn-icon btn-edit"
          onClick={() => onEdit(booking)}
          title="Chỉnh sửa"
        >
          📝
        </button>,
        <button
          key="cancel"
          className="btn-icon btn-cancel"
          onClick={() => onCancel(booking.id)}
          title="Hủy đặt phòng"
        >
          🗑️
        </button>
      );
    }

    return buttons;
  };

  if (bookings.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🏨</div>
        <h3>Không có đặt phòng nào</h3>
        <p>Hiện tại chưa có đặt phòng nào phù hợp với bộ lọc của bạn</p>
      </div>
    );
  }

  return (
    <div className="booking-table-container">
      <div className="table-header">
        <h3>📋 Danh sách đặt phòng ({bookings.length})</h3>
      </div>
      
      <div className="table-wrapper">
        <table className="booking-table">
          <thead>
            <tr>
              <th>Phòng</th>
              <th>Khách hàng</th>
              <th>Thời gian thuê</th>
              <th>Dịch vụ đặc biệt</th>
              <th>Trạng thái</th>
              <th>Tổng tiền</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className={`booking-row status-${booking.status}`}>
                <td>
                  <div className="room-info">
                    <div className="room-header">
                      <strong>{booking.room?.room_number}</strong>
                      <span className="room-type-badge">{booking.room?.room_type}</span>
                    </div>
                    <div className="room-details">
                      💰 {formatCurrency(booking.room?.daily_price || 0)}/đêm
                      <br />
                      👥 Sức chứa: {booking.room?.max_capability} người
                      <br />
                      ⭐ {booking.room?.star} sao
                    </div>
                    <div className="amenities">
                      🛏️ {booking.room?.amenities}
                    </div>
                  </div>
                </td>
                
                <td>
                  <div className="customer-info">
                    <div className="customer-header">
                      <strong>{booking.customer_name}</strong>
                    </div>
                    <div className="contact-info">
                      📞 {booking.customer_phone}
                      {booking.customer_email && (
                        <>
                          <br />
                          ✉️ {booking.customer_email}
                        </>
                      )}
                      {booking.customer?.address && (
                        <>
                          <br />
                          📍 {booking.customer.address}
                        </>
                      )}
                      {booking.customer?.id_card && (
                        <>
                          <br />
                          🆔 {booking.customer.id_card}
                        </>
                      )}
                    </div>
                  </div>
                </td>
                
                <td>
                  <div className="booking-time">
                    <div className="time-item">
                      <strong>Check-in:</strong> {formatDate(booking.check_in_date)}
                    </div>
                    <div className="time-item">
                      <strong>Check-out:</strong> {formatDate(booking.check_out_date)}
                    </div>
                    <div className="nights">
                      🌙 {booking.total_night} đêm
                    </div>
                    <div className="booking-date">
                      📅 Đặt: {formatDate(booking.booking_date)}
                    </div>
                  </div>
                </td>
                
                <td>
                  <div className="special-services">
                    {booking.feeding_schedule && (
                      <div className="service-item">
                        <span className="service-icon">🍽️</span>
                        <span className="service-text">{booking.feeding_schedule}</span>
                      </div>
                    )}
                    {booking.medication_schedule && (
                      <div className="service-item">
                        <span className="service-icon">💊</span>
                        <span className="service-text">{booking.medication_schedule}</span>
                      </div>
                    )}
                    {!booking.feeding_schedule && !booking.medication_schedule && (
                      <span className="no-service">Không có dịch vụ đặc biệt</span>
                    )}
                  </div>
                </td>
                
                <td>
                  <span className={`status-badge status-${booking.status}`}>
                    {getStatusIcon(booking.status)} {getStatusText(booking.status)}
                  </span>
                </td>
                
                <td>
                  <div className="amount-info">
                    <strong className="total-amount">
                      {formatCurrency(booking.total_amount)}
                    </strong>
                    <div className="amount-breakdown">
                      {booking.room?.daily_price && (
                        <small>
                          {formatCurrency(booking.room.daily_price)} × {booking.total_night} đêm
                        </small>
                      )}
                    </div>
                  </div>
                </td>
                
                <td>
                  <div className="action-buttons">
                    {getActionButtons(booking)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;
