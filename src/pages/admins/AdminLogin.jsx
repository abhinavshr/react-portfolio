import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/admin/AdminLogin.css";
import { useAuth } from "../../hooks/useAuth";
import { Mail, Lock, AlertCircle, CheckCircle, Loader2, ShieldCheck } from "lucide-react";
import { adminLogin } from "../../services/authService";
import axios from "axios";
import gsap from "gsap";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { requireNoAuth, clearAuth } = useAuth();

  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const formRef = useRef(null);
  const titleRef = useRef(null);

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

    // Entrance Animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(cardRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(".icon-wrapper",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
          "-=0.4"
        )
        .fromTo(titleRef.current.children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
          "-=0.3"
        )
        .fromTo(".form-group",
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" },
          "-=0.2"
        )
        .fromTo(".login-button",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          "-=0.2"
        );
    }, containerRef);

    return () => ctx.revert();
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

        // Success animation for button
        gsap.to(".login-button", {
          scale: 1.05,
          duration: 0.2,
          yoyo: true,
          repeat: 1
        });

        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1500);
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || err.message || "Invalid credentials");

      // Error shake animation
      gsap.to(cardRef.current, {
        x: 10,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: "power2.inOut",
        onComplete: () => gsap.set(cardRef.current, { x: 0 })
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" ref={containerRef}>
      <div className="login-card" ref={cardRef}>
        <div className="icon-wrapper">
          <ShieldCheck size={32} color="#3b82f6" />
        </div>

        <div className="login-header" ref={titleRef}>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">
            Secure access to your professional portal
          </p>
        </div>

        {error && (
          <div className="alert error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert success">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} ref={formRef}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
                autoComplete="email"
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
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
                autoComplete="current-password"
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
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ShieldCheck size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
