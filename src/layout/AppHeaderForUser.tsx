// layout/AppHeaderForUser.tsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "@/store/store";
import { getAllServices } from "@/store/slices/serviceSlice"; // ✅ Import action
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";
import SearchBar from "../components/common/SearchBar";
import { Link } from "react-router-dom";
import type { SearchField } from "../components/common/SearchBar";

interface HeaderProps {
  onClick?: () => void;
  onToggle?: () => void;
}

const AppHeaderForUser: React.FC<HeaderProps> = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ State cho search term
  const dispatch = useDispatch<AppDispatch>(); // ✅ Redux dispatch
  const navigate = useNavigate(); // ✅ Navigation

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  // ✅ Handle search submit
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchTerm.trim()) return;

    try {
      // Dispatch search action với parameters
      await dispatch(
        getAllServices({
          name: searchTerm,
          sortBy: "createdAt",
        })
      );

      // Navigate to services page
      navigate("/app/services", {
        state: { searchTerm: searchTerm.trim() },
      });
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // ✅ Handle filter search (từ SearchBar component)
  const handleSearch = async (values: Record<string, string>) => {
    console.log("Filter values:", values);

    try {
      // Tạo search parameters từ filter
      const searchParams: any = {};

      if (values.sortBy) {
        switch (values.sortBy) {
          case "price_asc":
            searchParams.sortBy = "price";
            break;
          case "price_desc":
            searchParams.sortBy = "price_desc";
            break;
          case "rating":
            searchParams.sortBy = "star";
            break;
          case "newest":
            searchParams.sortBy = "createdAt";
            break;
          default:
            searchParams.sortBy = "createdAt";
        }
      }

      // Thêm service type mapping nếu cần
      if (values.petType) {
        // Map pet type to service_type_id nếu có mapping
        searchParams.serviceTypeId = "f11909c0-89c2-4c5a-8fd9-21511a619e2c";
      }

      // Dispatch search với filters
      await dispatch(getAllServices(searchParams));

      // Navigate to services page với filter state
      navigate("/app/services", {
        state: {
          filters: values,
          searchType: "filter",
        },
      });
    } catch (error) {
      console.error("Filter search error:", error);
    }
  };

  // Định nghĩa các trường filter
  const filterFields: SearchField[] = [
    {
      name: "location",
      label: "Địa điểm",
      placeholder: "Chọn địa điểm",
      type: "select",
      width: "w-1/4",
      options: [
        { value: "hanoi", label: "Hà Nội" },
        { value: "hcm", label: "TP. Hồ Chí Minh" },
        { value: "danang", label: "Đà Nẵng" },
        { value: "haiphong", label: "Hải Phòng" },
      ],
    },
    {
      name: "petType",
      label: "Loại thú",
      placeholder: "Chọn loại thú cưng",
      type: "select",
      width: "w-1/4",
      options: [
        { value: "dog", label: "🐕 Chó" },
        { value: "cat", label: "🐱 Mèo" },
        { value: "bird", label: "🐦 Chim" },
        { value: "fish", label: "🐠 Cá" },
        { value: "rabbit", label: "🐰 Thỏ" },
      ],
    },
    {
      name: "sortBy",
      label: "Sắp xếp",
      placeholder: "Sắp xếp theo",
      type: "select",
      width: "w-1/4",
      options: [
        { value: "price_asc", label: "Giá tăng dần" },
        { value: "price_desc", label: "Giá giảm dần" },
        { value: "rating", label: "Đánh giá cao nhất" },
        { value: "distance", label: "Khoảng cách gần nhất" },
        { value: "newest", label: "Mới nhất" },
      ],
    },
    {
      name: "priceRange",
      label: "Khoảng giá",
      placeholder: "Chọn khoảng giá",
      type: "select",
      width: "w-1/4",
      options: [
        { value: "0-100", label: "Dưới 100k" },
        { value: "100-300", label: "100k - 300k" },
        { value: "300-500", label: "300k - 500k" },
        { value: "500-1000", label: "500k - 1tr" },
        { value: "1000+", label: "Trên 1tr" },
      ],
    },
  ];

  return (
    <>
      {/* Header chính */}
      <header
        className="sticky top-0 flex w-full backdrop-blur-md z-50 transition-all duration-300"
        style={{ backgroundColor: "#2A9D8F" }}
      >
        <div className="w-full max-w-8xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo và tên ứng dụng - Bên trái */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Link to="/" className="flex items-center space-x-3">
                <img
                  src="/public/image/ranbowlogo.png"
                  alt="Logo"
                  className="w-10 h-10 lg:w-25 lg:h-20 transition-all duration-300"
                />
                <span className="font-semibold text-xl lg:text-2xl select-none hidden sm:block text-white">
                  <span className="text-orange-300 text-5xl">Care</span>
                  <span className="text-white text-5xl">Nest</span>
                </span>
              </Link>
            </div>

            {/* ✅ Search bar cập nhật - Ở giữa, chỉ hiện trên desktop */}
            <div className="hidden lg:flex flex-1 justify-center max-w-2xl mx-8">
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm tên dịch vụ"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 w-full rounded-lg border-0 bg-white py-3 pl-4 pr-24 text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button
                    type="submit"
                    disabled={!searchTerm.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#2A9D8F] hover:bg-[#238276] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                  >
                    Tìm kiếm
                  </button>
                </div>
              </form>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleApplicationMenu}
              className="flex items-center justify-center w-10 h-10 text-white rounded-lg hover:bg-white/10 lg:hidden"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                  fill="currentColor"
                />
              </svg>
            </button>

            {/* Notifications, User menu và Giỏ hàng */}
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
              <NotificationDropdown />
              <UserDropdown />
              <Link
                to="/cart"
                className="relative flex items-center justify-center w-11 h-11 text-white rounded-full hover:bg-white/10 transition-colors duration-200"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-medium">
                  3
                </span>
              </Link>
            </div>
          </div>

          {/* ✅ Mobile search và menu cập nhật */}
          {isApplicationMenuOpen && (
            <div className="lg:hidden pb-4">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm tên dịch vụ"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-11 w-full rounded-lg border-0 bg-white py-3 pl-4 pr-20 text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button
                    type="submit"
                    disabled={!searchTerm.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#2A9D8F] hover:bg-[#238276] text-white px-3 py-1.5 rounded text-sm font-medium disabled:opacity-50"
                  >
                    Tìm kiếm
                  </button>
                </div>
              </form>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                <NotificationDropdown />
                <UserDropdown />
                <Link
                  to="/cart"
                  className="relative flex items-center justify-center w-10 h-10 text-white rounded-full hover:bg-white/10"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[9px] font-medium">
                    3
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Thanh Filter */}
      <div className="bg-[#2A9D8F] border-t border-white/10">
        <div className="w-full max-w-8xl mx-auto px-6 lg:px-8 p-2">
          <SearchBar
            fields={filterFields}
            onSearch={handleSearch} // ✅ Sử dụng function đã cập nhật
            buttonLabel="Lọc kết quả"
          />
        </div>
      </div>
    </>
  );
};

export default AppHeaderForUser;
