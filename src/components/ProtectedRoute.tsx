import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProgress, TOPIC_SEQUENCE } from '../contexts/ProgressContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isUnlocked } = useProgress();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If the current path is in our sequence and is locked, redirect to hub
    const currentPath = location.pathname;
    if (TOPIC_SEQUENCE.includes(currentPath) && !isUnlocked(currentPath)) {
      navigate('/', { replace: true });
    }
  }, [location.pathname, isUnlocked, navigate]);

  return <>{children}</>;
};
