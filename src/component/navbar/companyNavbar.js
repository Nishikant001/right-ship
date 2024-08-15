import React from 'react';
import { Link } from 'react-router-dom';

const CompanyNavbar = () => {
  return (
    <nav className="bg-blue-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link to="/" className="text-white text-lg font-semibold">
            Company Home
          </Link>
        </div>
        <div className="flex space-x-4">
          <Link to="/dashboard" className="text-white">
            Dashboard
          </Link>
          <Link to="/manage-employees" className="text-white">
            Manage Employees
          </Link>
          <Link to="/logout" className="text-white">
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default CompanyNavbar;
