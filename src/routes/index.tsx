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
import ProfilePage from "../pages/Profile"; // ✅ Import ProfilePage
import ServicesPage from "@/pages/Services/Service"; // ✅ Thêm import
import BookingPage from "@/pages/Booking/BookingPage";
import PetHotelBooking from "@/pages/Booking/PetHotelBooking"; // Import trang đặt phòng pet hotel
import ThankYouPage from "@/pages/ThankYou/ThankYouPage";
import OrderHotelRoomManagement from "@/pages/Shop/Order/OrderHotelRoomManagement";
import OrderHistoryForUser from "@/pages/Shop/Order/OrderHistoryForUser";
import CurrentOrderForUser from "@/pages/ServiceDetail/components/CurrentOrderForUser";
import ShopServicesPage from "@/pages/Shop/ShopServices";
import HotelBookingDetail from "@/pages/ServiceDetail/HotelBookingDetail"; // Import trang chi tiết đặt phòng

import RegisterCustomer from "@/pages/RegisterCustomer"; // Trang đăng ký cho khách hàng
import AppLayoutForShop from "../layout/AppLayoutForShop"; // Layout cho Shop/Admin
import SmartRedirect from "@/components/common/SmartRedirect"; // Component điều hướng thông minh dựa trên trạng thái đăng nhập
import RegisterShop from "@/pages/RegisterShop"; // Trang đăng ký cho Shop

// ✅ Import các component cho Shop Profile
import ShopProfileLayout from "@/pages/Shop/components/ShopProfileLayout";
import ShopInfo from "@/pages/Shop/ShopProfile/ShopInfo";
import ShopSecurity from "@/pages/Shop/ShopProfile/ShopSecurity";
import ServiceDetailPage from "@/pages/ServiceDetail/components/ServiceDetailPage";
import ShopBranches from "@/pages/Shop/ShopProfile/ShopBranches";
import ServiceDetail from "@/pages/Shop/ServiceDetail";
import AppointmentDetailPage from "@/pages/ServiceDetail/components/AppointmentDetailPage";

// Import các trang khách sạn mới
import HotelServices from "@/pages/Services/HotelServices";
import HotelDetailPage from "@/pages/ServiceDetail/HotelDetailPage";

// ✅ Import Admin layout và components
import AppLayoutForAdmin from "../layout/AppLayoutForAdmin";
import {
  DashboardPage,
  UsersManagement,
  ShopsManagement,
  ServicesManagement,
  ReportsPage,
  SystemSettings
} from "@/pages/Admin";

// Component chứa toàn bộ định nghĩa các route
const AppRoutes = () => {
  return (
    <Routes>
      {/* --------- Các Route Public --------- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registertype" element={<RegisterType />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register-customer" element={<RegisterCustomer />} />
      <Route path="/registershop" element={<RegisterShop />} />

      {/* --------- Route cho người dùng chưa đăng nhập (Guest Layout) --------- */}
      <Route path="/guest/*" element={<AppLayoutForGuest />}>
        <Route path="home" element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="service-detail/:id" element={<ServiceDetailPage />} />
        <Route path="booking/:serviceId" element={<BookingPage />} />
        <Route path="shop/:shopId/services" element={<ShopServicesPage />} />
        {/* Routes mới cho khách sạn */}
        <Route path="hotel-services" element={<HotelServices />} />
        <Route path="hotel/:id" element={<HotelDetailPage />} />
        <Route path="hotel-booking/:roomId" element={<PetHotelBooking />} />
        <Route path="hotel-booking-detail/:id" element={<HotelBookingDetail />} />
        <Route index element={<Navigate to="home" replace />} />
      </Route>

      {/* --------- Route cho người dùng đã đăng nhập (User Layout) --------- */}
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <AppLayoutForUser />
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="service-detail/:id" element={<ServiceDetailPage />} />
        <Route path="booking/:serviceId" element={<BookingPage />} />
        <Route path="thank-you" element={<ThankYouPage />} />
        <Route path="order-history" element={<OrderHistoryForUser />} />
        <Route path="current-order" element={<CurrentOrderForUser />} />
        <Route path="appointments/:appointmentId" element={<AppointmentDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="shop/:shopId/services" element={<ShopServicesPage />} />
        {/* Routes mới cho khách sạn */}
        <Route path="hotel-services" element={<HotelServices />} />
        <Route path="hotel/:id" element={<HotelDetailPage />} />
        <Route path="hotel-booking/:roomId" element={<PetHotelBooking />} />
        <Route path="hotel-booking-detail/:id" element={<HotelBookingDetail />} />
        <Route index element={<Navigate to="home" replace />} />
      </Route>

      {/* --------- Route dành cho Shop/Admin (Admin Layout) --------- */}
      <Route
        path="/shop/*"
        element={
          <ProtectedRoute>
            <AppLayoutForShop />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<ShopDashboard />} />

        {/* ✅ Thêm các route cho đơn hàng */}
        <Route path="orders/services" element={<OrderManagement />} />
        <Route path="orders/hotels" element={<OrderHotelRoomManagement />} />
        <Route path="appointments/:appointmentId" element={<AppointmentDetailPage />} />

        <Route path="services" element={<ServiceManagement />} />
        <Route path="services/:id" element={<ServiceDetail />} />
        <Route path="hotels" element={<HotelRoomManagement />} />
        <Route path="shop-profile" element={<ShopProfileLayout />}>
          <Route path="info" element={<ShopInfo />} />
          <Route path="security" element={<ShopSecurity />} />
          <Route path="branches" element={<ShopBranches />} />
          <Route index element={<Navigate to="info" replace />} />
        </Route>

        <Route path="profile" element={<ProfilePage />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* --------- Route dành cho Admin --------- */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AppLayoutForAdmin />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="shops" element={<ShopsManagement />} />
        <Route path="services" element={<ServicesManagement />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SystemSettings />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="/" element={<SmartRedirect />} />
    </Routes>
  );
};

export default AppRoutes;
