import { useState, useEffect } from 'react';

type Task = {
  id: number;
  title: string;
  description: string;
  deadline: string; // ISO string, ví dụ: "2025-05-31T14:30"
};

type List = {
  id: number;
  title: string;
  tasks: Task[];
};

export default function EmployeeManagement() {
  const [lists, setLists] = useState<List[]>([
    {
      id: 1,
      title: 'Todo',
      tasks: [],
    },
  ]);

  const [view, setView] = useState<'form' | 'board'>('form');

  // Form tạo task ban đầu (view 'form')
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  // State thêm thẻ mới trong từng list
  const [addingCardListId, setAddingCardListId] = useState<number | null>(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');

  // State thêm danh sách mới
  const [addingList, setAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  // State menu 3 chấm của danh sách
  const [listMenuOpenId, setListMenuOpenId] = useState<number | null>(null);

  // State modal sửa danh sách
  const [editingList, setEditingList] = useState<{ id: number; title: string } | null>(null);
  const [editListTitle, setEditListTitle] = useState('');

  // State modal sửa thẻ chi tiết
  const [editingTaskModal, setEditingTaskModal] = useState<
    { listId: number; task: Task } | null
  >(null);

  // Modal chỉnh sửa thẻ: state form
  const [modalEditTitle, setModalEditTitle] = useState('');
  const [modalEditDescription, setModalEditDescription] = useState('');
  const [modalEditDeadline, setModalEditDeadline] = useState('');

  // Sync modal form khi mở modal chỉnh sửa thẻ
  useEffect(() => {
    if (editingTaskModal) {
      setModalEditTitle(editingTaskModal.task.title);
      setModalEditDescription(editingTaskModal.task.description);
      setModalEditDeadline(editingTaskModal.task.deadline);
    }
  }, [editingTaskModal]);

  // Thêm task từ form tạo mới (view 'form')
  const handleAddTask = () => {
    if (title.trim() === '') return;
    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      deadline,
    };
    setLists(prev =>
      prev.map(l =>
        l.id === 1 ? { ...l, tasks: [...l.tasks, newTask] } : l // Thêm mặc định vào list id=1 (Todo)
      )
    );
    setTitle('');
    setDescription('');
    setDeadline('');
    setView('board');
  };

  // Xóa task theo listId và taskId
  const handleDeleteTask = (listId: number, taskId: number) => {
    setLists(prev =>
      prev.map(l =>
        l.id === listId ? { ...l, tasks: l.tasks.filter(t => t.id !== taskId) } : l
      )
    );
  };

  // Thêm thẻ mới vào list
  const handleAddCard = (listId: number) => {
    if (newCardTitle.trim() === '') return;
    const newTask: Task = {
      id: Date.now(),
      title: newCardTitle.trim(),
      description: newCardDescription.trim(),
      deadline: '',
    };
    setLists(prev =>
      prev.map(l => (l.id === listId ? { ...l, tasks: [...l.tasks, newTask] } : l))
    );
    setNewCardTitle('');
    setNewCardDescription('');
    setAddingCardListId(null);
  };

  // Thêm danh sách mới
  const handleAddList = () => {
    if (newListTitle.trim() === '') return;
    const newList: List = {
      id: Date.now(),
      title: newListTitle.trim(),
      tasks: [],
    };
    setLists(prev => [...prev, newList]);
    setNewListTitle('');
    setAddingList(false);
  };

  // Xóa danh sách
  const handleDeleteList = (listId: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa danh sách này?')) return;
    setLists(prev => prev.filter(l => l.id !== listId));
    setListMenuOpenId(null);
  };

  // Mở modal sửa danh sách
  const openEditListModal = (list: List) => {
    setEditingList({ id: list.id, title: list.title });
    setEditListTitle(list.title);
    setListMenuOpenId(null);
  };

  // Lưu sửa danh sách
  const handleSaveEditList = () => {
    if (editListTitle.trim() === '') return;
    setLists(prev =>
      prev.map(l => (l.id === editingList!.id ? { ...l, title: editListTitle.trim() } : l))
    );
    setEditingList(null);
  };

  // Hủy sửa danh sách
  const handleCancelEditList = () => {
    setEditingList(null);
  };

  // Mở modal chỉnh sửa thẻ chi tiết
  const openEditTaskModal = (listId: number, task: Task) => {
    setEditingTaskModal({ listId, task });
  };

  // Đóng modal chỉnh sửa thẻ
  const closeEditTaskModal = () => {
    setEditingTaskModal(null);
  };

  // Lưu cập nhật thẻ từ modal
  const handleUpdateTask = () => {
    if (!editingTaskModal) return;
    if (modalEditTitle.trim() === '') {
      alert('Tiêu đề không được để trống');
      return;
    }
    setLists(prev =>
      prev.map(list =>
        list.id === editingTaskModal.listId
          ? {
              ...list,
              tasks: list.tasks.map(t =>
                t.id === editingTaskModal.task.id
                  ? {
                      ...t,
                      title: modalEditTitle.trim(),
                      description: modalEditDescription,
                      deadline: modalEditDeadline,
                    }
                  : t
              ),
            }
          : list
      )
    );
    closeEditTaskModal();
  };

  /* --- Component con --- */

  // Nút menu 3 chấm góc phải danh sách
  const ListMenu = ({ listId }: { listId: number }) => {
    const isOpen = listMenuOpenId === listId;
    return (
      <div className="relative inline-block text-left">
        <button
          onClick={e => {
            e.stopPropagation();
            setListMenuOpenId(isOpen ? null : listId);
          }}
          aria-haspopup="true"
          aria-expanded={isOpen}
          className="p-1 rounded-full hover:bg-gray-200 transition"
          title="Tùy chọn danh sách"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6-2a2 2 0 100 4 2 2 0 000-4zm6 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
        {isOpen && (
          <div
            className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
            onClick={e => e.stopPropagation()}
          >
            <div className="py-1">
              <button
                onClick={() => {
                  const list = lists.find(l => l.id === listId);
                  if (list) openEditListModal(list);
                  setListMenuOpenId(null);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sửa danh sách
              </button>
              <button
                onClick={() => handleDeleteList(listId)}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
              >
                Xóa danh sách
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Component Task Card (nhấn mở modal chỉnh sửa chi tiết)
  const TaskCard = ({ task, listId }: { task: Task; listId: number }) => {
    return (
      <div
        className="bg-blue-50 p-5 rounded-xl mb-4 flex justify-between items-start shadow-md hover:shadow-xl transition-shadow cursor-pointer"
        onClick={() => openEditTaskModal(listId, task)}
      >
        <div className="flex flex-col flex-grow max-w-[75%]">
          <p className="font-semibold text-blue-900 break-words">{task.title}</p>
          {task.description && (
            <p className="text-gray-700 text-sm mt-1 whitespace-pre-line break-words">{task.description}</p>
          )}
          {task.deadline && (
            <p className="text-sm text-gray-600 mt-1">
              Deadline: <time dateTime={task.deadline}>{task.deadline}</time>
            </p>
          )}
        </div>
        <button
          onClick={e => {
            e.stopPropagation();
            handleDeleteTask(listId, task.id);
          }}
          className="text-red-600 hover:text-white hover:bg-red-600 font-semibold text-lg rounded-full p-2 border border-red-600 transition flex items-center justify-center w-7 h-7 select-none"
          aria-label="Xóa công việc"
          title="Xóa công việc"
        >
          ✕
        </button>
      </div>
    );
  };

  // Form thêm thẻ mới
  const AddCardForm = ({ listId }: { listId: number }) => {
    const isAdding = addingCardListId === listId;

    if (!isAdding) {
      return (
        <button
          onClick={() => setAddingCardListId(listId)}
          className="mt-6 text-blue-600 font-semibold hover:underline text-left transition-all"
          aria-label="Thêm thẻ mới"
        >
          + Thêm thẻ
        </button>
      );
    }

    return (
      <div className="mt-6 flex flex-col gap-3 bg-blue-50 backdrop-blur-sm p-4 rounded-lg shadow-inner">
        <input
          type="text"
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          placeholder="Tiêu đề thẻ mới"
          value={newCardTitle}
          onChange={e => setNewCardTitle(e.target.value)}
          autoFocus
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAddCard(listId);
            } else if (e.key === 'Escape') {
              setAddingCardListId(null);
              setNewCardTitle('');
              setNewCardDescription('');
            }
          }}
        />
        <textarea
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none"
          placeholder="Mô tả thẻ mới (tuỳ chọn)"
          rows={3}
          value={newCardDescription}
          onChange={e => setNewCardDescription(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              setAddingCardListId(null);
              setNewCardTitle('');
              setNewCardDescription('');
            }
          }}
        />
        <div className="flex gap-3">
          <button
            onClick={() => handleAddCard(listId)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            aria-label="Thêm thẻ"
          >
            Thêm
          </button>
          <button
            onClick={() => {
              setAddingCardListId(null);
              setNewCardTitle('');
              setNewCardDescription('');
            }}
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            aria-label="Hủy thêm thẻ"
          >
            Hủy
          </button>
        </div>
      </div>
    );
  };

  // Form thêm danh sách mới
  const AddListForm = () => {
    if (!addingList) {
      return (
        <div
          onClick={() => setAddingList(true)}
          className="w-64 p-6 rounded-2xl shadow bg-white text-gray-500 flex items-center justify-center cursor-pointer select-none hover:bg-gray-100 transition text-center"
          aria-label="Thêm danh sách mới"
          role="button"
        >
          + Thêm danh sách khác
        </div>
      );
    }

    return (
      <div className="w-64 p-4 rounded-2xl shadow bg-white flex flex-col">
        <input
          type="text"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          placeholder="Tên danh sách"
          value={newListTitle}
          onChange={e => setNewListTitle(e.target.value)}
          autoFocus
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddList();
            }
            if (e.key === 'Escape') setAddingList(false);
          }}
        />
        <div className="flex gap-2">
          <button
            onClick={handleAddList}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition flex-grow"
          >
            Thêm
          </button>
          <button
            onClick={() => setAddingList(false)}
            className="px-4 py-1 rounded border border-gray-300 hover:bg-gray-100 transition"
          >
            Hủy
          </button>
        </div>
      </div>
    );
  };

  // Modal chỉnh sửa danh sách
  const EditListModal = () => {
    const isOpen = editingList !== null;

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-40 flex items-center justify-center bg-opacity-10 backdrop-blur-sm"
        onClick={() => setEditingList(null)}
      >
        <div
          onClick={e => e.stopPropagation()}
          className={`bg-white rounded-lg shadow-lg p-6 w-96 max-w-full transform transition-opacity duration-300 ease-out ${
            isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <h3 className="text-xl font-semibold mb-4">Sửa danh sách</h3>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            value={editListTitle}
            onChange={e => setEditListTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSaveEditList();
              if (e.key === 'Escape') handleCancelEditList();
            }}
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancelEditList}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
            >
              Hủy
            </button>
            <button
              onClick={handleSaveEditList}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal chỉnh sửa thẻ chi tiết
  const EditTaskModal = () => {
    const isOpen = editingTaskModal !== null;

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm bg-opacity-10"
        onClick={closeEditTaskModal}
      >
        <div
          onClick={e => e.stopPropagation()}
          className={`bg-white rounded-lg shadow-lg p-6 w-96 max-w-full transform transition-opacity duration-300 ease-out ${
            isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          {/* Nút đóng góc trên cùng bên phải */}
          <button
            onClick={closeEditTaskModal}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold text-lg p-1 rounded focus:outline-none"
            aria-label="Đóng"
            title="Đóng"
          >
            ✕
          </button>
          <h3 className="text-xl font-semibold mb-4">Chỉnh sửa công việc</h3>
          <label className="block font-semibold mb-1">Tiêu đề:</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            value={modalEditTitle}
            onChange={e => setModalEditTitle(e.target.value)}
          />

          <label className="block font-semibold mb-1">Mô tả:</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-none"
            rows={4}
            value={modalEditDescription}
            onChange={e => setModalEditDescription(e.target.value)}
          />

          <label className="block font-semibold mb-1">Deadline:</label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            value={modalEditDeadline}
            onChange={e => setModalEditDeadline(e.target.value)}
          />

          <div className="w-full">
            <button
              onClick={handleUpdateTask}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Cập nhật
            </button>                 
          </div>
        </div>
      </div>
    );
  };

  /* --- Render chính --- */

  if (view === 'form') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Quản lý Task Nhân viên</h2>
          <div className="space-y-5">
            <div>
              <label className="block font-semibold mb-1">Tiêu đề:</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tiêu đề công việc"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Mô tả:</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mô tả công việc"
                rows={4}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Deadline:</label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleAddTask}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
            >
              Thêm công việc
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => setView('form')}
        className="mb-6 text-sm text-blue-600 hover:underline flex items-center gap-2 font-medium"
        aria-label="Quay lại tạo công việc"
      >
        <span className="text-2xl leading-none">←</span> Quay lại tạo công việc
      </button>

      <div className="flex gap-8 max-w-7xl mx-auto overflow-x-auto p-2">
        {lists.map(list => (
          <div
            key={list.id}
            className="bg-white p-6 rounded-2xl shadow-lg w-80 flex flex-col max-h-[80vh]"
          >
            <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
              <h3 className="font-semibold text-xl text-gray-800">{list.title}</h3>
              <ListMenu listId={list.id} />
            </div>
            <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100">
              {list.tasks.length === 0 ? (
                <p className="text-gray-400 text-center mt-12 italic select-none">
                  Chưa có công việc nào. Hãy thêm ngay!
                </p>
              ) : (
                list.tasks.map(task => <TaskCard key={task.id} task={task} listId={list.id} />)
              )}
            </div>
            <AddCardForm listId={list.id} />
          </div>
        ))}

        <AddListForm />
      </div>

      {/* Modal sửa danh sách */}
      <EditListModal />

      {/* Modal sửa task chi tiết */}
      <EditTaskModal />
    </div>
  );
}