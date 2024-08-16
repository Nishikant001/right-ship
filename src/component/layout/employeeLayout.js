import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import EmployeeNavbar from '../navbar/employeeNavbar';

const EmployeeLayout = ({ children }) => {
  return (
    <div>
      <header>
      <EmployeeNavbar/>
      </header>
      <main>
      { children ? children :<Outlet /> }
      </main>
      <footer>
        <p>Employee Footer</p>
      </footer>
    </div>
  );
};

export default EmployeeLayout;
