// components/BookingFilters.tsx
import React from 'react';
import { BookingFilters } from '../../../types/booking';

interface BookingFiltersProps {
  filters: BookingFilters;
  onFiltersChange: (filters: BookingFilters) => void;
}

const BookingFiltersComponent: React.FC<BookingFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const handleFilterChange = (key: keyof BookingFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="booking-filters">
      <div className="filter-row">
        <div className="filter-group">
          <input
            type="text"
            placeholder="🔍 Tìm theo tên khách hoặc số phòng..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="status-filter"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="confirmed">Đã đặt</option>
            <option value="checked_in">Đang ở</option>
            <option value="checked_out">Đã trả phòng</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Từ ngày:</label>
          <input
            type="date"
            value={filters.check_in_from || ''}
            onChange={(e) => handleFilterChange('check_in_from', e.target.value)}
            className="date-input"
          />
        </div>

        <div className="filter-group">
          <label>Đến ngày:</label>
          <input
            type="date"
            value={filters.check_in_to || ''}
            onChange={(e) => handleFilterChange('check_in_to', e.target.value)}
            className="date-input"
          />
        </div>

        <div className="filter-group">
          <button
            onClick={clearFilters}
            className="btn-clear-filters"
          >
            🗑️ Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingFiltersComponent;
