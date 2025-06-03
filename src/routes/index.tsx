import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/Home/HomePage";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import DashboardPage from "@/pages/Dashboard/DashboardPage";
import PomodoroPage from "@/pages/Dashboard/TimeManagement";
import EmployeeManagement from "@/pages/Dashboard/employeeManagement";
import AppLayout from "@/layout/AppLayout";
import TaskManager from "@/pages/Dashboard/TaskManager";
import TaskReport from "@/pages/Dashboard/taskReport";
import ServicePackage from "@/pages/Dashboard/ServicePackage";
import WalletPage from "@/pages/Dashboard/Wallet";




function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/time-management" element={<PomodoroPage />} />
        <Route
          path="/employee-management"
          element={
            <AppLayout>
              <EmployeeManagement />
            </AppLayout>
          }
        />
        <Route 
          path="/task-manager" 
          element={
            <AppLayout>
              <TaskManager />
            </AppLayout>
          } 
        />
        
        <Route 
          path="/task-report" 
          element={
            <AppLayout>
              <TaskReport />
            </AppLayout>
          } 
        />
        <Route 
          path="/service-package" 
          element={
            <AppLayout>
              <ServicePackage />
            </AppLayout>
          } 
         />

         <Route 
          path="/wallet" 
          element={
            <AppLayout>
              <WalletPage />
            </AppLayout>
          } 
         />



      </Routes>
    </Router>
  );
}

export default AppRoutes;