import React, { createContext, useState, useEffect, useRef } from 'react';
import Tokenservice from './services/Tokenservice'; // Adjust path as per your project structure

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimeoutRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user) {
      setLoggedInUser(user);
    }
    setIsLoading(false); // Update loading state once user check is done

    return () => {
      clearTimeout(refreshTimeoutRef.current); // Cleanup on component unmount
    };
  }, []);

  const login = (user) => {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    const loginTime = new Date().getTime(); // Store current time as login time
    localStorage.setItem('loginTime', loginTime.toString());
    setLoggedInUser(user);
  };

  const logout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loginTime'); // Remove loginTime on logout
    setLoggedInUser(null);
    clearTimeout(refreshTimeoutRef.current); // Clear timeout on logout
  };

  const refreshAccessToken = async () => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current); // Clear any existing timeout
    }

    refreshTimeoutRef.current = setTimeout(async () => {
      try {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!user) return; // No user logged in, skip token refresh

        const accessToken = user.token;

        const challengeToken = await Tokenservice.getChall(accessToken);

        const newAccessToken = await Tokenservice.getRef(accessToken, challengeToken);

        user.token = newAccessToken;
        localStorage.setItem('loggedInUser', JSON.stringify(user));

        const loginTime = new Date().getTime(); // Update login time
        localStorage.setItem('loginTime', loginTime.toString());
        console.log('refresh time: ' + loginTime.toString());

        console.log('Access token refreshed successfully:', newAccessToken);
      } catch (error) {
        console.error('Error refreshing access token:', error);
      }
    }, 40 * 60 * 1000); // 40 minutes in milliseconds
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ loggedInUser, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
