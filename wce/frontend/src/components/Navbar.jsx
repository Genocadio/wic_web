import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    setIsLoggedIn(!!loggedInUser);
  }, []);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    localStorage.removeItem('loggedInUser');
    setIsLoggedIn(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between bg-background px-4 sm:px-6 h-16">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-lg font-bold">
          Home
        </Link>
        {isLoggedIn && (
          <button
            className="hidden sm:inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Orders
          </button>
        )}
      </div>
      {isLoggedIn && (
        <div className="relative flex-1 max-w-md w-full sm:w-auto mt-2 sm:mt-0">
          <input
            className="flex h-10 border border-input px-3 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md bg-muted pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            type="search"
            placeholder="Search products..."
          />
        </div>
      )}
      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        {isLoggedIn && (
          <button
            className="hidden sm:inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <rect width="16" height="13" x="6" y="4" rx="2"></rect>
              <path d="m22 7-7.1 3.78c-.57.3-1.23.3-1.8 0L6 7"></path>
              <path d="M2 8v11c0 1.1.9 2 2 2h14"></path>
            </svg>
          </button>
        )}
        {isLoggedIn && (
          <div className="relative hidden sm:inline-flex" ref={dropdownRef}>
            <button
              onClick={handleDropdownToggle}
              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M14.31 8a4 4 0 0 0-4.62 0"></path>
                <path d="M7.69 8a4 4 0 0 1 4.62 0"></path>
                <line x1="12" y1="14" x2="12" y2="14"></line>
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <a href="#account-details" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Account Details</a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
        {!isLoggedIn && (
          <div className="flex items-center">
            {location.pathname !== '/register' && (
              <Link
                to="/register"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                Register
              </Link>
            )}
            {location.pathname !== '/login' && (
              <Link
                to="/login"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                Login
              </Link>
            )}
          </div>
        )}
        {isLoggedIn && (
          <button
            className="sm:hidden inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-full"
            onClick={handleSidebarToggle}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-20 flex flex-col items-center">
          <button
            className="absolute top-4 right-4 text-white"
            onClick={handleSidebarToggle}
          >
            Close
          </button>
          <nav className="flex flex-col items-center mt-16 space-y-4 text-white">
            <Link
              to="/"
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
              onClick={() => setIsSidebarOpen(false)}
            >
              Home
            </Link>
            {isLoggedIn && (
              <>
                <button
                  className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Orders
                </button>
                <button
                  className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Notifications
                </button>
                <button
                  className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Account
                </button>
              </>
            )}
            {!isLoggedIn && (
              <>
                {location.pathname !== '/register' && (
                  <Link
                    to="/register"
                    className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Register
                  </Link>
                )}
                {location.pathname !== '/login' && (
                  <Link
                    to="/login"
                    className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
