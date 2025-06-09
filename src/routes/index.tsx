// src/routes/index.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../services/ProtectedRoute";
import LoginPage from "../pages/Login";
import HomePage from "../pages/Home";
import DashboardPage from "../pages/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default AppRoutes;
