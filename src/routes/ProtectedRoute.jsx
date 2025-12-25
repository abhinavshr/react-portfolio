import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('adminToken');
      const tokenExpires = localStorage.getItem('tokenExpires');
      
      if (!token || !tokenExpires) {
        setIsAuth(false);
        return;
      }
      
      const currentTime = Date.now();
      const expiresAt = parseInt(tokenExpires, 10);
      
      setIsAuth(currentTime < expiresAt);
    };
    
    checkAuthentication();
  }, []);

  if (isAuth === null) {
    return null;
  }

  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;