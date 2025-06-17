// Import các component cần thiết từ thư viện react-router-dom
import { Routes, Route, Navigate } from "react-router-dom";
// Import component dùng để bảo vệ route (chỉ cho phép truy cập nếu đã đăng nhập)
import { ProtectedRoute } from "../services/ProtectedRoute";

// Import các trang (pages) và layout
import LoginPage from "../pages/Login";
import HomePage from "../pages/Home";
import AppLayoutForUser from "../layout/AppLayoutForUser"; // Layout cho user đã đăng nhập
import AppLayoutForGuest from "../layout/AppLayoutForGuest"; // Layout cho user chưa đăng nhập
import RegisterType from "@/pages/RegisterType";
import RegisterPage from "@/pages/Register";
import ShopDashboard from "../pages/Shop/ShopDashboard";
import OrderManagement from "@/pages/Shop/Order/OrderManagement";
import ServiceManagement from "@/pages/Shop/ServiceManagement";
import HotelRoomManagement from "@/pages/Shop/Order/HotelRoomManagement";

import RegisterCustomer from "@/pages/RegisterCustomer"; // Trang đăng ký cho khách hàng
import AppLayoutForShop from "../layout/AppLayoutForShop"; // Layout cho Shop/Admin
import SmartRedirect from "@/components/common/SmartRedirect"; // Component điều hướng thông minh dựa trên trạng thái đăng nhập
import RegisterShop from "@/pages/RegisterShop"; // Trang đăng ký cho Shop
import StoreProfile from "@/pages/Shop/ShopProfile/StoreProfilePage";

// Component chứa toàn bộ định nghĩa các route
const AppRoutes = () => {
  return (
    <Routes>
      {/* --------- Các Route Public --------- */}
      {/* Trang đăng nhập */}
      <Route path="/login" element={<LoginPage />} />
      {/* Trang chọn loại tài khoản để đăng ký */}
      <Route path="/registertype" element={<RegisterType />} />
      {/* Trang đăng ký tổng quát */}
      <Route path="/register" element={<RegisterPage />} />
      {/* Trang đăng ký dành cho khách hàng */}
      <Route path="/register-customer" element={<RegisterCustomer />} />
      {/* Trang đăng ký dành cho Shop */}
      <Route path="/registershop" element={<RegisterShop />} />

      {/* --------- Route cho người dùng chưa đăng nhập (Guest Layout) --------- */}
      <Route path="/guest/*" element={<AppLayoutForGuest />}>
        {/* Mặc định chuyển hướng tới trang Home */}
        <Route path="home" element={<HomePage />} />
        <Route index element={<Navigate to="home" replace />} />
      </Route>

      {/* --------- Route cho người dùng đã đăng nhập (User Layout) --------- */}
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            {" "}
            {/* Chặn truy cập nếu chưa đăng nhập */}
            <AppLayoutForUser />
          </ProtectedRoute>
        }
      >
        {/* Trang home sau khi đăng nhập */}
        <Route path="home" element={<HomePage />} />
        <Route index element={<Navigate to="home" replace />} />
      </Route>

      {/* --------- Route dành cho Shop/Admin (Admin Layout) --------- */}
      <Route
        path="/shop/*"
        element={
          // TODO: Đang bỏ qua việc bảo vệ route, nên thêm lại ProtectedRoute nếu cần
          // <ProtectedRoute>
          <AppLayoutForShop />
          // </ProtectedRoute>
        }
      >
        {/* Dashboard chính của Shop */}
        <Route path="dashboard" element={<ShopDashboard />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="services" element={<ServiceManagement />} />
        <Route path="hotels" element={<HotelRoomManagement/>} />
        <Route path="shop-profile" element={<StoreProfile/>} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* --------- Trang gốc ("/") sẽ redirect thông minh theo trạng thái đăng nhập --------- */}
      <Route path="/" element={<SmartRedirect />} />
    </Routes>
  );
};

export default AppRoutes;
