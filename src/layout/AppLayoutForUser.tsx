// layout/AppLayoutForUser.tsx
import type { ReactNode } from "react";
import AppHeaderForUser from "./AppHeaderForUser";
import Footer from "../components/layout/Footer";

interface AppLayoutForUserProps {
  children: ReactNode;
}

const AppLayoutForUser: React.FC<AppLayoutForUserProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      {/* Header cho user - không có sidebar */}
      <AppHeaderForUser />

      {/* Main content - full width */}
      <main className="w-full p-4 md:p-6">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AppLayoutForUser;
