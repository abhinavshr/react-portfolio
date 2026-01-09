import React, { useEffect, useRef, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { User, Lock, Upload, Save } from "lucide-react";
import "../../../css/admin/settings/AdminSettings.css";
import {
  viewAdminSettings,
  updateAdminProfilePhoto
} from "../../../services/adminSettingService";

const AdminSettings = () => {
  const [active, setActive] = useState("Settings");
  const [admin, setAdmin] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await viewAdminSettings();
        setAdmin(res.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await updateAdminProfilePhoto(file);

      const res = await viewAdminSettings();
      setAdmin(res.user);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        <div className="settings-container">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">
            Manage your account settings and preferences
          </p>

          <div className="settings-card">
            <div className="settings-card-header">
              <User size={22} />
              <h2>Profile Information</h2>
            </div>

            <div className="profile-section">
              <div className="profile-photo">
                <div className="photo-circle">
                  {admin?.profile_photo ? (
                    <img src={admin.profile_photo} alt="Profile" />
                  ) : (
                    <User size={28} />
                  )}
                </div>

                <div className="photo-actions">
                  <button className="upload-btn" onClick={handleUploadClick}>
                    <Upload size={16} />
                    Upload Photo
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/png,image/jpeg,image/jpg,image/gif"
                    onChange={handleFileChange}
                  />

                  <span className="photo-hint">
                    JPG, PNG or GIF. Max size 2MB.
                  </span>
                </div>
              </div>

              <div className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input value={admin?.name || ""} disabled />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input value={admin?.email || ""} disabled />
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
            </div>

            <div className="update-password">
              <button className="primary-btn">
                <Lock size={16} />
                Update Password
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
