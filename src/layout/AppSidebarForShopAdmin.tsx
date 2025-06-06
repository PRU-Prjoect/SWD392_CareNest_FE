// layout/AppSidebarForShopAdmin.tsx
import { Link } from "react-router-dom";

interface AppSidebarProps {
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
  // ... other props
}

const AppSidebarForShopAdmin: React.FC<AppSidebarProps> = ({
  isExpanded,
  isHovered,
  isMobileOpen,
  // ... other props
}) => {
  return (
    <aside className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      {/* Logo cho shop admin trong sidebar */}
      <Link
        to="/admin"
        className={`flex items-center space-x-3 pb-2 border-b-2 border-white w-full ${
          isExpanded || isHovered || isMobileOpen ? "" : "justify-center"
        }`}
      >
        <img
          src="/public/image/ranbowlogo.png"
          alt="Logo"
          className={`transition-all duration-300 ${
            isExpanded || isHovered || isMobileOpen ? "w-20" : "w-8"
          }`}
        />
        {(isExpanded || isHovered || isMobileOpen) && (
          <span className="font-semibold text-2xl select-none">
            <span className="text-orange-500">Care</span>
            <span className="text-white">Nest</span>
          </span>
        )}
      </Link>

      {/* Menu items cho admin */}
      {/* ... */}
    </aside>
  );
};

export default AppSidebarForShopAdmin;
