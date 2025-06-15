import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const AdminDashboard = () => {
  // Dữ liệu mẫu cho biểu đồ cột
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

  // Dữ liệu cho biểu đồ tròn sản phẩm
  const productPieData = [
    { name: 'Thành công', value: 65, color: '#4ECDC4' },
    { name: 'Đang xử lý', value: 20, color: '#45B7D1' },
    { name: 'Đơn hủy', value: 10, color: '#2E3A59' },
    { name: 'Chưa xử lý', value: 5, color: '#96CEB4' },
  ];

  // Dữ liệu cho biểu đồ tròn dịch vụ
  const servicePieData = [
    { name: 'Thành công', value: 70, color: '#4ECDC4' },
    { name: 'Đang xử lý', value: 18, color: '#45B7D1' },
    { name: 'Đơn hủy', value: 8, color: '#2E3A59' },
    { name: 'Chưa xử lý', value: 4, color: '#96CEB4' },
  ];

  // Màu sắc cho biểu đồ tròn
  const COLORS = ['#4ECDC4', '#45B7D1', '#2E3A59', '#96CEB4'];

  // Component Legend tùy chỉnh
  const CustomLegend = ({ data }: { data: any[] }) => (
    <div className="flex flex-col space-y-2 ml-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm text-gray-700 font-medium">
            {item.name}
          </span>
          <span className="text-sm text-gray-500">
            {item.value}%
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold text-lg">P</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              Chào mừng quay trở lại, ✨
            </h1>
            <p className="text-lg text-gray-600">
              Cửa hàng chăm sóc sức khỏe thú cưng Pettiny
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
        </div>
        
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option>Thời gian</option>
          <option>7 ngày qua</option>
          <option>30 ngày qua</option>
          <option>3 tháng qua</option>
        </select>
        
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[300px]">
          <option>Chi nhánh</option>
          <option>Chi nhánh 1: Vinhome Grand Park, Quận 9, Thành Phố Hồ Chí Minh</option>
          <option>Chi nhánh 2</option>
        </select>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ doanh thu */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Biểu đồ doanh thu</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ số lượng đơn dịch vụ */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Biểu đồ số lượng đơn dịch vụ</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serviceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ số lượng đơn sản phẩm */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Biểu đồ số lượng đơn sản phẩm</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="value" fill="#eab308" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ tỷ lệ thành công của đơn hàng và dịch vụ */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Biểu đồ tỷ lệ thành công của đơn hàng và dịch vụ
          </h3>
          

            {/* Biểu đồ tròn Dịch vụ */}
            <div className="text-center">
              <h4 className="text-md font-medium mb-2 text-gray-700">Dịch vụ</h4>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie
                      data={servicePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {servicePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          {/* Legend chung */}
          <div className="mt-4 flex justify-center">
            <CustomLegend data={servicePieData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
