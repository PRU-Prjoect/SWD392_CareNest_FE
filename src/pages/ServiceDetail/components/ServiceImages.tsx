import React, { useState } from "react";

interface ServiceImagesProps {
  images: string[];
  serviceName: string;
}

const ServiceImages: React.FC<ServiceImagesProps> = ({
  images,
  serviceName,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Ảnh chính */}
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <img
          src={images[selectedImage]}
          alt={serviceName}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Ảnh thu nhỏ */}
      <div className="flex space-x-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-square w-20 overflow-hidden rounded-md border-2 ${
              selectedImage === index ? "border-orange-500" : "border-gray-200"
            }`}
          >
            <img
              src={image}
              alt={`${serviceName} ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceImages;
