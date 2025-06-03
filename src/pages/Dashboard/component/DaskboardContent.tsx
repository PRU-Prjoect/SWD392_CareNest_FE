// import React from 'react';
import tasksData from '../../../data/tasks.json'; // Import dữ liệu từ file JSON

const DashboardContent = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đang làm':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hoàn thành':
        return 'bg-green-100 text-green-800';
      case 'Chưa làm':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <h1 className="text-4xl font-medium text-blue-600 dark:text-white mb-6">
        Danh sách công việc
      </h1>

      <div className="space-y-4">
        {tasksData.map((task) => (
          <div
            key={task.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                {task.title}
              </h3>
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  getStatusColor(task.status ?? '')
                }`}
              >
                {task.status ?? 'Không rõ trạng thái'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardContent;
