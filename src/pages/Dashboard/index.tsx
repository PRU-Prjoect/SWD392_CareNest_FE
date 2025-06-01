import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import Button from "../../components/ui/Button";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  // Bỏ comment user nếu không sử dụng
  // const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Dashboard - Quản lý Task
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Chào mừng bạn đến với hệ thống quản lý task
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
