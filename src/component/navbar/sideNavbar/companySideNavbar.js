import React from 'react';
import { Link } from 'react-router-dom';

const CompanySidebar = () => {
  return (
    <ul className="mt-6 space-y-3">
      <li>
        <Link to="/create/job" className="flex items-center px-4 py-2 hover:bg-customBlue3 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M8 16h.01M16 16h.01M9 12h.01M15 12h.01M9 8h.01M15 8h.01M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Create Jobs
        </Link>
      </li>
      <li>
        <Link to="/post/job" className="flex items-center px-4 py-2 hover:bg-customBlue3 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 100-4m0 4a2 2 0 11-4 0M5 11a2 2 0 100-4m0 4a2 2 0 11-4 0" />
          </svg>
          Jobs
        </Link>
      </li>
      <li>
        <Link to="/job/candidates" className="flex items-center px-4 py-2 hover:bg-customBlue3 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V5a2 2 0 00-2-2H6a2 2 0 00-2 2v8m4 5v-1a1 1 0 011-1h6a1 1 0 011 1v1m-3-3a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
          Candidates
        </Link>
      </li>
      <li>
        <Link to="/manage/company/team" className="flex items-center px-4 py-2 hover:bg-customBlue3 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3M13 9l3 3-3 3" />
          </svg>
          Manage User
        </Link>
      </li>
      
      <li>
        <Link to="/settings" className="flex items-center px-4 py-2 hover:bg-customBlue3 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6h4m-2 4h.01M6 18l3-3a6 6 0 1110 0l3 3" />
          </svg>
          Settings
        </Link>
      </li>
      <li>
        <Link to="/sign-out" className="flex items-center px-4 py-2 hover:bg-customBlue3 rounded">
        <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" class="bi bi-bell h-4 w-4 mr-3" viewBox="0 0 16 16">
  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/>
</svg>
          Notification
        </Link>
      </li>
      <li>
        <Link to="/sign-out" className="flex items-center px-4 py-2 hover:bg-customBlue3 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Sign Out
        </Link>
      </li>
      
    </ul>
  );
};

export default CompanySidebar;
