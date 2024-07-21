import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ element }) => {
  const { logout, loggedInUser } = useContext(AuthContext);

  useEffect(() => {
    const checkSessionValidity = () => {
      const loginTime = localStorage.getItem('loginTime');
      const sessionDuration = 60 * 60 * 1000; // 1 hour in milliseconds

      if (loginTime) {
        const currentTime = Date.now(); // Current time in milliseconds
        const lastLoginTime = parseInt(loginTime, 10); // Parse loginTime from string to integer

        console.log('Current time:', currentTime);
        console.log('Last login time:', lastLoginTime);
        console.log('Time difference:', currentTime - lastLoginTime);

        if (currentTime - lastLoginTime > sessionDuration) {
          // Session expired, log out user
          logout();
        }
      }
    };

    const interval = setInterval(checkSessionValidity, 1000); // Check every second

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [logout]); // Add logout to the dependency array

  return loggedInUser ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
