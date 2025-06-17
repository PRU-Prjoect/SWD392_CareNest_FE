// utils/helpers.ts
import { BookingStatus } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusIcon = (status: BookingStatus): string => {
  const iconMap: Record<BookingStatus, string> = {
    'confirmed': '🔵',
    'checked_in': '🟢',
    'checked_out': '✅',
    'cancelled': '❌'
  };
  return iconMap[status] || '⚪';
};

export const getStatusText = (status: BookingStatus): string => {
  const statusMap: Record<BookingStatus, string> = {
    'confirmed': 'Đã đặt',
    'checked_in': 'Đang ở',
    'checked_out': 'Đã trả phòng',
    'cancelled': 'Đã hủy'
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: BookingStatus): string => {
  const colorMap: Record<BookingStatus, string> = {
    'confirmed': '#007bff',
    'checked_in': '#28a745',
    'checked_out': '#6c757d',
    'cancelled': '#dc3545'
  };
  return colorMap[status] || '#6c757d';
};

export const calculateNights = (checkIn: string, checkOut: string): number => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};
