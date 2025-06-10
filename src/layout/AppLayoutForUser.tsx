// layout/AppLayoutForUser.tsx
import { Outlet } from "react-router-dom";
import AppHeaderForUser from "./AppHeaderForUser";
import Footer from "../components/layout/Footer";

const AppLayoutForUser: React.FC = () => {
  return (
    <div className="min-h-screen">
      <AppHeaderForUser />
      <main className="w-full p-4 md:p-6">
        <Outlet /> {/* Thay thế children bằng Outlet */}
      </main>
      <Footer />
    </div>
  );
};

export default AppLayoutForUser;
