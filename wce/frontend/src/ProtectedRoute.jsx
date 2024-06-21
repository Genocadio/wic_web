import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ element }) => {
  const { loggedInUser } = useContext(AuthContext);
  return loggedInUser ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
