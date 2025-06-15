// src/components/layout/NavHome.tsx   ⬅️ hoặc đúng đường dẫn NavHome của bạn
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import UserDropdown from "@/components/layout/UserDropdown";   // Avatar khi đã đăng nhập

export default function NavHome() {
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);      // [1]

  return (
    <header className="w-full shadow-sm bg-white">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-[#2A9D8F]">
          CareNest
        </Link>

        {/* Khu vực avatar / nút đăng nhập – đăng ký */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <UserDropdown />                                              // Avatar + menu
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded font-medium text-white bg-[#2A9D8F] hover:bg-[#238276] transition"
              >
                Đăng nhập
              </Link>
              <Link
                to="/registertype"
                className="px-4 py-2 rounded font-medium border border-[#2A9D8F] text-[#2A9D8F] hover:bg-[#2A9D8F] hover:text-white transition"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
