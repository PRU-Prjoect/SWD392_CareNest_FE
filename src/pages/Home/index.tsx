import React from "react";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Test Tailwind CSS */}
        <div className="p-4 mb-4 bg-red-500 text-white rounded-lg">
          <p>🔥 Nếu bạn thấy nền đỏ và chữ trắng, Tailwind đã hoạt động!</p>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Chào mừng đến với Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Quản lý công việc hiệu quả với giao diện thân thiện
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quản lý Task
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tạo, chỉnh sửa và theo dõi tiến độ công việc
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Báo cáo
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Xem thống kê và báo cáo chi tiết
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Cài đặt
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tùy chỉnh giao diện và cấu hình hệ thống
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
