import React, { useState, useEffect, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import getServices from '../services/getServices';
import messagesService from '../services/messagesService';
import noticesService from '../services/noticesService';
import { toast } from 'react-toastify';
import { AuthContext } from '../AuthContext';

const Navbar = () => {
  const [activeType, setActiveType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [hasMessages, setHasMessages] = useState(false);
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize logged-in user
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    setLoggedInUser(user);
    console.log('logged in : ', user);
  }, []);

  const { data: services, error, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: getServices.getAll,
    enabled: !!loggedInUser,
  });

  const { data: messages, error: messagesError, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: messagesService.getAll,
    enabled: !!loggedInUser,
  });

  const { data: notices, error: noticesError, isLoading: noticesLoading } = useQuery({
    queryKey: ['notices'],
    queryFn: noticesService.getAll,
    enabled: !!loggedInUser,
  });

  if (isLoading) return <div className='min-h-screen'> <div className="skeleton h-4 w-full"></div>
  <div className="skeleton h-4 w-full"></div></div>;
  if (error) return <div>Error fetching services: {error.message}</div>;

  // Extract unique service types and their subtypes
  const serviceTypes = {};
  services?.forEach(service => {
    if (!serviceTypes[service.Type]) {
      serviceTypes[service.Type] = new Set();
    }
    if (service.Subtype) {
      serviceTypes[service.Type].add(service.Subtype);
    }
  });

  useEffect(() => {
    if (messages && loggedInUser) {
      const userMessages = messages.filter(message =>
        message.targetUser && message.targetUser.id.includes(loggedInUser.id)
      );
      setHasMessages(userMessages.length > 0);
    }
  }, [messages, loggedInUser]);

  useEffect(() => {
    if (notices && loggedInUser) {
      const hasGlobalOrUserNotices = notices.some(notice =>
        notice.isGlobal || (notice.targetUser && notice.targetUser.id.includes(loggedInUser.id))
      );
      setHasNotifications(hasGlobalOrUserNotices);
    }
    console.log('not :', notices);
  }, [notices, loggedInUser]);

  const handleTypeClick = (type) => {
    setActiveType(type === activeType ? null : type);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query) {
      setFilteredServices([]);
      return;
    }

    const searchLower = query.toLowerCase();
    const results = services.filter(service =>
      service.Name.toLowerCase().includes(searchLower) ||
      (service.Subtype && service.Subtype.toLowerCase().includes(searchLower))
    );
    console.log('Filtered Services:', results);
    setFilteredServices(results);
  };

  const handleButtonClick = () => {
    if (hasMessages) {
      navigate('/user-messages');
    } else if (hasNotifications) {
      notices.forEach(notice => {
        toast.info(notice.content);
      });
      setHasNotifications(false);
    }
  };

  const handleLogout = () => {
    toast.info('Logged out');
    logout();
    setLoggedInUser(null);
  };

  return (
    <div className="navbar bg-base-100 relative">
      <div className="">
        {loggedInUser && (<div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
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
  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
>
  {Object.keys(serviceTypes).map((type, index) => (
    <li
      key={index}
      className="relative group"
    >
      <button
        type="button"
        className="w-full text-left px-4 py-2 hover:bg-gray-200"
        onClick={() => handleTypeClick(type)}
      >
        {type}
      </button>
      {activeType === type && (
        <ul className="absolute left-0 top-full mt-2 bg-base-100 rounded-box w-52 p-2 shadow z-10">
          {Array.from(serviceTypes[type]).map((subtype, subIndex) => (
            <li key={subIndex}>
              <Link
                to={`/services/${subtype}`}
                className="flex items-center px-4 py-2 hover:bg-gray-200 rounded"
              >
                <span className="bullet mr-2">&#8226;</span>
                {subtype}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  ))}
</ul>

        </div>)}
        <div className="flex-1 flex hidden md:block">
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
      </div>
      {loggedInUser && (<div className="relative flex-1 mt-2 sm:mt-0 flex justify-center items-center ">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-30 md:w-auto"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          
        </div>
        {searchQuery && (
          <ul className="absolute bg-base-100 w-full mt-2 border rounded-lg shadow-lg z-10 top-full left-0">
            {filteredServices.length > 0 ? (
              filteredServices.map((service, index) => (
                <li key={index} className="p-2 hover:bg-gray-200">
                  <Link
                    to={service.id ? `/service/${service.id}` : `/services/${service.id}`}
                    className="flex items-center"
                  >
                    <span className="bullet mr-2">&#8226;</span>
                    {service.Name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="p-2">No results found</li>
            )}
          </ul>
        )}
      </div>)}
      <div className="hidden md:block">
        {(hasNotifications || hasMessages) && (<button className="md:block btn btn-ghost btn-circle hidden" onClick={handleButtonClick}>
          <div className="indicator">
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {hasMessages && (
        <span className="badge badge-xs badge-primary indicator-item"></span>
      )}
          </div>
        </button>)}
        {loggedInUser && (<div className="dropdown dropdown-end hidden md:flex">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {/* <span className="badge badge-sm indicator-item">7</span> */}
            </div>
          </div>
          <div
            tabIndex={0}
            className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
          >
            <div className="card-body">
              {/* <span className="text-lg font-bold">8 Items</span>
              <span className="text-info">Subtotal: $999</span> */}
              <Link to="/user-orders">
              <div className="card-actions">
                <button className="btn btn-primary btn-block">Orders</button>
              </div>
              </Link >
            </div>
          </div>
        </div>)}
        
      </div>
      <div className=''>
      {loggedInUser ? (<div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w- rounded-full">
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

            </div>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link  to="/user-details">Profile</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>) : (
        <div className="flex gap-2">
          {location.pathname !== '/login' && (
          <Link to="/login" className="btn btn-primary">Login</Link>)}
          {location.pathname !== '/register' && (
          <Link to="/register" className="btn btn-secondary">Register</Link>)}
        </div>
      )}
      </div>
    </div>
  );
};

export default Navbar;
