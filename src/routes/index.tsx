import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../services/ProtectedRoute";
import LoginPage from "../pages/Login";
import HomePage from "../pages/Home";
import AppLayoutForUser from "../layout/AppLayoutForUser";
import RegisterType from "@/pages/RegisterType";
import RegisterPage from "@/pages/Register";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registertype" element={<RegisterType />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes with Layout */}
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <AppLayoutForUser />
          </ProtectedRoute>
        }
      >
        <Route path="home" element={<HomePage />} />
        {/* <Route path="profile" element={<ProfilePage />} /> */}
        {/* <Route path="settings" element={<SettingsPage />} /> */}
        <Route index element={<Navigate to="home" replace />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/app" replace />} />
    </Routes>
  );
};

export default AppRoutes;
