import React from 'react';
import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import Logo from '../../images/logo.png'

const CompanyNavbar = () => {
  return (
<nav className=" p-4">
  <div className="container mx-auto flex justify-between items-center">
    <div className="flex space-x-4 flex-row ml-auto items-center -mt-2">
    <Link to="/" className="flex ">
              <img src={Logo} alt="Logo" height={40} width={40} />
              <span className="font-bold text-gray-800 ml-4">RIGHTSHIP</span>
    </Link>
      
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
  </div>
</nav>
  
  );
};

export default CompanyNavbar;
