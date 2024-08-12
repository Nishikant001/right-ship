import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CircleUserRound, CircleHelp, ChevronDown, Bell, MessageSquare } from 'lucide-react';
import Logo from '../../images/logo.png';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header3 = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleUserDropdownClick = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleNotificationDropdownClick = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
  };

  const toggleOffCanvas = () => {
    setIsOffCanvasOpen(!isOffCanvasOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setNotificationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleLogout = () => {
    // Clear all data from local storage
    localStorage.clear();
    
    // Redirect to login page
    // history.push('/login');
    
    // Optional: prevent user from navigating back to previous pages
    window.location.reload(); // Reload the page to clear history state
  };

  return (
    <>
      <header className={`bg-white border-b py-4 px-8 border-gray-200 sticky top-0 z-30 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <ToastContainer />
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="Logo" height={40} width={40} />
              <span className="font-bold text-gray-800 ml-4">RIGHTSHIP</span>
            </Link>
            <div className={`hidden lg:flex items-center space-x-6 ml-8 ${isOffCanvasOpen ? 'hidden' : ''}`}>
              <Link to="/jobdashboard" className="text-black font-bold hover:text-customBlue">Jobs</Link>
              <Link to="/companies" className="text-black font-bold hover:text-customBlue">Companies</Link>
            </div>
          </div>
          <div className={`hidden lg:flex items-center space-x-6 ${isOffCanvasOpen ? 'hidden' : ''}`}>
            <a href="#help-support" className="text-black flex items-center font-bold">
              <CircleHelp size={20} className="mr-2" /> Help & Support
            </a>
            <div className="relative" ref={notificationDropdownRef}>
              <button onClick={handleNotificationDropdownClick} className="flex items-center text-black font-bold">
                <Bell size={20} className="mr-2" /> Notification <ChevronDown className="ml-2" />
              </button>
              {notificationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                  <Link to="/notifications" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 font-semibold">View All Notifications</Link>
                  <Link to="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 font-semibold">Notification Settings</Link>
                </div>
              )}
            </div>
            <div className="relative" ref={userDropdownRef}>
              <button onClick={handleUserDropdownClick} className="flex items-center text-black font-bold">
                <CircleUserRound size={20} className="mr-2" /> User <ChevronDown className="ml-2" />
              </button>
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                  <Link to="/profile" className="px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center font-semibold">
                    <MessageSquare size={20} className="mr-2" /> Profile
                  </Link>
                  <Link to="/myjobs" className="px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center font-semibold">
                    <MessageSquare size={20} className="mr-2" /> My Jobs
                  </Link>
                  <Link to="/settings" className="px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center font-semibold">
                    <MessageSquare size={20} className="mr-2" /> Settings
                  </Link>
                  <Link to="/" className="px-4 py-2 mt-1 text-gray-800 hover:bg-gray-100 flex justify-center border-t font-bold">Sign Out</Link>
                </div>
              )}
            </div>
          </div>
          <button onClick={toggleOffCanvas} className="lg:hidden text-black focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-16 6h16" />
            </svg>
          </button>
        </nav>
      </header>

      {/* Off-Canvas Sidebar */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg border-l border-gray-200 transform ${
          isOffCanvasOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="p-4 flex flex-col space-y-4">
          <button onClick={toggleOffCanvas} className="text-black self-end absolute top-7 right-5">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <Link to="/" className="flex items-center space-x-2 font-bold">
            <span className="text-gray-800">RIGHTSHIP</span>
          </Link>
          <Link to="/jobdashboard" className="text-black font-bold hover:text-customBlue">Jobs</Link>
          <Link to="/companies" className="text-black font-bold hover:text-customBlue">Companies</Link>
          <a href="#help-support" className="text-black flex items-center font-bold">
            <CircleHelp size={20} className="mr-2" /> Help & Support
          </a>
          <div className="relative">
            <button onClick={handleNotificationDropdownClick} className="flex items-center text-black font-bold">
              <Bell size={20} className="mr-2" /> Notification <ChevronDown className="ml-2" />
            </button>
            {notificationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                <Link to="/notifications" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 font-semibold">View All Notifications</Link>
                <Link to="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 font-semibold">Notification Settings</Link>
              </div>
            )}
          </div>
          <div className="relative">
            <button onClick={handleUserDropdownClick} className="flex items-center text-black font-bold">
              <CircleUserRound size={20} className="mr-2" /> User <ChevronDown className="ml-2" />
            </button>
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                <Link to="/profile" className="px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center font-semibold">
                  <MessageSquare size={20} className="mr-2" /> Profile
                </Link>
                <Link to="/myjobs" className="px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center font-semibold">
                  <MessageSquare size={20} className="mr-2" /> My Jobs
                </Link>
                <Link to="/settings" className="px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center font-semibold">
                  <MessageSquare size={20} className="mr-2" /> Settings
                </Link>
                <Link to="/" onClick={handleLogout} className="px-4 py-2 mt-1 text-gray-800 hover:bg-gray-100 flex justify-center border-t font-bold">Sign Out</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay to close off-canvas when clicking outside */}
      {isOffCanvasOpen && (
        <div
          onClick={toggleOffCanvas}
          className="fixed inset-0 bg-black opacity-50 z-20"
        ></div>
      )}
    </>
  );
};

export default Header3;
