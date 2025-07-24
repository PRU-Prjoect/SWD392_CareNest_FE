import React from 'react';
import StatCard from './components/StatCard';

const DashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Thẻ thống kê */}
        <StatCard 
          title="Tổng người dùng" 
          value="0" 
          color="blue"
          icon={<span className="text-blue-600 text-xl">👥</span>}
        />
        
        <StatCard 
          title="Cửa hàng hoạt động" 
          value="0" 
          color="green"
          icon={<span className="text-green-600 text-xl">🏪</span>}
        />
        
        <StatCard 
          title="Dịch vụ được đăng" 
          value="0" 
          color="purple"
          icon={<span className="text-purple-600 text-xl">🧩</span>}
        />
        
        <StatCard 
          title="Đơn đặt hàng" 
          value="0" 
          color="orange"
          icon={<span className="text-orange-600 text-xl">📦</span>}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Các biểu đồ hoặc thông tin chi tiết hơn */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Hoạt động gần đây</h2>
          <div className="space-y-4">
            <p className="text-gray-500">Chưa có dữ liệu</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Thống kê hệ thống</h2>
          <div className="space-y-4">
            <p className="text-gray-500">Chưa có dữ liệu</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 