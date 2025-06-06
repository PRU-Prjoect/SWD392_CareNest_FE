// pages/Home/components/LatestServices.tsx
import React from "react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

interface Service {
  id: number;
  title: string;
  price: string;
  image: string;
  rating?: number;
  reviews?: number;
}

const highestRating: Service[] = [
  {
    id: 1,
    title: "Cắt tỉa lông",
    price: "200.000 đ",
    image: "/public/image/service1.jpg",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    title: "Cắt tỉa lông",
    price: "200.000 đ",
    image: "/public/image/service2.jpg",
    rating: 4.9,
    reviews: 89,
  },
  {
    id: 3,
    title: "Cắt tỉa lông",
    price: "200.000 đ",
    image: "/public/image/service3.jpg",
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 4,
    title: "Cắt tỉa lông",
    price: "200.000 đ",
    image: "/public/image/service4.jpg",
    rating: 4.8,
    reviews: 203,
  },
  {
    id: 5,
    title: "Cắt tỉa lông",
    price: "200.000 đ",
    image: "/public/image/service5.jpg",
    rating: 4.9,
    reviews: 178,
  },
  {
    id: 6,
    title: "Cắt tỉa lông",
    price: "200.000 đ",
    image: "/public/image/service6.jpg",
    rating: 4.6,
    reviews: 92,
  },
];

const HighestRating: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 relative">
              ĐÁNH GIÁ CAO NHẤT
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#2A9D8F] rounded"></div>
            </h2>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {highestRating.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="md"
            className="border-[#2A9D8F] text-[#2A9D8F] hover:bg-[#2A9D8F] hover:text-white"
          >
            Xem thêm dịch vụ
          </Button>
        </div>
      </div>
    </section>
  );
};

// Service Card Component
interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            // Fallback image
            (e.target as HTMLImageElement).src =
              "https://i.pinimg.com/736x/26/c7/35/26c7355fe46f62d84579857c6f8c4ea5.jpg";
          }}
        />
        {service.rating && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
            <span className="text-yellow-500 text-sm">⭐</span>
            <span className="text-xs font-medium">{service.rating}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#2A9D8F] transition-colors duration-200">
          {service.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-[#2A9D8F]">
            {service.price}
          </span>
          {service.reviews && (
            <span className="text-xs text-gray-500">
              ({service.reviews} đánh giá)
            </span>
          )}
        </div>
        <Button
          variant="primary"
          size="sm"
          className="w-full mt-3 bg-[#2A9D8F] hover:bg-[#238276]"
        >
          Đặt ngay
        </Button>
      </div>
    </Card>
  );
};

export default HighestRating;
