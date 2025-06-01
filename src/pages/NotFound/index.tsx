import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="text-9xl font-bold text-blue-600">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">
          Trang không tìm thấy
        </h1>
        <p className="text-gray-600 mt-2">
          Trang bạn đang tìm kiếm không tồn tại.
        </p>
        <div className="mt-6">
          <Link to="/">
            <Button variant="primary">Về trang chủ</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
