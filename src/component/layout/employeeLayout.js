import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../navbar/navbar';

const EmployeeLayout = ({ children }) => {
  return (
    <div>
      <header>
      <Navbar/>
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
