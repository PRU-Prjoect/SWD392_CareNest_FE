import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  searchHotels,
  deleteHotel,
  getHotelReport,
} from '@/store/slices/hotelSlice';
// Import individual UI components correctly
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
// For components that might not exist, use inline components
import AdminPageHeader from './components/AdminPageHeader';
import TableActions from './components/TableActions';
import StatCard from './components/StatCard';
import { FaHotel, FaSearch, FaChartBar } from 'react-icons/fa';

// Simple table component as fallback for missing Table component
const Table: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <table className="min-w-full divide-y divide-gray-200">{children}</table>;
};

// Simple modal component as fallback for missing Modal component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-4xl',
    xl: 'max-w-7xl',
  };
  
  const modalSize = size === 'lg' ? sizeClasses.lg : 
                   size === 'xl' ? sizeClasses.xl : 
                   size === 'sm' ? sizeClasses.sm : 
                   sizeClasses.md;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto" 
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
      onClick={(e) => {
        // Close only if clicking the backdrop area (not the modal content)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-[#00000080] transition-opacity" 
          aria-hidden="true" 
        ></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className={`relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full ${modalSize}`}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center pb-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">{title}</h3>
              <button 
                type="button" 
                onClick={onClose} 
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Đóng</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const HotelsManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  // Debugging logs for modal state
  console.log("Modal states:", { isReportModalOpen, isDeleteModalOpen });

  const {
    hotels,
    hotelReport,
    searching,
    deleting,
    reportLoading,
    searchError,
    deleteError,
    reportError,
  } = useAppSelector((state) => state.hotel);

  // Debug log for hotel report data
  useEffect(() => {
    console.log("Hotel report data:", hotelReport);
  }, [hotelReport]);

  useEffect(() => {
    dispatch(searchHotels());
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(searchHotels({ nameFilter: searchTerm }));
  };

  const handleOpenDeleteModal = (hotelId: string) => {
    setSelectedHotelId(hotelId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteHotel = () => {
    if (selectedHotelId) {
      dispatch(deleteHotel(selectedHotelId))
        .unwrap()
        .then(() => {
          setIsDeleteModalOpen(false);
          setSelectedHotelId(null);
        });
    }
  };

  const handleOpenReportModal = (shopId: string) => {
    console.log("Opening report modal for shop ID:", shopId);
    dispatch(getHotelReport(shopId));
    setIsReportModalOpen(true);
  };

  // Handle redirect on auth error
  useEffect(() => {
    if (
      (searchError && searchError.code === 401) ||
      (deleteError && deleteError.code === 401) ||
      (reportError && reportError.code === 401)
    ) {
      // Handle redirect to login page
      window.location.href = '/login';
    }
  }, [searchError, deleteError, reportError]);

  return (
    <div className="container mx-auto px-4 py-6">
      <AdminPageHeader
        title="Quản lý khách sạn/cơ sở"
        description="Quản lý tất cả khách sạn và cơ sở trong hệ thống"
      />

      <div className="mb-6 grid md:grid-cols-3 gap-4">
        <StatCard
          title="Tổng số khách sạn"
          value={hotels.length}
          icon={<FaHotel />}
          color="blue"
        />
        <StatCard
          title="Khách sạn hoạt động"
          value={hotels.filter(hotel => hotel.is_active).length}
          icon={<FaHotel />}
          color="green"
        />
        <StatCard
          title="Khách sạn không hoạt động"
          value={hotels.filter(hotel => !hotel.is_active).length}
          icon={<FaHotel />}
          color="red"
        />
      </div>

      <Card>
        <div className="p-4">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <h2 className="text-xl font-semibold mb-2 md:mb-0">Danh sách khách sạn/cơ sở</h2>
            <div className="flex gap-2">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Tìm theo tên..."
                  className="border rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  onClick={handleSearch}
                  className="rounded-l-none"
                  disabled={searching}
                >
                  {searching ? <Spinner size="sm" /> : <FaSearch />}
                </Button>
              </div>
            </div>
          </div>

          {searching ? (
            <div className="flex justify-center my-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên khách sạn</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số phòng</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng khả dụng</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hotels.length > 0 ? (
                    hotels.map((hotel) => (
                      <tr key={hotel.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{hotel.name}</td>
                        <td className="px-6 py-4 max-w-xs truncate">{hotel.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{hotel.total_room}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{hotel.available_room}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge color={hotel.is_active ? 'success' : 'error'}>
                            {hotel.is_active ? 'Hoạt động' : 'Không hoạt động'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <TableActions 
                              onDelete={() => handleOpenDeleteModal(hotel.id)}
                              // Bỏ prop onView để ẩn nút xem chi tiết (icon mắt)
                            />
                            <button 
                              onClick={() => {
                                console.log("Report button clicked for shop ID:", hotel.shop_id);
                                handleOpenReportModal(hotel.shop_id);
                              }}
                              className="p-1 rounded-full text-blue-500 hover:bg-blue-50 ml-2"
                              title="Báo cáo"
                              type="button"
                            >
                              <FaChartBar className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">
                        {searchError ? searchError.message : 'Không có khách sạn nào'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Xác nhận xóa khách sạn"
      >
        <div className="p-4">
          <p>Bạn có chắc chắn muốn xóa khách sạn này không? Hành động này không thể hoàn tác.</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleDeleteHotel}
              disabled={deleting}
            >
              {deleting ? <Spinner size="sm" /> : 'Xóa'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Hotel Report Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Báo cáo khách sạn"
        size="lg"
      >
        <div className="p-4">
          {reportLoading ? (
            <div className="flex justify-center my-8">
              <Spinner size="lg" />
            </div>
          ) : hotelReport ? (
            <div>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <StatCard
                  title="Tổng số phòng"
                  value={hotelReport.globalTotalRooms}
                  color="blue"
                />
                <StatCard
                  title="Phòng khả dụng"
                  value={hotelReport.globalAvailableRooms}
                  color="green"
                />
                <StatCard
                  title="Tỷ lệ phòng trống"
                  value={`${hotelReport.globalAvailableRoomsPercent.toFixed(2)}%`}
                  color="purple"
                />
              </div>

              <h3 className="text-lg font-semibold mb-2">Chi tiết từng khách sạn</h3>
              <Table>
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên khách sạn</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng số phòng</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng khả dụng</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ trống (%)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hotelReport.hotelList.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.address_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.totalRooms}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.availableRooms}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.availableRoomsPercent.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p className="text-center py-4">
              {reportError ? reportError.message : 'Không có dữ liệu báo cáo'}
            </p>
          )}
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => setIsReportModalOpen(false)}
            >
              Đóng
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HotelsManagement; 