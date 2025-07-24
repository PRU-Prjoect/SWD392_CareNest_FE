import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getAllServices, deleteService } from '@/store/slices/serviceSlice';
import { searchServiceTypes } from '@/store/slices/serviceTypeShopSlice';
import { getShopById } from '@/store/slices/shopSlice';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import AdminPageHeader from './components/AdminPageHeader';
import TableActions from './components/TableActions';
import StatCard from './components/StatCard';
import { FaSearch, FaRegListAlt } from 'react-icons/fa';

// Simple modal component for delete confirmation
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto" 
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
      onClick={(e) => {
        // Close only if clicking the backdrop area
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-[#00000080] transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
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

// Format price with locale
const formatPrice = (price?: number) => {
  if (price === undefined) return "N/A";
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Format active status to show badge
const getStatusBadge = (isActive: boolean) => {
  return isActive ? (
    <Badge color="success">Hoạt động</Badge>
  ) : (
    <Badge color="error">Không hoạt động</Badge>
  );
};

// Truncate long text
const truncateText = (text: string, maxLength = 30) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const ServicesManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchName, setSearchName] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [shopNames, setShopNames] = useState<Record<string, string>>({});
  const [loadingShopNames, setLoadingShopNames] = useState(false);

  const { 
    services, 
    searching, 
    deleting,
    searchError
  } = useAppSelector((state) => state.service);
  
  const { 
    serviceTypes, 
    searching: searchingTypes 
  } = useAppSelector((state) => state.serviceTypeShop);

  // Load services and service types on component mount
  useEffect(() => {
    dispatch(getAllServices());
    dispatch(searchServiceTypes());
  }, [dispatch]);

  // Fetch shop names for all services
  useEffect(() => {
    const fetchShopNames = async () => {
      setLoadingShopNames(true);
      const uniqueShopIds = [...new Set(services.map(service => service.shop_id))];
      const namesMap: Record<string, string> = {};
      
      for (const shopId of uniqueShopIds) {
        try {
          const result = await dispatch(getShopById(shopId)).unwrap();
          if (result && result.data) {
            namesMap[shopId] = result.data.name;
          }
        } catch (error) {
          console.error(`Error fetching shop name for ID ${shopId}:`, error);
          namesMap[shopId] = 'N/A';
        }
      }
      
      setShopNames(namesMap);
      setLoadingShopNames(false);
    };

    if (services.length > 0) {
      fetchShopNames();
    }
  }, [services, dispatch]);

  // Handle search function
  const handleSearch = () => {
    const params: { name?: string; serviceTypeId?: string } = {};
    if (searchName.trim()) params.name = searchName.trim();
    if (selectedServiceType) params.serviceTypeId = selectedServiceType;
    
    dispatch(getAllServices(params));
  };

  // Handle delete modal
  const handleOpenDeleteModal = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setIsDeleteModalOpen(true);
  };

  // Handle delete service
  const handleDeleteService = () => {
    if (selectedServiceId) {
      dispatch(deleteService(selectedServiceId))
        .unwrap()
        .then(() => {
          setIsDeleteModalOpen(false);
          setSelectedServiceId(null);
        });
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(services.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, services.length);
  const currentServices = services.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Find service type name by id
  const getServiceTypeName = (typeId: string) => {
    const type = serviceTypes.find(t => t.id === typeId);
    return type ? type.name : 'N/A';
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <AdminPageHeader
        title="Quản lý dịch vụ"
        description="Quản lý tất cả các dịch vụ trong hệ thống"
      />
      
      <div className="mb-6 grid md:grid-cols-3 gap-4">
        <StatCard
          title="Tổng số dịch vụ"
          value={services.length}
          icon={<FaRegListAlt />}
          color="blue"
        />
      </div>

      <Card>
        <div className="p-4">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <h2 className="text-xl font-semibold mb-2 md:mb-0">Danh sách dịch vụ</h2>
            <div className="flex gap-2 flex-wrap">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Tên dịch vụ..."
                  className="border rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>
              <div className="flex">
                <select
                  className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedServiceType}
                  onChange={(e) => setSelectedServiceType(e.target.value)}
                >
                  <option value="">Tất cả loại dịch vụ</option>
                  {!searchingTypes && serviceTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
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
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên dịch vụ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cửa hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại dịch vụ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentServices.length > 0 ? (
                    currentServices.map((service) => (
                      <tr key={service.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {service.id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            {service.img_url && (
                              <img 
                                src={service.img_url} 
                                alt={service.name}
                                className="h-10 w-10 rounded-full mr-3 object-cover"
                              />
                            )}
                            <span title={service.name}>{truncateText(service.name)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {loadingShopNames ? (
                            <span className="inline-flex items-center">
                              <Spinner size="sm" className="mr-2" /> Đang tải...
                            </span>
                          ) : (
                            shopNames[service.shop_id] || `${service.shop_id.substring(0, 8)}...`
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getServiceTypeName(service.service_type_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatPrice(service.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(service.is_active)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <TableActions 
                            onDelete={() => handleOpenDeleteModal(service.id)}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center">
                        {searchError ? searchError.message : 'Không có dịch vụ nào'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!searching && services.length > 0 && (
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Hiển thị {startIndex + 1} - {endIndex} trong tổng số {services.length}
              </div>
              
              <div className="flex gap-2">
                <button 
                  className={`px-3 py-1 border rounded ${currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Trước
                </button>
                <button 
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  {currentPage}
                </button>
                <button 
                  className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || services.length === 0}
                >
                  Tiếp
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Xác nhận xóa dịch vụ"
      >
        <div className="p-4">
          <p>Bạn có chắc chắn muốn xóa dịch vụ này không? Hành động này không thể hoàn tác.</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleDeleteService}
              disabled={deleting}
            >
              {deleting ? <Spinner size="sm" /> : 'Xóa'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ServicesManagement; 