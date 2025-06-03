import { useState } from "react";

export default function TaskManager() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("create");
  const [tasks, setTasks] = useState<
    {
      id: number;
      title: string;
      description: string;
      datetime: string;
      type: string;
    }[]
  >([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    datetime: "",
    type: "Cá nhân",
  });

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!form.title.trim()) {
      alert("❌ Vui lòng nhập tiêu đề công việc!");
      return;
    }
    if (!form.datetime) {
      alert("❌ Vui lòng chọn thời gian cho công việc!");
      return;
    }

    // Thêm task mới
    const newTask = {
      id: tasks.length + 1,
      title: form.title,
      description: form.description,
      datetime: form.datetime,
      type: form.type,
    };

    setTasks((prev) => [...prev, newTask]);
    alert("✅ Tạo công việc thành công!");
    setForm({ title: "", description: "", datetime: "", type: "Cá nhân" });
    setActiveTab("list");
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10 border border-gray-200">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-8 text-center">
        Task Manager
      </h1>

      {/* Tabs */}
      <div className="flex justify-center mb-8 space-x-6 border-b border-gray-300">
        <button
          onClick={() => setActiveTab("list")}
          className={`relative pb-3 font-semibold text-lg ${
            activeTab === "list"
              ? "text-blue-600 border-b-4 border-blue-600"
              : "text-gray-500 hover:text-blue-500"
          } transition-colors`}
        >
          Task List
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={`relative pb-3 font-semibold text-lg ${
            activeTab === "create"
              ? "text-blue-600 border-b-4 border-blue-600"
              : "text-gray-500 hover:text-blue-500"
          } transition-colors`}
        >
          Create Task
        </button>
      </div>

      {/* Content */}
      {activeTab === "list" && (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Danh sách công việc
          </h2>
          {tasks.length === 0 ? (
            <p className="text-gray-400 italic text-center py-20">
              Chưa có công việc nào.
            </p>
          ) : (
            <ul className="space-y-6">
              {tasks.map((task, idx) => (
                <li
                  key={task.id}
                  className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-gray-50"
                >
                  <h3 className="text-blue-700 font-bold text-xl mb-1">
                    {idx + 1}. {task.title}
                  </h3>
                  <p className="text-gray-700 mb-2 whitespace-pre-line">
                    {task.description || (
                      <span className="italic text-gray-400">Không có mô tả</span>
                    )}
                  </p>
                  <div className="flex items-center text-gray-600 text-sm space-x-6">
                    <div>
                      <span className="font-semibold">Thời gian:</span>{" "}
                      {new Date(task.datetime).toLocaleString("vi-VN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                    <div>
                      <span className="font-semibold">Loại công việc:</span> {task.type}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === "create" && (
        <form onSubmit={handleCreateTask} className="max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Tạo công việc mới</h2>

          <label htmlFor="title" className="block mb-2 font-medium text-gray-700">
            Tiêu đề:
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleInputChange}
            placeholder="Nhập tiêu đề công việc"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 transition"
          />

          <label htmlFor="description" className="block mb-2 font-medium text-gray-700">
            Mô tả:
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleInputChange}
            rows={5}
            placeholder="Nhập mô tả chi tiết"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 transition resize-none"
          />

          <label htmlFor="datetime" className="block mb-2 font-medium text-gray-700">
            Thời gian:
          </label>
          <input
            id="datetime"
            name="datetime"
            type="datetime-local"
            value={form.datetime}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 transition"
          />

          <label htmlFor="type" className="block mb-2 font-medium text-gray-700">
            Loại công việc:
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8 transition bg-white"
          >
            <option>Cá nhân</option>
            <option>Nhóm</option>
            <option>Dự án</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-colors"
          >
            Tạo công việc
          </button>
        </form>
      )}
    </div>
  );
}   