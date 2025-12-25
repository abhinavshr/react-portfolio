import React from "react";
import "../../css/admin/AdminLogin.css";
import { Mail, Lock } from "lucide-react";

const AdminLogin = () => {
  return (
    <div className="login-container">
      <div className="login-card">
        {/* Icon */}
        <div className="icon-wrapper">
          <Lock size={28} color="#2563EB" />
        </div>

        {/* Header */}
        <div className="login-header">
          <h1 className="login-title">Admin Login</h1>
          <p className="login-subtitle">
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Form */}
        <form className="login-form">
          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input
                type="email"
                className="form-input"
                placeholder="admin@portfolio.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Button */}
          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
