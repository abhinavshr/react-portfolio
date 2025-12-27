import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/admins/AdminLogin';
import AdminDashboard from './pages/admins/AdminDashboard';
import AdminPorject from './pages/admins/projects/AdminProject';
import ProtectedRoute from './routes/ProtectedRoute';
import AddProject from './pages/admins/projects/AddProject';

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

        <Route 
          path="/admin/projects" 
          element={
            <ProtectedRoute>
              <AdminPorject />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/add-project" 
          element={
            <ProtectedRoute>
              <AddProject />
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