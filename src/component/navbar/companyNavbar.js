import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";


const CompanyNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
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
      
      
      <div className="flex items-center space-x-4">
          <Link
            to="/dashboard"
            className="text-black px-3 py-2 rounded flex items-center space-x-2 transition duration-200"
          >
            <CgProfile size={20} />
            <span>Help & Support</span>
          </Link>

          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="text-black border-l-2 px-4 py-2 flex items-center transition duration-200 focus:outline-none"
            >
              <CgProfile size={24} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 transition"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 transition"
                >
                  Settings
                </Link>
                <Link
                  to="/logout"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 transition"
                >
                  Sign Out
                </Link>
              </div>
            )}
          </div>
        </div>
 
    </div>
    
  </div>
</nav>

  
  );
};

export default CompanyNavbar;
