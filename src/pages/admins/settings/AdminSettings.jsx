import React, { useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { User, Lock, Upload, Save } from "lucide-react";
import "../../../css/admin/settings/AdminSettings.css";

const AdminSettings = () => {
    const [active, setActive] = useState("Settings");
    
  return (
    <div className="admin-layout">
            <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        <div className="settings-container">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">
            Manage your account settings and preferences
          </p>

          {/* Profile Information */}
          <div className="settings-card">
            <div className="settings-card-header">
              <User size={22} />
              <h2>Profile Information</h2>
            </div>

            <div className="profile-section">
              <div className="profile-photo">
                <div className="avatar-placeholder">
                  <User size={40} />
                </div>

                <button className="upload-btn">
                  <Upload size={16} />
                  Upload Photo
                </button>

                <span className="photo-hint">
                  JPG, PNG or GIF. Max size 2MB.
                </span>
              </div>

              <div className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value="Admin User" disabled />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" value="admin@portfolio.com" disabled />
                </div>
              </div>

              <div className="save-profile">
                <button className="primary-btn">
                  <Save size={16} />
                  Save Profile
                </button>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="settings-card">
            <div className="settings-card-header">
              <Lock size={22} />
              <h2>Change Password</h2>
            </div>

            <div className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input type="password" />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" />
              </div>

              <div className="update-password">
                <button className="primary-btn">
                  <Lock size={16} />
                  Update Password
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
