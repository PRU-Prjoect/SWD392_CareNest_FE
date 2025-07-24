import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAccounts, deleteAccount, activateAccount } from '@/store/slices/AccountSlice';
import AdminPageHeader from './components/AdminPageHeader';
import type { RootState } from '@/store/store';
import type { AppDispatch } from '@/store/store';

const AccountsManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accounts, searching, deleting, activating, searchError } = useSelector((state: RootState) => state.account);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [accountDetails, setAccountDetails] = useState<typeof accounts[0] | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(getAllAccounts());
  }, [dispatch]);

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = searchTerm === '' || 
      account.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
      account.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === '' || account.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  };

  const openDeleteModal = (accountId: string) => {
    setAccountToDelete(accountId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setAccountToDelete(null);
  };

  const handleDelete = () => {
    if (accountToDelete) {
      dispatch(deleteAccount(accountToDelete));
      closeDeleteModal();
    }
  };

  const handleActivateToggle = (accountId: string) => {
    dispatch(activateAccount(accountId));
  };

  const handleViewDetails = (account: typeof accounts[0]) => {
    setAccountDetails(account);
    setIsDetailsModalOpen(true);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Quản trị viên';
      case 'CUSTOMER':
        return 'Khách hàng';
      case 'SHOP':
        return 'Cửa hàng';
      case 'STAFF':
        return 'Nhân viên';
      default:
        return role;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <AdminPageHeader 
        title="Quản lý tài khoản" 
        description="Quản lý tất cả tài khoản người dùng trong hệ thống"
      />
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên hoặc email..." 
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-80" 
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
        
        <select 
          value={roleFilter}
          onChange={handleRoleFilterChange}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tất cả vai trò</option>
          <option value="ADMIN">Quản trị viên</option>
          <option value="CUSTOMER">Khách hàng</option>
          <option value="SHOP">Cửa hàng</option>
          <option value="STAFF">Nhân viên</option>
        </select>
      </div>
      
      {searchError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {searchError.message}
        </div>
      )}
      
      {/* Bảng hiển thị tài khoản */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {searching ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                </td>
              </tr>
            ) : paginatedAccounts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Không tìm thấy tài khoản nào
                </td>
              </tr>
            ) : (
              paginatedAccounts.map((account) => (
                <tr key={account.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {account.img_url ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={account.img_url}
                            alt={account.username}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">{account.username.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{account.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${account.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                        account.role === 'SHOP' ? 'bg-blue-100 text-blue-800' : 
                        account.role === 'STAFF' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {getRoleLabel(account.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${account.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {account.is_active ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(account.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                    <button 
                      onClick={() => handleViewDetails(account)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Chi tiết
                    </button>
                    <button 
                      onClick={() => handleActivateToggle(account.id)}
                      disabled={activating}
                      className={`${account.is_active ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'} ${activating ? 'opacity-50' : ''}`}
                    >
                      {account.is_active ? 'Khóa' : 'Kích hoạt'}
                    </button>
                    <button 
                      onClick={() => openDeleteModal(account.id)}
                      disabled={deleting}
                      className={`text-red-600 hover:text-red-900 ${deleting ? 'opacity-50' : ''}`}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Phân trang */}
      {!searching && filteredAccounts.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredAccounts.length)} trong tổng số {filteredAccounts.length}
          </div>
          
          <div className="flex gap-2">
            <button 
              className={`px-3 py-1 border rounded ${currentPage > 1 ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-300'}`} 
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Trước
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={i}
                  className={`px-3 py-1 ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'border text-gray-500 hover:bg-gray-100'} rounded`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              className={`px-3 py-1 border rounded ${currentPage < totalPages ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-300'}`}
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Tiếp
            </button>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Xóa tài khoản
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {deleting ? 'Đang xóa...' : 'Xóa'}
                </button>
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết tài khoản */}
      {isDetailsModalOpen && accountDetails && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Chi tiết tài khoản
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Đóng</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="flex justify-center">
                    {accountDetails.img_url ? (
                      <img
                        src={accountDetails.img_url}
                        alt={accountDetails.username}
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-2xl">{accountDetails.username.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">ID</p>
                      <p className="text-sm text-gray-900">{accountDetails.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tên người dùng</p>
                      <p className="text-sm text-gray-900">{accountDetails.username}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">{accountDetails.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Vai trò</p>
                      <p className="text-sm text-gray-900">{getRoleLabel(accountDetails.role)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Trạng thái</p>
                      <p className="text-sm text-gray-900">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${accountDetails.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {accountDetails.is_active ? 'Hoạt động' : 'Bị khóa'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ngày tạo</p>
                      <p className="text-sm text-gray-900">{new Date(accountDetails.created_at).toLocaleDateString('vi-VN')}</p>
                    </div>
                    {accountDetails.banK_ACCOUNT_NO && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Số tài khoản ngân hàng</p>
                          <p className="text-sm text-gray-900">{accountDetails.banK_ACCOUNT_NO}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Tên tài khoản ngân hàng</p>
                          <p className="text-sm text-gray-900">{accountDetails.banK_ACCOUNT_NAME}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleActivateToggle(accountDetails.id);
                    setIsDetailsModalOpen(false);
                  }}
                  disabled={activating}
                  className={`mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${accountDetails.is_active ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm ${activating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {accountDetails.is_active ? 'Khóa tài khoản' : 'Kích hoạt tài khoản'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsManagement; 