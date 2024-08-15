import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../navbar/navbar';

const CompanyLayout = ({ children }) => {
  return (
    <div>
      <header>
        <Navbar/>
      </header>
      <main>
      { children ? children :<Outlet /> }
      </main>
      <footer>
        <p>Company Footer</p>
      </footer>
    </div>
  );
};

export default CompanyLayout;
