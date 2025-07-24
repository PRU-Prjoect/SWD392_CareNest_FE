import React, { useState } from 'react';

const SystemSettings: React.FC = () => {
  // Trạng thái cho các cài đặt
  const [maintenance, setMaintenance] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Xử lý cập nhật cài đặt
  const handleSaveSettings = () => {
    // TODO: Gửi cài đặt đến API
    console.log("Cài đặt đã được lưu:", {
      maintenance,
      registrationOpen,
      emailNotifications
    });
    // Hiển thị thông báo thành công
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Cài đặt hệ thống</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-medium mb-4">Cài đặt chung</h2>

        <div className="space-y-6">
          {/* Chế độ bảo trì */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <h3 className="font-medium">Chế độ bảo trì</h3>
              <p className="text-sm text-gray-500">
                Khi bật, website sẽ hiển thị thông báo bảo trì và ngăn người dùng truy cập
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={maintenance}
                onChange={() => setMaintenance(!maintenance)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Đăng ký người dùng mới */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <h3 className="font-medium">Cho phép đăng ký</h3>
              <p className="text-sm text-gray-500">
                Cho phép người dùng mới đăng ký tài khoản trên hệ thống
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={registrationOpen}
                onChange={() => setRegistrationOpen(!registrationOpen)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Thông báo email */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <h3 className="font-medium">Thông báo email</h3>
              <p className="text-sm text-gray-500">
                Gửi email thông báo cho người dùng và quản trị viên
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-medium mb-4">Cài đặt phí hệ thống</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phí dịch vụ (%)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="10"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phí hủy đơn (%)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="5"
              min="0"
              max="100"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Lưu cài đặt
        </button>
      </div>
    </div>
  );
};

export default SystemSettings; 