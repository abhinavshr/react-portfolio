import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/admin/AdminLogin.css";
import { useAuth } from "../../hooks/useAuth";
import { Mail, Lock, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { adminLogin } from "../../services/authService";
import axios from "axios"; 

const AdminLogin = () => {
  const navigate = useNavigate();
  const { requireNoAuth, clearAuth } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const shouldStay = requireNoAuth();
    
    if (!shouldStay) {
      const tokenExpires = localStorage.getItem('tokenExpires');
      if (tokenExpires) {
        const currentTime = Date.now();
        const expiresAt = parseInt(tokenExpires, 10);
        
        if (currentTime >= expiresAt) {
          clearAuth();
        }
      }
    }
  }, [requireNoAuth, clearAuth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await adminLogin(formData.email, formData.password);
      
      if (response.success && response.access_token) {
        setSuccess(response.message || "Login successful!");
        
        localStorage.setItem('adminToken', response.access_token);
        localStorage.setItem('adminEmail', formData.email);
        localStorage.setItem('tokenType', response.token_type);
        localStorage.setItem('tokenExpires', Date.now() + (response.expires_in * 1000));
        
        if (typeof axios !== 'undefined') {
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.access_token}`;
        }
        
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1500);
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="icon-wrapper">
          <Lock size={28} color="#2563EB" />
        </div>

        <div className="login-header">
          <h1 className="login-title">Admin Login</h1>
          <p className="login-subtitle">
            Sign in to manage your portfolio
          </p>
        </div>

        {error && (
          <div className="alert error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert success">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="admin@portfolio.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="spinner" size={20} />
                <span>Signing In...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;