import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import getServices from '../services/getServices';
import messagesService from '../services/messagesService';
import noticesService from '../services/noticesService';
import { AuthContext } from '../AuthContext';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { intializeServices } from '../redux/servicesSlice';
const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notificationsExist, setNotificationsExist] = useState(false);
  const [messagesExist, setMessagesExist] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [activeServiceType, setActiveServiceType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  // const [services, setServices] = useState([]);
  const [searchResultsVisible, setSearchResultsVisible] = useState(false);
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')); // Parse the string to an object
  const toastShownRef = useRef(false);
  const { refreshAccessToken } = useContext(AuthContext);

  const dispatch = useDispatch();
  const services = useSelector((state) => state.services);
  const servicesStatus = useSelector((state) => state.servicesStatus);

  useEffect(() => {
    refreshAccessToken()
    if (services.length === 0) {
      console.log('Fetching services...');
      dispatch(intializeServices());
    }
    // getServices
    //   .getAll()
    //   .then(response => {
    //     setServices(response);
    //   })
    //   .catch(error => console.log(error));

    
    noticesService
      .getAll()
      .then(notices => {
        const hasGlobalOrUserNotices = notices.some(notice =>
          notice.isGlobal || (notice.targetUser && notice.targetUser.id.includes(loggedInUser.id))
        );
        setNotificationsExist(hasGlobalOrUserNotices);
        setNotifications(notices); // Store notices to display in toast
      })
      .catch(error => console.log(error));

      messagesService
      .getAll()
      .then(messages => {
        const unreadMessages = messages.filter(message => message.status !== 'read');
        const hasUnreadMessages = unreadMessages.length > 0;
        setMessagesExist(hasUnreadMessages);

        // Show toast only if there are unread messages and it has not been shown yet
        if (!toastShownRef.current && hasUnreadMessages && isLoggedIn) {
          toast.info('You have new messages!');
          toastShownRef.current = true;
        }
      })
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!loggedInUser);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchResultsVisible && searchQuery && event.target.closest('.search-container') === null) {
        setSearchResultsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchResultsVisible, searchQuery]);

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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setSearchResultsVisible(true);
  };

  const filteredServices = services.filter(service =>
    service.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNotificationsClick = async () => {
    if (notificationsExist) {
      console.log(notifications);
      for (const notice of notifications) {
        console.log('Notification: ' + notice.content);
        if (notice.isGlobal || (notice.targetUser && notice.targetUser.id.includes(loggedInUser.id))) {
          await new Promise((resolve) => {
            toast.info(notice.content,)
          });
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Ensures a 5-second wait before the next toast
        }
      }
    }
  };
  

  const handleMessagesClick = () => {
    if (messagesExist) {
      navigate('/user-messages'); // Use navigate instead of history.push
    }
  };
  const handleServiceTypeClick = (serviceType) => {
    setActiveServiceType(activeServiceType === serviceType ? null : serviceType);
  };
  const getSubtypesForType = (serviceType) => {
    return services
      .filter(service => service.Type === serviceType)
      .map(service => (
        <li key={service.id}>
          {isLoggedIn && (<Link to={`/services/${service.Subtype}`}>{service.Name}</Link>)}
        </li>
      ));
  };


  return (
    <nav className="flex items-center justify-between bg-background px-4 sm:px-6 h-16">
            {(<div className="dropdown">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle"
          
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </div>
        <ul
          tabIndex={0}
          className={`menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow ${isDropdownOpen ? 'block' : 'hidden'}`}
          ref={dropdownRef}
        >
          {Array.from(new Set(services.map(service => service.Type))).map(serviceType => (
            <React.Fragment key={serviceType}>
              <li>
                <button
                  onClick={() => handleServiceTypeClick(serviceType)}
                  className="flex items-center justify-between w-full"
                >
                  {serviceType}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transform ${activeServiceType === serviceType ? 'rotate-180' : 'rotate-0'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {activeServiceType === serviceType && (
                  <ul className="pl-4">
                    {getSubtypesForType(serviceType)}
                  </ul>
                )}
              </li>
            </React.Fragment>
          ))}
        </ul>
      </div>)}
      <div className="flex items-center gap-2">
      <div className="flex-1 flex">
          <Link className="text-xl" to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </Link>
        </div>
        {isLoggedIn && (
          <Link to="/user-orders">
            <button
              className="hidden sm:inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Orders
            </button>
          </Link>
        )}
      </div>
      {isLoggedIn && (
        <div className="relative flex-1 max-w-md w-full sm:w-auto mt-2 sm:mt-0">
          <div className="search-container relative">
            <input
              className="flex h-10 border border-input px-3 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md bg-muted pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              type="search"
              placeholder="Search services..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchResultsVisible && searchQuery && (
              <div className="absolute mt-1 w-med-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {filteredServices.length > 0 ? (
                  <ul>
                    {filteredServices.map(service => (
                      <li key={service._id} className="px-4 py-2">
                        <Link
                          to={`/services/${service._id}`}
                          className="text-sm text-gray-600 hover:text-gray-800"
                          onClick={() => setSearchResultsVisible(false)}
                        >
                          {service.Name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-600">
                    No services found matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        {notificationsExist && isLoggedIn && (
          <button
            onClick={handleNotificationsClick}
            className="hidden sm:inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
          </button>
        )}
        {messagesExist && isLoggedIn && (
          <button
            onClick={handleMessagesClick}
            className="hidden sm:inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
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
          
          <div className="relative">
            <button
              className="hidden sm:inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              onClick={handleDropdownToggle}
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
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20"
              >
                <Link
                  to="/user-details"
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Account
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
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
        {isLoggedIn && (<button
          className="sm:hidden p-2"
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
        </button>)}
      </div>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-40">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 p-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-lg font-bold">
                Home
              </Link>
              <button
                className="p-2"
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
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            {isLoggedIn && (
              <Link to="/user-orders" className="block mt-4 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-md px-4 py-2">
                Orders
              </Link>
            )}
            {notificationsExist && isLoggedIn && (
              <button
                onClick={handleNotificationsClick}
                className="block mt-4 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-md px-4 py-2"
              >
                Notifications
              </button>
            )}
            {messagesExist && isLoggedIn &&  (
              <button
                onClick={handleMessagesClick}
                className="block mt-4 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-md px-4 py-2"
              >
                Messages
              </button>
            )}
            {isLoggedIn ? (
              <>
                <Link
                  to="/user-details"
                  className="block mt-4 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-md px-4 py-2"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Account
                </Link>
                <button
                  className="block w-full text-left mt-4 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-md px-4 py-2"
                  onClick={() => {
                    handleLogout();
                    setIsSidebarOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block mt-4 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-md px-4 py-2"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
