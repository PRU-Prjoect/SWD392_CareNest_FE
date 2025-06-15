import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  // Dữ liệu mẫu cho biểu đồ
  const revenueData = [
    { name: 'T1', value: 400 },
    { name: 'T2', value: 300 },
    { name: 'T3', value: 500 },
    { name: 'T4', value: 280 },
    { name: 'T5', value: 390 },
    { name: 'T6', value: 600 },
    { name: 'T7', value: 320 },
  ];

  const serviceData = [
    { name: 'T1', value: 240 },
    { name: 'T2', value: 139 },
    { name: 'T3', value: 380 },
    { name: 'T4', value: 200 },
    { name: 'T5', value: 278 },
    { name: 'T6', value: 450 },
    { name: 'T7', value: 189 },
  ];

  const productData = [
    { name: 'T1', value: 340 },
    { name: 'T2', value: 200 },
    { name: 'T3', value: 280 },
    { name: 'T4', value: 180 },
    { name: 'T5', value: 290 },
    { name: 'T6', value: 350 },
    { name: 'T7', value: 220 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🐕</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Chào mừng quay trở lại, ✨
            </h1>
            <p className="text-lg text-gray-600">
              Cửa hàng chăm sóc sức khỏe thú cưng Pettiny
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Thời gian</option>
          <option>7 ngày qua</option>
          <option>30 ngày qua</option>
          <option>3 tháng qua</option>
        </select>
        
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Chi nhánh</option>
          <option>Chi nhánh 1: Vinhome Grand Park, Quận 9, Thành Phố Hồ Chí Minh</option>
          <option>Chi nhánh 2</option>
        </select>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ doanh thu */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Biểu đồ doanh thu</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ số lượng đơn dịch vụ */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Biểu đồ số lượng đơn dịch vụ</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serviceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ số lượng đơn sản phẩm */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Biểu đồ số lượng đơn sản phẩm</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#eab308" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
