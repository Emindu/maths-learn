import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProgress, TOPIC_SEQUENCE } from '../contexts/ProgressContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isUnlocked, devMode } = useProgress();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (devMode) return;
    const currentPath = location.pathname;
    if (TOPIC_SEQUENCE.includes(currentPath) && !isUnlocked(currentPath)) {
      navigate('/', { replace: true });
    }
  }, [location.pathname, isUnlocked, devMode, navigate]);

  return <>{children}</>;
};
