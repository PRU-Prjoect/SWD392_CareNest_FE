import React from 'react';

interface TableActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  disableEdit?: boolean;
  disableDelete?: boolean;
  disableView?: boolean;
}

const TableActions: React.FC<TableActionsProps> = ({
  onEdit,
  onDelete,
  onView,
  disableEdit = false,
  disableDelete = false,
  disableView = false
}) => {
  return (
    <div className="flex items-center space-x-2">
      {onView && (
        <button
          onClick={onView}
          disabled={disableView}
          className={`p-1 rounded-full ${disableView ? 'text-gray-300 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-50'}`}
          title="Xem chi tiết"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      )}
      
      {onEdit && (
        <button
          onClick={onEdit}
          disabled={disableEdit}
          className={`p-1 rounded-full ${disableEdit ? 'text-gray-300 cursor-not-allowed' : 'text-green-500 hover:bg-green-50'}`}
          title="Chỉnh sửa"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      )}
      
      {onDelete && (
        <button
          onClick={onDelete}
          disabled={disableDelete}
          className={`p-1 rounded-full ${disableDelete ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}
          title="Xóa"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default TableActions; 