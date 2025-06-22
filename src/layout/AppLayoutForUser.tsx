// layout/AppLayoutForUser.tsx
import { Outlet } from "react-router-dom";
import AppHeaderForUser from "./AppHeaderForUser";
import Footer from "../components/layout/Footer";
import type { ReactNode } from "react";

// ✅ Định nghĩa interface cho props
interface AppLayoutProps {
  children?: ReactNode;
}

const AppLayoutForUser: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <AppHeaderForUser />
      <main className="w-full p-4 md:p-6">{children || <Outlet />} </main>
      <Footer />
    </div>
  );
};

export default AppLayoutForUser;
