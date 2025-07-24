import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { RootState } from "@/store/store";

const AdminDashboard = () => {
  // Hooks
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentShop, loading } = useSelector(
    (state: RootState) => state.shop
  );

  // ✅ Gọi API getShopById khi component mount
  useEffect(() => {
    if (user?.id) {
      console.log("🚀 Fetching shop data for account_id:", user.id);
      // Sử dụng cách đơn giản để tránh lỗi TypeScript
      dispatch({ 
        type: 'shop/getById',
        payload: user.id
      });
    }
  }, [dispatch, user?.id]);

  // ✅ Xử lý tên shop hiển thị
  const getShopDisplayName = () => {
    if (loading) {
      return "Đang tải thông tin cửa hàng...";
    }

    if (currentShop?.name) {
      return currentShop.name;
    }

    // Fallback nếu không có data
    return "Cửa hàng chăm sóc sức khỏe thú cưng";
  };

  // Dữ liệu mẫu cho biểu đồ cột (giữ nguyên)
  const revenueData = [
    { name: "T1", value: 400 },
    { name: "T2", value: 300 },
    { name: "T3", value: 500 },
    { name: "T4", value: 280 },
    { name: "T5", value: 390 },
    { name: "T6", value: 600 },
    { name: "T7", value: 320 },
  ];

  const serviceData = [
    { name: "T1", value: 240 },
    { name: "T2", value: 139 },
    { name: "T3", value: 380 },
    { name: "T4", value: 200 },
    { name: "T5", value: 278 },
    { name: "T6", value: 450 },
    { name: "T7", value: 189 },
  ];

  const productData = [
    { name: "T1", value: 340 },
    { name: "T2", value: 200 },
    { name: "T3", value: 280 },
    { name: "T4", value: 180 },
    { name: "T5", value: 290 },
    { name: "T6", value: 350 },
    { name: "T7", value: 220 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold text-lg">
                {currentShop?.name
                  ? currentShop.name.charAt(0).toUpperCase()
                  : "P"}
              </span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              Chào mừng quay trở lại, ✨
            </h1>
            {/* ✅ Thay thế text bằng tên shop thật */}
            <p className="text-lg text-gray-600">{getShopDisplayName()}</p>
          </div>
        </div>
      </div>

      {/* Charts Grid - giữ nguyên toàn bộ phần biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ doanh thu */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Biểu đồ doanh thu
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ số lượng đơn dịch vụ */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Biểu đồ số lượng đơn dịch vụ
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serviceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ số lượng đơn sản phẩm */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Biểu đồ số lượng đơn sản phẩm
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="value" fill="#eab308" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
