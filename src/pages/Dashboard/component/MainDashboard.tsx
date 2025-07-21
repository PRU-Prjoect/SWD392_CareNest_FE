const MainDashboard = () => {
  return (
    <div className=" bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <h1 className="text-4xl font-bold text-blue-600 dark:text-white mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Hôm nay
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            5 task
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Đang làm
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            3 Task
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Hoàn thành
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
                2 Task
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
