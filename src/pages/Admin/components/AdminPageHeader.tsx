import React from 'react';
import type { ReactNode } from 'react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  description,
  actionButton
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {description && (
          <p className="mt-1 text-gray-500">{description}</p>
        )}
      </div>
      
      {actionButton && (
        <button
          onClick={actionButton.onClick}
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {actionButton.icon && (
            <span className="mr-2">{actionButton.icon}</span>
          )}
          {actionButton.label}
        </button>
      )}
    </div>
  );
};

export default AdminPageHeader; 