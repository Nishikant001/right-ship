import React from 'react';
import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import DefaultNavbar from './defaultNavbar';
import CompanyNavbar from './companyNavbar';
import EmployeeNavbar from './employeeNavbar';


const Navbar = ({}) => {

    const user = useSelector(state => state.auth.user);
    const userBoolean = !!user;

    const renderNavbar = () => {
        if (!userBoolean) {
          return <DefaultNavbar />;
        }
    
        if (user.role === 'company') {
          return <CompanyNavbar />;
        }
    
        if (user.role === 'employee') {
          return <EmployeeNavbar />;
        }
    
        return <DefaultNavbar />;
      };

    return (
        renderNavbar()
    )
};
export default Navbar;
