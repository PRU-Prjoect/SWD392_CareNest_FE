// components/BookingStatsCards.tsx
import React from 'react';
import { BookingStats } from '../../../types/booking';
import { formatCurrency } from '../../../utils/helper';

interface BookingStatsCardsProps {
  stats: BookingStats;
}

const BookingStatsCards: React.FC<BookingStatsCardsProps> = ({ stats }) => {
  return (
    <div className="stats-overview">
      <div className="stat-card">
        <div className="stat-icon">📊</div>
        <div className="stat-content">
          <h3>Tổng phòng đã thuê</h3>
          <p className="big-number">{stats.total_bookings}</p>
          <small>Trong tháng này</small>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🏨</div>
        <div className="stat-content">
          <h3>Phòng đang có khách</h3>
          <p className="big-number">{stats.current_guests}</p>
          <small>Hiện tại</small>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">💰</div>
        <div className="stat-content">
          <h3>Doanh thu</h3>
          <p className="big-number">{formatCurrency(stats.monthly_revenue)}</p>
          <small>Tháng 6/2025</small>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">📈</div>
        <div className="stat-content">
          <h3>Tỷ lệ lấp đầy</h3>
          <p className="big-number">{stats.occupancy_rate}%</p>
          <small>Trung bình tháng</small>
        </div>
      </div>
    </div>
  );
};

export default BookingStatsCards;
