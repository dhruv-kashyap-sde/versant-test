import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const { isVerified } = useAuth();

  if (!isVerified) {
    toast.error("Unauthorized Access");
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;