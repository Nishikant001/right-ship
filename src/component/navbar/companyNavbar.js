import React from 'react';
import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";


const CompanyNavbar = () => {
  return (
<nav className="">
  <div className="container mx-auto flex justify-between items-center py-1">
    
    <div className="flex items-center">
      <Link
        to="/"
        className="mt-2 mr-4 flex items-center"
      >
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </Link>
    </div>
    
    <div className="flex items-center space-x-4 mt-1">
      <Link
        to="/dashboard"
        className="text-black px-3 py-2 rounded flex items-center space-x-2 transition duration-200"
      >
        <CgProfile size={20} /> {/* Adjust the size as needed */}
        <span>Help & Support</span>
      </Link>
      
      <Link
        to="/logout"
        className="text-black border-l-2 px-4 py-2 flex items-center transition duration-200"
      >
        <CgProfile size={24} /> {/* Adjust the size as needed */}
      </Link>
    </div>
    
  </div>
</nav>

  
  );
};

export default CompanyNavbar;
