import React from 'react';
import '../../css/admin/AdminLogin.css';

const AdminLogin = () => {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Access Your Account</h1>
          <p className="login-subtitle">Please enter your credentials</p>
        </div>
        
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email address"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-container">
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="Enter your password"
              />
            </div>
          </div>
          
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        
        <div className="demo-credentials">
          <p>Demo credentials:</p>
          <p>Email: admin@example.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;