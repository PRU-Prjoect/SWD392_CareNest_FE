import { type ReactNode } from "react";

interface ComponentCardProps {
  title?: string;
  desc?: string;
  children: ReactNode;
  className?: string;
}

const ComponentCard = ({
  title,
  desc,
  children,
  className = "",
}: ComponentCardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {desc && <p className="text-sm text-gray-600 mt-1">{desc}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default ComponentCard;
