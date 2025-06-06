// pages/Home/components/ServiceCard.tsx
import React from "react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { Link } from "react-router-dom";

interface Service {
  id: number;
  title: string;
  price: string;
  image: string;
  rating?: number;
  reviews?: number;
  description?: string;
}

interface ServiceCardProps {
  service: Service;
  className?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  className = "",
}) => {
  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer group ${className}`}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            // Fallback image nếu không load được
            (e.target as HTMLImageElement).src =
              "hhttps://i.pinimg.com/736x/38/f4/f2/38f4f2d8652c7aa795f5e3ee75b5919c.jpg";
          }}
        />

        {/* Rating Badge */}
        {service.rating && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
            <span className="text-yellow-500 text-sm">⭐</span>
            <span className="text-xs font-medium">{service.rating}</span>
          </div>
        )}

        {/* Overlay khi hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#2A9D8F] transition-colors duration-200 line-clamp-2">
          {service.title}
        </h3>

        {service.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {service.description}
          </p>
        )}

        {/* Price and Reviews */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-[#2A9D8F]">
            {service.price}
          </span>
          {service.reviews && (
            <span className="text-xs text-gray-500">
              ({service.reviews} đánh giá)
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            className="flex-1 bg-[#2A9D8F] hover:bg-[#238276]"
            onClick={() => console.log("Đặt dịch vụ:", service.id)}
          >
            Đặt ngay
          </Button>
          <Link to={`/service/${service.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-[#2A9D8F] text-[#2A9D8F] hover:bg-[#2A9D8F] hover:text-white"
            >
              Chi tiết
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
