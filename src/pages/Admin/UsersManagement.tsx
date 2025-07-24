import React, { useState } from 'react';
import AdminPageHeader from './components/AdminPageHeader';
import TableActions from './components/TableActions';

const UsersManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Xử lý thêm người dùng mới
  const handleAddUser = () => {
    console.log('Thêm người dùng mới');
    // TODO: Hiển thị modal thêm người dùng
  };

  // Xử lý các hành động trên bảng
  const handleViewUser = (userId: string) => {
    console.log('Xem chi tiết người dùng:', userId);
  };

  const handleEditUser = (userId: string) => {
    console.log('Chỉnh sửa người dùng:', userId);
  };

  const handleDeleteUser = (userId: string) => {
    console.log('Xóa người dùng:', userId);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <AdminPageHeader 
        title="Quản lý người dùng"
        description="Xem và quản lý tất cả người dùng trong hệ thống"
        actionButton={{
          label: "Thêm người dùng",
          onClick: handleAddUser,
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          )
        }}
      />
      
      {/* Thanh tìm kiếm */}
      <div className="mb-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên, email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full md:w-1/3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>
      
      {/* Bảng hiển thị người dùng */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Họ tên
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
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Dữ liệu mẫu - sẽ được thay thế bằng dữ liệu từ API */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <p className="text-gray-500">Chưa có dữ liệu</p>
              </td>
              <td className="px-6 py-4 whitespace-nowrap"></td>
              <td className="px-6 py-4 whitespace-nowrap"></td>
              <td className="px-6 py-4 whitespace-nowrap"></td>
              <td className="px-6 py-4 whitespace-nowrap"></td>
              <td className="px-6 py-4 whitespace-nowrap">
                <TableActions 
                  onView={() => handleViewUser('user-id')}
                  onEdit={() => handleEditUser('user-id')}
                  onDelete={() => handleDeleteUser('user-id')}
                  disableView={true}
                  disableEdit={true}
                  disableDelete={true}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Phân trang */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Hiển thị 0 - 0 trong tổng số 0
        </div>
        
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded text-gray-500 hover:bg-gray-100" disabled>
            Trước
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded" disabled>
            1
          </button>
          <button className="px-3 py-1 border rounded text-gray-500 hover:bg-gray-100" disabled>
            Tiếp
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement; 