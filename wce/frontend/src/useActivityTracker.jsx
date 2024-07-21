import { useEffect } from 'react';
import { AuthContext } from './AuthContext';

const useActivityTracker = () => {
  const { refreshAccessToken } = AuthContext();

  useEffect(() => {
    const handleUserActivity = () => {
      refreshAccessToken();
    };

    // Add event listeners for user activity
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
    };
  }, [refreshAccessToken]);
};

export default useActivityTracker;
