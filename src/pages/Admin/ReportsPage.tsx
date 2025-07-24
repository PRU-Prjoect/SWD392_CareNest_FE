import React from 'react';

const ReportsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Báo cáo hệ thống</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bộ lọc báo cáo */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">Bộ lọc báo cáo</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ ngày
              </label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đến ngày
              </label>
              <input 
                type="date" 
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại báo cáo
              </label>
              <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">Tất cả</option>
                <option value="revenue">Doanh thu</option>
                <option value="users">Người dùng</option>
                <option value="orders">Đơn hàng</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Áp dụng
              </button>
            </div>
          </div>
        </div>
        
        {/* Biểu đồ doanh thu */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">Doanh thu theo thời gian</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Biểu đồ doanh thu sẽ hiển thị ở đây</p>
          </div>
        </div>
        
        {/* Thống kê tổng hợp */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">Thống kê tổng hợp</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Tổng doanh thu:</span>
              <span className="font-medium">0 VNĐ</span>
            </div>
            
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Số lượng đơn hàng:</span>
              <span className="font-medium">0</span>
            </div>
            
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Người dùng mới:</span>
              <span className="font-medium">0</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tỉ lệ hoàn thành:</span>
              <span className="font-medium">0%</span>
            </div>
          </div>
        </div>
        
        {/* Thống kê dịch vụ phổ biến */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">Dịch vụ phổ biến</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                    Số lượt đặt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doanh thu
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-500" colSpan={5}>
                    Chưa có dữ liệu
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage; 