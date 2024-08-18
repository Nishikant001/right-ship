import React from 'react';
import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";


const CompanyNavbar = () => {
  return (
<nav className="p-4 relative">
  <div className="container mx-auto flex justify-center items-center">
    <div className="flex space-x-4 flex-row absolute top-2 right-0 items-center">
      <Link
        to="/dashboard"
        className="text-black px-3 py-2 rounded flex items-center space-x-2 transition duration-200"
      >
        <CgProfile size={20} /> {/* Increase the size as needed */}
        <span>Help & Support</span>
      </Link>
      
      <Link
        to="/logout"
        className="text-black border-l-2 px-4 py-2 flex items-center transition duration-200"
      >
        <CgProfile size={24} /> {/* Increase the size as needed */}
      </Link>
    </div>

    {/* Right top logo */}
    <Link
      to="/"
      className="absolute top-0 left-0 mt-2 mr-4 flex items-center"
    >
      <h1 className="text-2xl font-semibold">Dashboard</h1>
    </Link>
  </div>
</nav>

  
  );
};

export default CompanyNavbar;
