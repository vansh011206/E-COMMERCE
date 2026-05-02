import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Simulate checking auth state from Firebase
    const timer = setTimeout(() => {
      setChecking(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (checking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E8E8E8] border-t-[#0A0A0A] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
};

export default AuthGuard;
