// src/services/ProtectedRoute.tsx
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import type { RootState } from "../store/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, loading, user } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu route yêu cầu quyền admin nhưng người dùng không phải admin
  if (requireAdmin && user?.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
