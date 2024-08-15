import React from 'react';
import { Link } from 'react-router-dom';

const EmployeeNavbar = () => {
  return (
    <nav className="bg-green-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link to="/" className="text-white text-lg font-semibold">
            Employee Home
          </Link>
        </div>
        <div className="flex space-x-4">
          <Link to="/profile" className="text-white">
            Profile
          </Link>
          <Link to="/tasks" className="text-white">
            Tasks
          </Link>
          <Link to="/logout" className="text-white">
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default EmployeeNavbar;
