// layout/AppLayoutForGuest.tsx
import { Outlet } from "react-router-dom";
import AppHeaderForUser from "./AppHeaderForUser"; // Sử dụng chung header
import Footer from "../components/layout/Footer";

const AppLayoutForGuest: React.FC = () => {
  return (
    <div className="min-h-screen">
      <AppHeaderForUser />
      <main className="w-full p-4 md:p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayoutForGuest;
