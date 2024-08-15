import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../navbar/navbar';

const DefaultLayout = ({ children }) => {
  return (
    <div>
      <header>
      <Navbar/>
      </header>
      <main>
        { children ? children :<Outlet /> }
      </main>
      <footer>
        <p>Default Footer</p>
      </footer>
    </div>
  );
};

export default DefaultLayout;
