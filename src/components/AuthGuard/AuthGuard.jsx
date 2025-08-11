import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const publicRoutes = ['/', '/login', '/register', '/privacy', '/terms', '/refund', '/game-rules'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  useEffect(() => {
    if (!isPublicRoute && !isAuthenticated()) {
      navigate('/login');
    }
  }, [location.pathname, isPublicRoute, navigate]);

  if (!isPublicRoute && !isAuthenticated()) {
    return null; // Or a loader
  }

  return children;
};

export default AuthGuard;