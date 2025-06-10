import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../services/ProtectedRoute";
import LoginPage from "../pages/Login";
import HomePage from "../pages/Home";
import AppLayoutForUser from "../layout/AppLayoutForUser";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Wrap HomePage with layout components */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <AppLayoutForUser>
              <HomePage />
            </AppLayoutForUser>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/home" />} />
    </Routes>
  );
};

export default AppRoutes;
