import React from "react";
import AppLayout from "@/layout/AppLayout";
import MainDashboard from "@/pages/Dashboard/component/MainDashboard";
import DashboardContent from "@/pages/Dashboard/component/DaskboardContent";

const DashboardPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
        <MainDashboard />
        <DashboardContent />
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
