// components/header/UserDropdown.tsx
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import type { RootState } from "@/store/store";

const UserDropdown: React.FC = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Nếu chưa đăng nhập, hiển thị nút Login/Register
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="px-4 py-2 text-white border border-white/50 rounded-md hover:bg-white/10 transition-colors duration-200 text-sm font-medium"
        >
          Đăng nhập
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 bg-white text-[#2A9D8F] rounded-md hover:bg-gray-100 transition-colors duration-200 text-sm font-medium"
        >
          Đăng ký
        </Link>
      </div>
    );
  }

  // Nếu đã đăng nhập, hiển thị thông tin user
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // ✅ Get current avatar URL
  const getCurrentAvatarUrl = () => {
    if (user?.img_url) {
      return user.img_url;
    }
    return null;
  };

  // ✅ Get fallback letter
  const getFallbackLetter = () => {
    return user.name?.charAt(0) || user.username?.charAt(0) || "U";
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200">
        {/* ✅ Avatar với image hoặc text fallback */}
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
          {getCurrentAvatarUrl() ? (
            <>
              {/* Avatar image */}
              <img
                src={getCurrentAvatarUrl()!}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // ✅ Fallback to text avatar if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  // Show fallback text
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-white font-medium text-sm">${getFallbackLetter()}</span>`;
                  }
                }}
              />
            </>
          ) : (
            /* Text avatar fallback */
            <span className="text-white font-medium text-sm">
              {getFallbackLetter()}
            </span>
          )}
        </div>

        <div className="text-left hidden lg:block">
          <span className="block font-medium text-white text-sm">
            {user.name || user.username}
          </span>
          <span className="block text-white/70 text-xs">{user.email}</span>
        </div>
        <svg
          className="w-4 h-4 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <Link
          to="/app/profile"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Thông tin cá nhân
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;
