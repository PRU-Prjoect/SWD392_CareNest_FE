// layout/AppLayoutForGuest.tsx
import { Outlet } from "react-router-dom";
import AppHeaderForUser from "./AppHeaderForUser"; // Sử dụng chung header
import Footer from "../components/layout/Footer";

const AppLayoutForGuest: React.FC = () => {
  return (
    <div className="min-h-screen">
      <AppHeaderForUser />
      <main className="w-full p-2 sm:p-3 md:p-4 lg:p-6 pt-24 sm:pt-28 md:pt-32">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayoutForGuest;
