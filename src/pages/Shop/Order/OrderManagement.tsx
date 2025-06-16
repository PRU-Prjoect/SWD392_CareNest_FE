import React, { useState } from 'react';

interface ServiceOrder {
  id: number;
  customerName: string;
  services: {
    id: number;
    name: string;
    note: string;
    price: number;
  }[];
  startTime: string;
  endTime: string;
  status: 'pending' | 'processing' | 'in-progress' | 'completed' | 'cancelled';
  totalAmount: number;
  branch: string;
  review?: {
    rating: number;
    comment: string;
    reviewDate: string;
  };
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ServiceOrder | null;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order || !order.review) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Đánh giá của khách hàng
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-5">
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="text-sm font-medium text-gray-600 block mb-1">Khách hàng:</label>
            <p className="text-gray-900 font-medium">{order.customerName}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="text-sm font-medium text-gray-600 block mb-1">Đơn hàng:</label>
            <p className="text-gray-900 font-medium">#{order.id}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="text-sm font-medium text-gray-600 block mb-2">Đánh giá:</label>
            <div className="flex items-center space-x-1">
              {renderStars(order.review.rating)}
              <span className="ml-2 text-sm text-gray-600 font-medium">
                ({order.review.rating}/5 sao)
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="text-sm font-medium text-gray-600 block mb-2">Nhận xét:</label>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-gray-800 leading-relaxed">
                {order.review.comment}
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="text-sm font-medium text-gray-600 block mb-1">Ngày đánh giá:</label>
            <p className="text-gray-900 font-medium">{order.review.reviewDate}</p>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'processing' | 'completed' | 'cancelled' | 'all'>('pending');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reviewModal, setReviewModal] = useState<{ isOpen: boolean; order: ServiceOrder | null }>({
    isOpen: false,
    order: null
  });

  // Dữ liệu mẫu
  const orders: ServiceOrder[] = [
    {
      id: 1,
      customerName: 'Nguyễn Văn A',
      services: [
        { id: 1, name: 'Dịch vụ tắm cho cún', note: 'Cún bị dị ứng nước', price: 200000 },
        { id: 2, name: 'Cắt tỉa lông', note: 'Cún bị dị ứng nước', price: 200000 },
        { id: 3, name: 'Cắt tỉa lông', note: 'Cún bị dị ứng nước', price: 200000 }
      ],
      startTime: '2025-01-01 9:00',
      endTime: '2025-01-01 12:00',
      status: 'pending',
      totalAmount: 600000,
      branch: 'Chi nhánh Vinhome: VinhomeGrandPark, quận 9, Thủ Đức'
    },
    {
      id: 2,
      customerName: 'Nguyễn Văn B',
      services: [
        { id: 1, name: 'Dịch vụ tắm cho cún', note: 'Cún bị dị ứng nước', price: 200000 },
        { id: 2, name: 'Cắt tỉa lông', note: 'Cún bị dị ứng nước', price: 200000 }
      ],
      startTime: '2025-01-01 9:00',
      endTime: '2025-01-01 12:00',
      status: 'processing',
      totalAmount: 400000,
      branch: 'Chi nhánh Vinhome: VinhomeGrandPark, quận 9, Thủ Đức'
    },
    {
      id: 3,
      customerName: 'Nguyễn Văn C',
      services: [
        { id: 1, name: 'Dịch vụ tắm cho cún', note: 'Cún bị dị ứng nước', price: 200000 }
      ],
      startTime: '2025-01-01 9:00',
      endTime: '2025-01-01 12:00',
      status: 'in-progress',
      totalAmount: 200000,
      branch: 'Chi nhánh Vinhome: VinhomeGrandPark, quận 9, Thủ Đức'
    },
    // Đơn hàng hoàn thành
    {
      id: 4,
      customerName: 'Trần Thị D',
      services: [
        { id: 1, name: 'Dịch vụ tắm cho cún', note: 'Dịch vụ tốt', price: 200000 },
        { id: 2, name: 'Cắt tỉa lông', note: 'Rất hài lòng', price: 150000 }
      ],
      startTime: '2024-12-28 10:00',
      endTime: '2024-12-28 13:00',
      status: 'completed',
      totalAmount: 350000,
      branch: 'Chi nhánh Vinhome: VinhomeGrandPark, quận 9, Thủ Đức',
      review: {
        rating: 5,
        comment: 'Dịch vụ rất tốt, nhân viên thân thiện và chuyên nghiệp. Cún cưng của tôi rất thích và sạch sẽ sau khi tắm.',
        reviewDate: '2024-12-28 14:30'
      }
    },
    {
      id: 5,
      customerName: 'Lê Văn E',
      services: [
        { id: 1, name: 'Dịch vụ spa cho mèo', note: 'Mèo hiền lành', price: 300000 }
      ],
      startTime: '2024-12-27 14:00',
      endTime: '2024-12-27 16:00',
      status: 'completed',
      totalAmount: 300000,
      branch: 'Chi nhánh Vinhome: VinhomeGrandPark, quận 9, Thủ Đức',
      review: {
        rating: 4,
        comment: 'Dịch vụ khá ổn, tuy nhiên thời gian chờ hơi lâu. Mèo của tôi được chăm sóc tốt.',
        reviewDate: '2024-12-27 17:15'
      }
    },
    // Đơn hàng bị hủy
    {
      id: 6,
      customerName: 'Phạm Thị F',
      services: [
        { id: 1, name: 'Dịch vụ tắm cho cún', note: 'Khách hủy do bận việc', price: 200000 }
      ],
      startTime: '2024-12-26 9:00',
      endTime: '2024-12-26 11:00',
      status: 'cancelled',
      totalAmount: 200000,
      branch: 'Chi nhánh Vinhome: VinhomeGrandPark, quận 9, Thủ Đức'
    },
    {
      id: 7,
      customerName: 'Hoàng Văn G',
      services: [
        { id: 1, name: 'Cắt tỉa lông', note: 'Cún không hợp tác', price: 180000 },
        { id: 2, name: 'Vệ sinh tai', note: 'Cún sợ hãi', price: 100000 }
      ],
      startTime: '2024-12-25 15:00',
      endTime: '2024-12-25 17:00',
      status: 'cancelled',
      totalAmount: 280000,
      branch: 'Chi nhánh Vinhome: VinhomeGrandPark, quận 9, Thủ Đức'
    }
  ];

  // Custom Date Picker Component
  const CustomDatePicker = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const months = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const days = [];
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    const handleDateSelect = (day: number) => {
      const formattedDate = `${String(day).padStart(2, '0')}/${String(currentMonth + 1).padStart(2, '0')}/${currentYear}`;
      setSelectedDate(formattedDate);
      setShowDatePicker(false);
    };

    const nextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    };

    const prevMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    };

    return (
      <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 w-80">
        {/* Time Period Header */}
        <div className="mb-4">
          <div className="bg-teal-500 text-white rounded-lg p-3 text-center">
            <div className="text-lg font-semibold">Thời gian</div>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4 bg-gray-100 rounded-lg p-2">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-200 rounded">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="text-lg font-semibold">{months[currentMonth]} {currentYear}</div>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-200 rounded">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div key={index} className="aspect-square">
              {day && (
                <button
                  onClick={() => handleDateSelect(day)}
                  className="w-full h-full flex items-center justify-center text-sm hover:bg-teal-100 hover:text-teal-700 rounded transition-colors"
                >
                  {day}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chưa xử lý';
      case 'processing':
        return 'Chưa thực hiện';
      case 'in-progress':
        return 'Đang thực hiện';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đơn Hủy';
      default:
        return status;
    }
  };

  const getTabColor = (tab: string) => {
    switch (tab) {
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'processing':
        return 'bg-blue-500 text-white';
      case 'completed':
        return 'bg-green-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      case 'all':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  // Lọc đơn hàng theo tab
  const filteredOrders = () => {
    if (activeTab === 'all') return orders;
    if (activeTab === 'processing') {
      return orders.filter(order => order.status === 'processing' || order.status === 'in-progress');
    }
    return orders.filter(order => order.status === activeTab);
  };

  const handleStatusChange = (orderId: number, newStatus: 'processing' | 'in-progress' | 'completed' | 'cancelled') => {
    console.log(`Changing order ${orderId} status to ${newStatus}`);
  };

  const openReviewModal = (order: ServiceOrder) => {
    setReviewModal({ isOpen: true, order });
  };

  const closeReviewModal = () => {
    setReviewModal({ isOpen: false, order: null });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
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

      {/* Status Tabs */}
      <div className="flex space-x-2 mb-6">
        {[
          { key: 'pending', label: 'Chưa xử lý' },
          { key: 'processing', label: 'Đang xử lý' },
          { key: 'completed', label: 'Hoàn thành' },
          { key: 'cancelled', label: 'Đơn Hủy' },
          { key: 'all', label: 'Tất Cả' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.key
                ? getTabColor(tab.key)
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
        </div>
        
        {/* Custom Date Picker */}
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 min-w-[160px] flex items-center justify-between"
          >
            <span>{selectedDate || 'dd/mm/yyyy'}</span>
            <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {showDatePicker && <CustomDatePicker />}
        </div>
        
        <select 
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[300px]"
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
        >
          <option value="">Chi nhánh</option>
          <option value="vinhome">Chi nhánh 1: Vinhome Grand Park, Quận 9, Thành Phố Hồ Chí Minh</option>
          <option value="branch2">Chi nhánh 2</option>
        </select>

        {/* Clear filter button */}
        {selectedDate && (
          <button
            onClick={() => setSelectedDate('')}
            className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
            title="Xóa bộ lọc ngày"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dịch vụ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giờ bắt đầu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giờ kết thúc</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ghi chú</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders().map((order, orderIndex) => (
                <React.Fragment key={order.id}>
                  {/* Branch Header */}
                  <tr className="bg-gray-100">
                    <td colSpan={8} className="px-6 py-3 text-sm font-medium text-gray-700">
                      {order.branch}
                    </td>
                  </tr>
                  
                  {/* Customer Row */}
                  <tr className="border-b border-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {orderIndex + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {/* Để trống cho dịch vụ sẽ hiển thị ở dưới */}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.startTime}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.endTime}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {/* Để trống cho ghi chú sẽ hiển thị ở dưới */}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {/* Để trống cho đơn giá sẽ hiển thị ở dưới */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(order.id, 'processing')}
                              className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600"
                            >
                              Xử lý
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, 'cancelled')}
                              className="px-3 py-1 bg-red-500 text-white text-xs rounded-full hover:bg-red-600"
                            >
                              Hủy
                            </button>
                          </>
                        )}
                        {(order.status === 'processing' || order.status === 'in-progress') && (
                          <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        )}
                        {order.status === 'completed' && (
                          <div className="flex space-x-2">
                            <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                            <button
                              onClick={() => openReviewModal(order)}
                              className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600"
                            >
                              Chi tiết
                            </button>
                          </div>
                        )}
                        {order.status === 'cancelled' && (
                          <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Services Rows */}
                  {order.services.map((service, serviceIndex) => (
                    <tr key={service.id} className="bg-white">
                      <td className="px-6 py-3"></td>
                      <td className="px-6 py-3 text-sm text-gray-900">{serviceIndex + 1}</td>
                      <td className="px-6 py-3 text-sm text-gray-900">{service.name}</td>
                      <td className="px-6 py-3"></td>
                      <td className="px-6 py-3"></td>
                      <td className="px-6 py-3 text-sm text-gray-900">{service.note}</td>
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {service.price.toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-3"></td>
                    </tr>
                  ))}

                  {/* Total Row */}
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <td className="px-6 py-3"></td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      Tổng : {order.services.length} dịch vụ
                    </td>
                    <td className="px-6 py-3"></td>
                    <td className="px-6 py-3"></td>
                    <td className="px-6 py-3"></td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">Thành tiền:</td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      {order.totalAmount.toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-3"></td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={closeReviewModal}
        order={reviewModal.order}
      />

      {/* Click outside to close date picker */}
      {showDatePicker && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
};

export default OrderManagement;
