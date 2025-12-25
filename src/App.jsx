// Example routing configuration
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/admins/AdminLogin';
import AdminDashboard from './pages/admins/AdminDashboard';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Add more protected routes as needed */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              {/* Your admin layout or specific components */}
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;