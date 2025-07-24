import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  getAllAppointments,
  getAppointmentById,
  deleteAppointment,
  getAppointmentReport,
} from '@/store/slices/appointmentSlice';
import { getCustomerById } from '@/store/slices/customerSlice';
import { AppointmentStatus } from '@/types/enums';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import AdminPageHeader from './components/AdminPageHeader';
import TableActions from './components/TableActions';
import StatCard from './components/StatCard';
import { FaCalendarAlt, FaSearch, FaChartBar, FaEye } from 'react-icons/fa';

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

// Interface for appointment search request for our local use
interface AppointmentSearchParams {
  customerId?: string;
  status?: AppointmentStatus;
  startTime?: string;
  endTime?: string;
  locationTy?: string;
  limit?: number;
  offset?: number;
}

// Get status badge color
const getStatusBadgeColor = (status: string): "primary" | "success" | "error" | "warning" | "info" => {
  switch(status.toLowerCase()) {
    case 'finish':
      return 'success';
    case 'cancel':
      return 'error';
    case 'inprogress':
      return 'warning';
    case 'noprogress':
    default:
      return 'info';
  }
};

// Format status for display
const formatStatus = (status: string) => {
  switch(status.toLowerCase()) {
    case 'finish':
      return 'Hoàn thành';
    case 'cancel':
      return 'Đã hủy';
    case 'inprogress':
      return 'Đang xử lý';
    case 'noprogress':
      return 'Chưa xử lý';
    default:
      return status;
  }
};

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const AppointmentsManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const [customerId, setCustomerId] = useState('');
  const [status, setStatus] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  // Map to store customer information by ID
  const [customerMap, setCustomerMap] = useState<Record<string, { full_name: string }>>({});
  // Use a ref to track which customer IDs have already been requested
  const fetchedCustomerIds = React.useRef<Set<string>>(new Set());

  const {
    appointments,
    currentAppointment,
    reportData,
    searching,
    loading,
    deleting,
    loadingReport,
    searchError,
    error,
    deleteError,
    reportError,
  } = useAppSelector((state) => state.appointment);

  useEffect(() => {
    // Load appointments when component mounts
    dispatch(getAllAppointments({}));
  }, [dispatch]);

  // Fetch customer information when appointments change
  useEffect(() => {
    const fetchCustomers = async () => {
      const uniqueCustomerIds = [...new Set(appointments.map(app => app.customer_id))];
      
      for (const id of uniqueCustomerIds) {
        if (!customerMap[id] && !fetchedCustomerIds.current.has(id)) {
          fetchedCustomerIds.current.add(id); // Mark this ID as requested
          try {
            const result = await dispatch(getCustomerById(id)).unwrap();
            if (result.data) {
              setCustomerMap(prev => ({
                ...prev,
                [id]: { full_name: result.data.full_name }
              }));
            }
          } catch (error) {
            console.error(`Failed to fetch customer ${id}:`, error);
          }
        }
      }
    };

    if (appointments.length > 0) {
      fetchCustomers();
    }
  }, [appointments, dispatch]);

  const handleSearch = () => {
    const params: AppointmentSearchParams = {};
    if (customerId) params.customerId = customerId;
    if (status) {
      // Convert status string to AppointmentStatus enum
      switch (status) {
        case 'finish':
          params.status = AppointmentStatus.Finish;
          break;
        case 'cancel':
          params.status = AppointmentStatus.Cancel;
          break;
        case 'inprogress':
          params.status = AppointmentStatus.InProgress;
          break;
        case 'noprogress':
          params.status = AppointmentStatus.NoProgress;
          break;
      }
    }
    
    // Use a properly typed parameter object
    dispatch(getAllAppointments(params));
  };

  const handleOpenDeleteModal = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteAppointment = () => {
    if (selectedAppointmentId) {
      dispatch(deleteAppointment(selectedAppointmentId))
        .unwrap()
        .then(() => {
          setIsDeleteModalOpen(false);
          setSelectedAppointmentId(null);
        });
    }
  };

  const handleViewAppointment = (appointmentId: string) => {
    dispatch(getAppointmentById(appointmentId))
      .unwrap()
      .then(() => {
        setSelectedAppointmentId(appointmentId);
        setIsDetailModalOpen(true);
      });
  };

  const handleOpenReportModal = () => {
    dispatch(getAppointmentReport());
    setIsReportModalOpen(true);
  };

  // Handle redirect on auth error
  useEffect(() => {
    if (
      (searchError && searchError.code === 401) ||
      (deleteError && deleteError.code === 401) ||
      (reportError && reportError.code === 401) ||
      (error && error.code === 401)
    ) {
      // Handle redirect to login page
      window.location.href = '/login';
    }
  }, [searchError, deleteError, reportError, error]);

  // Function to count finished appointments
  const getFinishedAppointmentsCount = () => {
    return appointments.filter(appointment => 
      appointment.status.toLowerCase() === 'finish'
    ).length;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <AdminPageHeader
        title="Quản lý lịch hẹn"
        description="Quản lý tất cả các lịch hẹn trong hệ thống"
      />

      <div className="mb-6 grid md:grid-cols-3 gap-4">
        <StatCard
          title="Tổng số lịch hẹn"
          value={appointments.length}
          icon={<FaCalendarAlt />}
          color="blue"
        />
        <StatCard
          title="Lịch hẹn hoàn thành"
          value={getFinishedAppointmentsCount()}
          icon={<FaCalendarAlt />}
          color="green"
        />
        <Button 
          onClick={handleOpenReportModal} 
          className="h-full flex items-center justify-center gap-2"
        >
          <FaChartBar className="h-5 w-5" />
          Xem báo cáo chi tiết
        </Button>
      </div>

      <Card>
        <div className="p-4">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <h2 className="text-xl font-semibold mb-2 md:mb-0">Danh sách lịch hẹn</h2>
            <div className="flex gap-2 flex-wrap">
              <div className="flex">
                <input
                  type="text"
                  placeholder="ID khách hàng..."
                  className="border rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                />
              </div>
              <div className="flex">
                <select
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="finish">Hoàn thành</option>
                  <option value="cancel">Đã hủy</option>
                  <option value="inprogress">Đang xử lý</option>
                  <option value="noprogress">Chưa xử lý</option>
                </select>
              </div>
              <Button
                onClick={handleSearch}
                disabled={searching}
              >
                {searching ? <Spinner size="sm" /> : <FaSearch />} Tìm kiếm
              </Button>
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
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian thực hiện</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.length > 0 ? (
                    appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{appointment.id.substring(0, 8)}...</td>
                        <td className="px-6 py-4 whitespace-nowrap">{customerMap[appointment.customer_id]?.full_name || appointment.customer_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(appointment.start_time)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge color={getStatusBadgeColor(appointment.status)}>
                            {formatStatus(appointment.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleViewAppointment(appointment.id)}
                              className="p-1 rounded-full text-blue-500 hover:bg-blue-50 ml-2"
                              title="Xem chi tiết"
                              type="button"
                            >
                              <FaEye className="h-5 w-5" />
                            </button>
                            <TableActions 
                              onDelete={() => handleOpenDeleteModal(appointment.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center">
                        {searchError ? searchError.message : 'Không có lịch hẹn nào'}
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
        title="Xác nhận xóa lịch hẹn"
      >
        <div className="p-4">
          <p>Bạn có chắc chắn muốn xóa lịch hẹn này không? Hành động này không thể hoàn tác.</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleDeleteAppointment}
              disabled={deleting}
            >
              {deleting ? <Spinner size="sm" /> : 'Xóa'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Appointment Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Chi tiết lịch hẹn"
      >
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center my-4">
              <Spinner size="lg" />
            </div>
          ) : currentAppointment ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">ID lịch hẹn</p>
                <p className="font-medium">{currentAppointment.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Khách hàng</p>
                <p className="font-medium">
                  {customerMap[currentAppointment.customer_id]?.full_name ? (
                    <>
                      {customerMap[currentAppointment.customer_id].full_name}
                      <span className="text-xs text-gray-500 ml-2">({currentAppointment.customer_id})</span>
                    </>
                  ) : (
                    currentAppointment.customer_id
                  )}
                </p>
              </div>
              {currentAppointment.location_type && (
                <div>
                  <p className="text-sm text-gray-500">Loại địa điểm</p>
                  <p className="font-medium">{currentAppointment.location_type}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <Badge color={getStatusBadgeColor(currentAppointment.status)}>
                  {formatStatus(currentAppointment.status)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Thời gian bắt đầu</p>
                <p className="font-medium">{formatDate(currentAppointment.start_time)}</p>
              </div>
              {currentAppointment.end_time && (
                <div>
                  <p className="text-sm text-gray-500">Thời gian kết thúc</p>
                  <p className="font-medium">{formatDate(currentAppointment.end_time)}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Ghi chú</p>
                <p className="font-medium">{currentAppointment.notes || 'Không có ghi chú'}</p>
              </div>
            </div>
          ) : (
            <p className="text-center py-4">
              {error ? error.message : 'Không tìm thấy thông tin lịch hẹn'}
            </p>
          )}
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => setIsDetailModalOpen(false)}
            >
              Đóng
            </Button>
          </div>
        </div>
      </Modal>

      {/* Appointment Report Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Báo cáo lịch hẹn"
        size="lg"
      >
        <div className="p-4">
          {loadingReport ? (
            <div className="flex justify-center my-8">
              <Spinner size="lg" />
            </div>
          ) : reportData ? (
            <div>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <StatCard
                  title="Tổng số lịch hẹn"
                  value={reportData.total}
                  color="blue"
                />
                <StatCard
                  title="Hoàn thành"
                  value={reportData.finish}
                  color="green"
                />
                <StatCard
                  title="Đã hủy"
                  value={reportData.cancel}
                  color="red"
                />
                <StatCard
                  title="Đang xử lý"
                  value={reportData.inProgress}
                  color="orange"
                />
              </div>

              <div className="grid md:grid-cols-1 gap-4 mb-6">
                <StatCard
                  title="Chưa xử lý"
                  value={reportData.noProgress}
                  color="purple"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium">Tỷ lệ hoàn thành: {reportData.finishPercent.toFixed(1)}%</p>
                  <p className="text-sm font-medium">Tỷ lệ hủy: {reportData.cancelPercent.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Tỷ lệ đang xử lý: {reportData.inProgressPercent.toFixed(1)}%</p>
                  <p className="text-sm font-medium">Tỷ lệ chưa xử lý: {reportData.noProgressPercent.toFixed(1)}%</p>
                </div>
              </div>
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

export default AppointmentsManagement; 