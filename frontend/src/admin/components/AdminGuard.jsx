import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';

const AdminGuard = ({ children }) => {
  const { isAdminAuthenticated } = useAdminStore();
  const location = useLocation();

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminGuard;
