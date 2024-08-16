import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import SideNavbar from '../navbar/sideNavbar/sideNavbar';

const CompanyLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Side Navbar */}
      <nav className="w-64 bg-gray-800 text-white fixed top-0 left-0 h-full">
        <div className="p-4">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          
          <SideNavbar/>

        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Navbar */}
        <header className=" fixed top-0 left-64 right-0 h-16 flex items-center px-6">
          <Navbar />
        </header>

        {/* Content Area */}
        <main className="mt-16 p-6 bg-gray-100">
          {children ? children : <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default CompanyLayout;



