// routes/index.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../services/ProtectedRoute";
import LoginPage from "../pages/Login";
import HomePage from "../pages/Home";
import AppLayoutForUser from "../layout/AppLayoutForUser";
import AppLayoutForGuest from "../layout/AppLayoutForGuest";
import RegisterType from "@/pages/RegisterType";
import RegisterPage from "@/pages/Register";
import SmartRedirect from "@/components/common/SmartRedirect";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registertype" element={<RegisterType />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Guest Layout - cho user chưa đăng nhập */}
      <Route path="/guest/*" element={<AppLayoutForGuest />}>
        <Route path="home" element={<HomePage />} />
        <Route index element={<Navigate to="home" replace />} />
      </Route>

      {/* Protected Routes with Layout - cho user đã đăng nhập */}
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <AppLayoutForUser />
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<HomePage />} />
        <Route index element={<Navigate to="home" replace />} />
      </Route>

      {/* Smart redirect based on auth status */}
      <Route path="/" element={<SmartRedirect />} />
    </Routes>
  );
};

export default AppRoutes;
