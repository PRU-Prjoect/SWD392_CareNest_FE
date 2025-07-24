import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getAllServices } from '@/store/slices/serviceSlice';
import { getAppointmentReport } from '@/store/slices/appointmentSlice';
import { searchServiceTypes } from '@/store/slices/serviceTypeShopSlice';

import Card from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import StatCard from './components/StatCard';
import AdminPageHeader from './components/AdminPageHeader';
import { FaUsers, FaShoppingBag, FaCalendarCheck, FaStore } from 'react-icons/fa';

// Format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  
  // Lấy dữ liệu từ các slice
  const { services } = useAppSelector(state => state.service);
  const { serviceTypes } = useAppSelector(state => state.serviceTypeShop);
  const { reportData: appointmentReport, appointments } = useAppSelector(state => state.appointment);
  
  // Số lượng cửa hàng (giả lập)
  const [shopStats, setShopStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
  });
  
  // Số lượng người dùng (giả lập)
  const [userStats, setUserStats] = useState({
    total: 0,
    new: 0,
  });
  
  // Mock doanh thu (giả lập)
  const [revenueStats, setRevenueStats] = useState({
    total: 0,
    lastMonth: 0,
    thisMonth: 0,
  });
  
  // Hoạt động gần đây (từ các cuộc hẹn)
  const recentActivities = appointments.slice(0, 5).map(appointment => ({
    id: appointment.id,
    type: 'appointment',
    status: appointment.status,
    timestamp: appointment.start_time,
    customerId: appointment.customer_id,
  }));

  useEffect(() => {
    // Fetch data
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          dispatch(getAllServices()),
          dispatch(searchServiceTypes()),
          dispatch(getAppointmentReport()),
        ]);
        
        // Giả lập dữ liệu thống kê cửa hàng và người dùng
        setShopStats({
          total: 15,
          active: 12,
          pending: 3,
        });
        
        setUserStats({
          total: 150,
          new: 24,
        });
        
        setRevenueStats({
          total: 15000000,
          lastMonth: 6500000,
          thisMonth: 8500000,
        });
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [dispatch]);

  // Tính toán sự tăng trưởng từ tháng trước
  const growthPercentage = revenueStats.lastMonth > 0
    ? ((revenueStats.thisMonth - revenueStats.lastMonth) / revenueStats.lastMonth * 100).toFixed(1)
    : '0';

  // Hiển thị loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <AdminPageHeader 
        title="Admin Dashboard" 
        description="Tổng quan hoạt động hệ thống"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Thẻ thống kê */}
        <StatCard 
          title="Tổng người dùng" 
          value={userStats.total.toString()}
          subtitle={`+${userStats.new} mới trong tháng này`}
          color="blue"
          icon={<FaUsers className="text-blue-600 text-xl" />}
        />
        
        <StatCard 
          title="Cửa hàng hoạt động" 
          value={`${shopStats.active}/${shopStats.total}`}
          subtitle={`${shopStats.pending} cửa hàng đang chờ duyệt`}
          color="green"
          icon={<FaStore className="text-green-600 text-xl" />}
        />
        
        <StatCard 
          title="Dịch vụ được đăng" 
          value={services.length.toString()}
          subtitle={`${serviceTypes.length} loại dịch vụ`}
          color="purple"
          icon={<FaShoppingBag className="text-purple-600 text-xl" />}
        />
        
        <StatCard 
          title="Lịch hẹn" 
          value={appointmentReport?.total.toString() || '0'}
          subtitle={`${appointmentReport?.finish || 0} đã hoàn thành`}
          color="orange"
          icon={<FaCalendarCheck className="text-orange-600 text-xl" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Biểu đồ doanh thu */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Doanh thu</h2>
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(revenueStats.total)}</p>
                  <p className="text-gray-600 text-sm">Tổng doanh thu</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-medium ${Number(growthPercentage) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {growthPercentage}% {Number(growthPercentage) >= 0 ? '↑' : '↓'}
                  </p>
                  <p className="text-gray-600 text-sm">So với tháng trước</p>
                </div>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Biểu đồ doanh thu sẽ được cập nhật khi có dữ liệu thực tế</p>
            </div>
          </div>
        </Card>
        
        {/* Thống kê lịch hẹn */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Thống kê lịch hẹn</h2>
            
            {appointmentReport ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Hoàn thành:</span>
                  <span className="font-medium text-green-600">{appointmentReport.finishPercent.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: `${appointmentReport.finishPercent}%` }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Đang xử lý:</span>
                  <span className="font-medium text-blue-600">{appointmentReport.inProgressPercent.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${appointmentReport.inProgressPercent}%` }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Chưa xử lý:</span>
                  <span className="font-medium text-yellow-600">{appointmentReport.noProgressPercent.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-600 rounded-full" style={{ width: `${appointmentReport.noProgressPercent}%` }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Đã hủy:</span>
                  <span className="font-medium text-red-600">{appointmentReport.cancelPercent.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full" style={{ width: `${appointmentReport.cancelPercent}%` }}></div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Không có dữ liệu báo cáo</p>
            )}
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dịch vụ phổ biến */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Dịch vụ phổ biến</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên dịch vụ</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Lượt mua</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {services.length > 0 ? (
                    services
                      .slice(0, 5)
                      .sort((a, b) => b.purchases - a.purchases)
                      .map((service) => {
                        const serviceType = serviceTypes.find(t => t.id === service.service_type_id);
                        
                        return (
                          <tr key={service.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {service.name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {serviceType?.name || 'N/A'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                              {formatCurrency(service.price || 0)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                              {service.purchases}
                            </td>
                          </tr>
                        );
                      })
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-4 text-sm text-center text-gray-500">
                        Chưa có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
        
        {/* Hoạt động gần đây */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Hoạt động gần đây</h2>
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <FaCalendarCheck className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Cuộc hẹn mới</span> {" "}
                        <span className="text-gray-500">từ khách hàng {activity.customerId.substring(0, 8)}...</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Không có hoạt động gần đây</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage; 