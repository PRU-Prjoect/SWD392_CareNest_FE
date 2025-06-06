import React from "react";
import Badge from "../../../components/ui/Badge";
import type { Service } from "../../../types/service";

interface ServiceInfoProps {
  service: Service;
}

const ServiceInfo: React.FC<ServiceInfoProps> = ({ service }) => {
  return (
    <div className="space-y-4">
      {/* Tên và category */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
        <Badge variant="secondary">{service.category}</Badge>
      </div>

      {/* Rating và thống kê */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${
                  i < service.rating ? "fill-current" : "fill-gray-200"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span>{service.rating}</span>
        </div>
        <span>{service.reviewCount} đánh giá</span>
        <span>Lượt đặt {service.bookingCount}</span>
      </div>

      {/* Giá */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600">Giá sốc</p>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-gray-900">
            {service.currentPrice.toLocaleString("vi-VN")}đ
          </span>
          {service.discount && (
            <>
              <span className="text-lg text-gray-500 line-through">
                {service.originalPrice.toLocaleString("vi-VN")}đ
              </span>
              <Badge variant="destructive">-{service.discount}%</Badge>
            </>
          )}
        </div>
      </div>

      {/* Thông tin dịch vụ */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Loại thú:</span>
          <div className="flex gap-2">
            {service.petTypes.map((type) => (
              <Badge key={type} variant="outline">
                {type}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            Thời gian thực hiện:
          </span>
          <div className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
            <svg
              className="h-4 w-4 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-gray-700">
              {service.duration} phút
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceInfo;
