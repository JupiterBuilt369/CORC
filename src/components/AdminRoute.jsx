import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const AdminRoute = ({ children }) => {
  const { user } = useStore();

  // 1. Not logged in? -> Go to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in but NOT admin? -> Go Home
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // 3. Is Admin? -> Allowed
  return children;
};

export default AdminRoute;