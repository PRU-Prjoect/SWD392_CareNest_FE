import { useState } from "react";

type Task = {
  title: string;
  created: string;
  deadline: string;
  progress: string;
  status: string;
};

export default function TaskReport() {
  // Khởi tạo tasks rỗng, quản lý bằng state
  const [tasks, setTasks] = useState<Task[]>([]);

  const [showForm, setShowForm] = useState(false);

  // Form nhập task mới
  const [taskForm, setTaskForm] = useState<Task>({
    title: "",
    created: "",
    deadline: "",
    progress: "",
    status: "",
  });

  // trạng thái
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter((t) => t.status === "Đang thực hiện").length;
  const doneTasks = tasks.filter((t) => t.status === "Đã hoàn thành").length;

  // Xử lý thay đổi input form
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setTaskForm((prev) => ({ ...prev, [name]: value }));
  }

  // Submit form tạo task mới
  function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault();

    // Kiểm tra yêu cầu tối thiểu 
    if (!taskForm.title || !taskForm.created || !taskForm.deadline) {
      alert("Vui lòng nhập đầy đủ Tiêu đề, Ngày tạo và Deadline");
      return;
    }

    // Thêm task mới vào danh sách
    setTasks((prev) => [...prev, taskForm]);

    // Reset form
    setTaskForm({
      title: "",
      created: "",
      deadline: "",
      progress: "",
      status: "",
    });

    setShowForm(false);
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-gray-200 relative">
      {/* Tiêu đề và nút tạo báo cáo */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Báo cáo công việc</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
        >
          Tạo báo cáo
        </button>
      </div>

      {/* Bảng danh sách task */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-blue-100 text-blue-700">
            <tr>
              <th className="text-left px-4 py-2">Tiêu đề</th>
              <th className="text-left px-4 py-2">Ngày tạo</th>
              <th className="text-left px-4 py-2">Deadline</th>
              <th className="text-left px-4 py-2">Tiến độ</th>
              <th className="text-left px-4 py-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400 italic">
                  Chưa có task nào
                </td>
              </tr>
            ) : (
              tasks.map((task, idx) => (
                <tr
                  key={idx}
                  className="even:bg-gray-50 hover:bg-blue-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{task.title}</td>
                  <td className="px-4 py-3">{task.created}</td>
                  <td className="px-4 py-3">{task.deadline}</td>
                  <td className="px-4 py-3">{task.progress}</td>
                  <td className="px-4 py-3">{task.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Tổng kết */}
      <div className="mt-8 bg-blue-50 p-4 rounded-lg shadow-inner border border-blue-200">
        <h3 className="text-blue-600 font-semibold text-lg mb-2">Tổng kết</h3>
        <p className="text-sm text-gray-800">Tổng số task: {totalTasks}</p>
        <p className="text-sm text-gray-800">Đang tiến hành: {inProgressTasks}</p>
        <p className="text-sm text-gray-800">Đã hoàn thành: {doneTasks}</p>
      </div>

      {/* Form nhập báo cáo (popup modal) */}
      {showForm && (
        <div className="fixed inset-0  bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md relative">
            {/* Nút đóng */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold"
              aria-label="Đóng biểu mẫu"
            >
              ×
            </button>

            <form onSubmit={handleSubmitForm}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Thêm báo cáo
              </h3>

              <label className="block mb-2 font-medium text-gray-700">Tiêu đề:</label>
              <input
                type="text"
                name="title"
                value={taskForm.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <label className="block mb-2 font-medium text-gray-700">Ngày tạo:</label>
              <input
                type="date"
                name="created"
                value={taskForm.created}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <label className="block mb-2 font-medium text-gray-700">Deadline:</label>
              <input
                type="date"
                name="deadline"
                value={taskForm.deadline}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <label className="block mb-2 font-medium text-gray-700">Tiến độ (%):</label>
              <input
                type="number"
                name="progress"
                value={taskForm.progress}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: 80"
              />

              <label className="block mb-2 font-medium text-gray-700">Trạng thái:</label>
              <select
                name="status"
                value={taskForm.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Chọn trạng thái --</option>
                <option value="Đang thực hiện">Đang thực hiện</option>
                <option value="Đã hoàn thành">Đã hoàn thành</option>
                <option value="Chưa bắt đầu">Chưa bắt đầu</option>
              </select>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Thêm task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}