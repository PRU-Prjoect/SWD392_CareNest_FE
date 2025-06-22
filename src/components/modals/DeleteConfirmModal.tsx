// components/modals/DeleteConfirmModal.tsx
import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceName: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  serviceName,
}) => {
  const { deleting, deleteError } = useSelector(
    (state: RootState) => state.service
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] relative">
        {/* Nút đóng popup */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold"
          aria-label="Đóng"
          disabled={deleting}
        >
          ✕
        </button>

        <div className="text-center">
          {/* Icon cảnh báo */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-semibold mb-2 text-gray-900">
            Xác nhận xóa dịch vụ
          </h3>

          <p className="text-sm text-gray-600 mb-6">
            Bạn có chắc chắn muốn xóa dịch vụ <strong>"{serviceName}"</strong>?
            <br />
            Hành động này không thể hoàn tác.
          </p>

          {deleteError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {deleteError.message}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              disabled={deleting}
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xóa...
                </>
              ) : (
                "Xóa dịch vụ"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
