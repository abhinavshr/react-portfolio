import { useNavigate } from 'react-router-dom';
import axios from "axios"; 
import { useEffect, useCallback, useState } from 'react';

export const useAuth = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    token: null
  });

  const clearAuth = useCallback(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('tokenExpires');
    delete axios.defaults.headers.common['Authorization'];
    setAuthState({ isAuthenticated: false, user: null, token: null });
  }, []);

  const getAuthToken = useCallback(() => {
    return localStorage.getItem('adminToken');
  }, []);

  const getAuthUser = useCallback(() => {
    const email = localStorage.getItem('adminEmail');
    return email ? { email } : null;
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      const tokenExpires = localStorage.getItem('tokenExpires');
      
      if (!token || !tokenExpires) {
        setAuthState({ isAuthenticated: false, user: null, token: null });
        return false;
      }
      
      const currentTime = Date.now();
      const expiresAt = parseInt(tokenExpires, 10);
      
      const isExpired = currentTime > (expiresAt - 5 * 60 * 1000);
      
      if (isExpired) {
        clearAuth();
        return false;
      }
      
      const email = localStorage.getItem('adminEmail');
      setAuthState({ 
        isAuthenticated: true, 
        user: email ? { email } : null, 
        token 
      });
      return true;
    };
    
    checkAuth();
  }, [clearAuth]);

  const requireAuth = useCallback(() => {
    const token = localStorage.getItem('adminToken');
    const tokenExpires = localStorage.getItem('tokenExpires');
    
    if (!token || !tokenExpires) {
      navigate('/admin/login');
      return false;
    }
    
    const currentTime = Date.now();
    const expiresAt = parseInt(tokenExpires, 10);
    
    if (currentTime > expiresAt) {
      clearAuth();
      navigate('/admin/login');
      return false;
    }
    
    return true;
  }, [navigate, clearAuth]);

  const requireNoAuth = useCallback(() => {
    const token = localStorage.getItem('adminToken');
    const tokenExpires = localStorage.getItem('tokenExpires');
    
    if (!token || !tokenExpires) {
      return true;
    }
    
    const currentTime = Date.now();
    const expiresAt = parseInt(tokenExpires, 10);
    
    if (currentTime > expiresAt) {
      clearAuth();
      return true;
    }
    
    navigate('/admin/dashboard');
    return false;
  }, [navigate, clearAuth]);

  const isAuthenticated = useCallback(() => {
    return authState.isAuthenticated;
  }, [authState.isAuthenticated]);

  return {
    isAuthenticated,
    getAuthToken,
    getAuthUser,
    clearAuth,
    requireAuth,
    requireNoAuth
  };
};