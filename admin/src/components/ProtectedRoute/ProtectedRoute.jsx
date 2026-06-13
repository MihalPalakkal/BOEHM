import React from 'react';
import { Navigate } from 'react-router-dom';
import { clearAdminSession, hasValidAdminSession } from '../../api/adminAuth';

const ProtectedRoute = ({ children }) => {
  if (!hasValidAdminSession()) {
    clearAdminSession();
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
