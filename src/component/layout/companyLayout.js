import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import SideNavbar from '../navbar/sideNavbar/sideNavbar';
import JobFooter from '../footer/JobFooter'

const CompanyLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Side Navbar */}
      <nav className="w-64 bg-customBlue text-white fixed top-0 left-0 h-full">
        <div className="p-4">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <SideNavbar/>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Navbar */}
        <header className=" fixed top-0 left-64 right-0 h-16 px-6 bg-white border-b-2">
          <Navbar />
        </header>

        {/* Content Area */}
        <main className="mt-14">
        
            {children ? children : <Outlet />}
         
        </main>
        <JobFooter/>
      </div>
    
    </div>
  );
};

export default CompanyLayout;



