// routes/index.tsx - Đảm bảo chỉ dùng 1 layout
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayoutForUser from "../layout/AppLayoutForUser";
// ❌ KHÔNG import AppLayout nếu đang dùng AppLayoutForUser
// import AppLayout from "../layout/AppLayout";

// Import pages
import HomePage from "../pages/Home";
import LoginPage from "../pages/Login";
import RegisterPage from "@/pages/Register";
import RegisterType from "@/pages/RegisterType";
import ServiceDetail from "@/pages/ServiceDetail/ServiceDetail";
import ServicesPage from "@/pages/Services/Service";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* ✅ CHỈ dùng 1 layout */}
        <Route
          path="/"
          element={
            <AppLayoutForUser>
              <HomePage />
            </AppLayoutForUser>
          }
        />
        <Route
          path="/login"
          element={
            <AppLayoutForUser>
              <LoginPage />
            </AppLayoutForUser>
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/service-detail" element={<ServiceDetail />} />

        <Route path="/registertype" element={<RegisterType />} />
        <Route path="/services" element={<ServicesPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
