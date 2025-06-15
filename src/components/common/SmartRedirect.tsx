// components/common/SmartRedirect.tsx
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const SmartRedirect = () => {
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#2A9D8F]"></div>
      </div>
    );
  }

  // Redirect based on auth status
  if (isAuthenticated) {
    return <Navigate to="/app/home" replace />;
  }

  return <Navigate to="/guest/home" replace />;
};

export default SmartRedirect;
