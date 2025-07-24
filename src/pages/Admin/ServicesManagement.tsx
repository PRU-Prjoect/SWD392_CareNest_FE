import React from 'react';

const ServicesManagement: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý dịch vụ</h1>
        
        <div className="flex gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Tìm kiếm dịch vụ..." 
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
          
          <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Tất cả loại dịch vụ</option>
            <option value="grooming">Grooming</option>
            <option value="hotel">Pet Hotel</option>
            <option value="veterinary">Thú y</option>
            <option value="training">Huấn luyện</option>
          </select>
        </div>
      </div>
      
      {/* Bảng hiển thị dịch vụ */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <p className="text-gray-500">Chưa có dữ liệu</p>
              </td>
              <td className="px-6 py-4 whitespace-nowrap"></td>
              <td className="px-6 py-4 whitespace-nowrap"></td>
              <td className="px-6 py-4 whitespace-nowrap"></td>
              <td className="px-6 py-4 whitespace-nowrap"></td>
              <td className="px-6 py-4 whitespace-nowrap"></td>
              <td className="px-6 py-4 whitespace-nowrap"></td>
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

export default ServicesManagement; 