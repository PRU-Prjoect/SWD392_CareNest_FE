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

  // Kiểm tra nếu route yêu cầu quyền admin
  if (requireAdmin) {
    // Cho phép tài khoản với username là 'admin' hoặc role là Admin hoặc role=4
    const isSpecialAdmin = user?.username === 'admin' || user?.name === 'admin';
    console.log("ProtectedRoute - Checking conditions:", {
      usernameCheck: user?.username === "admin",
      nameCheck: user?.name === "admin",
      roleCheck: user?.role === "Admin" || user?.role === "4" || Number(user?.role) === 4,
      user: user
    });
    const hasAdminRole = user?.role === 'Admin' || user?.role === "4" ||Number(user?.role) === 4;

    if (!isSpecialAdmin && !hasAdminRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};
