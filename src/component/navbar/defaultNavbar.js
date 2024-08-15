import React from 'react';
import { Link } from 'react-router-dom';

const DefaultNavbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link to="/" className="text-white text-lg font-semibold">
            Home
          </Link>
        </div>
        <div className="flex space-x-4">
          <Link to="/login" className="text-white">
            Login
          </Link>
          <Link to="/register" className="text-white">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default DefaultNavbar;
