import React from "react";
// import AppLayout from "@/layout/AppLayout";
import MainDashboard from "@/pages/Dashboard/component/MainDashboard";
import DashboardContent from "@/pages/Dashboard/component/DaskboardContent";
import AppLayoutForUser from "@/layout/AppLayoutForUser";

const DashboardPage: React.FC = () => {
  return (
    <AppLayoutForUser>
      <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
        <MainDashboard />
        <DashboardContent />
      </div>
    </AppLayoutForUser>
  );
};

export default DashboardPage;
