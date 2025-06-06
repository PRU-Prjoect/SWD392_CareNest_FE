import React from "react";
import Button from "../../../components/ui/Button";

interface ServiceActionsProps {
  onAddToCart: () => void;
  onBookNow: () => void;
}

const ServiceActions: React.FC<ServiceActionsProps> = ({
  onAddToCart,
  onBookNow,
}) => {
  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        onClick={onAddToCart}
        className="flex-1 flex items-center justify-center gap-2 border-2 border-teal-600 text-teal-600 hover:bg-teal-50"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6.5-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
          />
        </svg>
        Thêm vào giỏ
      </Button>

      <Button
        variant="primary"
        onClick={onBookNow}
        className="flex-1 bg-teal-600 hover:bg-teal-700"
      >
        Đặt ngay
      </Button>
    </div>
  );
};

export default ServiceActions;
