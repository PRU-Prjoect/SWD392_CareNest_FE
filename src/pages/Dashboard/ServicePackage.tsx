import React, { useState } from "react";
// Import icon Star từ thư viện lucide-react để dùng làm biểu tượng
import { Star } from "lucide-react"; 
// Import dữ liệu danh sách gói dịch vụ từ file JSON nội bộ
import listpackage from "@/data/listpackage.json";

const ServicePackage: React.FC = () => {
  const [showModal, setShowModal] = useState(false); // Quản lý trạng thái hiển thị modal
  const [modalType, setModalType] = useState<"renew" | "cancel" | null>(null); // Quản lý loại modal đang hiển thị: 'renew' hoặc 'cancel'

  const activeList = listpackage.find((plan) => plan.isActive);

  // Mở modal gia hạn
  const handleOpenRenewModal = () => {
    setModalType("renew");
    setShowModal(true);
  };

   // Mở modal hủy gia hạn
  const handleOpenCancelModal = () => {
    setModalType("cancel");
    setShowModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
    setModalType(null);
  };

   // Xác nhận gia hạn
  const handleConfirmRenew = () => {
    alert(`Gia hạn gói ${activeList?.name} thành công!`);
    handleCloseModal();
  };

  // Xác nhận hủy gia hạn
  const handleConfirmCancel = () => {
    alert(`Đã hủy gia hạn gói ${activeList?.name} thành công!`);
    handleCloseModal();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl shadow-md p-6 space-y-3">
        {/* Số điểm */}
        <p className="text-base font-medium">
          Số điểm hiện tại trong tài khoản: <span className="text-blue-600 font-bold">100.000đ</span>
        </p>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
          <Star className="w-5 h-5 text-yellow-500" />
          Gói hiện tại: <span className="font-bold text-blue-700">Pro</span>
        </div>
        <p className="text-sm text-gray-600">Hết hạn: 30/06/2025</p>
        <div className="flex gap-3 pt-3">
          <button
            onClick={handleOpenRenewModal}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow-md transition duration-300"
          >
            Gia hạn
          </button>
          <button
            onClick={handleOpenCancelModal}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg shadow-md transition duration-300"
          >
            Hủy gia hạn
          </button>
        </div>
      </div>

      {/* Danh sách các gói dịch vụ */}
      <div>
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-12">
          Gói dịch vụ của bạn
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {listpackage.map((list) => (
            // Hiển thị từng gói
            <div
              key={list.name}
              className={`rounded-2xl border p-6 shadow-sm flex flex-col h-full transition-all duration-300 ${
                list.isActive
                  ? "border-blue-600 shadow-lg bg-blue-50"
                  : "border-gray-300 hover:shadow-md bg-white"
              }`}
            >
              <h3 className="text-gray-900 text-2xl font-bold mb-4 text-center">
                {list.name}
              </h3>

              <p className="text-blue-600 font-bold mb-4 text-2xl text-center">
                {list.price}
              </p>

              {/* Danh sách tính năng */}
              <ul className="text-sm text-gray-600 space-y-2 mb-6 flex-grow">
                {list.features.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>

              <div className="mt-auto pt-4">
                <button
                  className={`w-full py-2 rounded-lg text-white font-medium transition ${
                    list.isActive
                      ? "bg-gray-300 text-gray-500 cursor-default"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={list.isActive}
                >
                  {list.buttonLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal xác nhận gia hạn hoặc hủy gia hạn */}
      {showModal && activeList && (
        <div
          className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-md w-full shadow-xl border border-gray-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal gia hạn */}
            {modalType === "renew" && (
              <>
                <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">
                  Gia Hạn Gói {activeList.name}
                </h2>
                <p className="text-center text-gray-700 mb-6">
                  Bạn muốn gia hạn gói <span className="font-semibold">{activeList.name}</span> thêm 1 tháng với giá <span className="font-semibold">{activeList.price}</span>?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleConfirmRenew}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                  >
                    Gia hạn
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition"
                  >
                    Hủy
                  </button>
                </div>
              </>
            )}

            {/* Modal hủy gia hạn */}
            {modalType === "cancel" && (
              <>
                <h2 className="text-xl font-bold text-red-600 mb-4 text-center">
                  Hủy Gia Hạn Gói {activeList.name}
                </h2>
                <p className="text-center text-gray-700 mb-6">
                  Bạn có chắc muốn hủy gia hạn tự động của gói <span className="font-semibold">{activeList.name}</span> không?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleConfirmCancel}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
                  >
                    Xác nhận hủy
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition"
                  >
                    Đóng
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePackage;
