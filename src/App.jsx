import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/admins/AdminLogin';
import HomePage from './pages/users/home';
import './App.css';
import AdminDashboard from './pages/admins/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          
          <Route path="/home" element={<HomePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
