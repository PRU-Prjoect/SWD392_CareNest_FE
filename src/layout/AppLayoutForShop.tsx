import React from 'react';
import { Outlet } from 'react-router-dom';
import AppSidebarForShop from './AppSideBarForShop';

const AppLayoutForShop = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <AppSidebarForShop />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayoutForShop;
