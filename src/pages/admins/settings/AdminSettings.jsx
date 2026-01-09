import React, { useEffect, useRef, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { User, Lock, Upload, Save } from "lucide-react";
import "../../../css/admin/settings/AdminSettings.css";
import {
  viewAdminSettings,
  updateAdminProfilePhoto,
  updateAdminProfile,
  changeAdminPassword
} from "../../../services/adminSettingService";

const AdminSettings = () => {
  const [active, setActive] = useState("Settings");
  const [admin, setAdmin] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await viewAdminSettings();
      setAdmin(res.user);
      setName(res.user.name);
      setEmail(res.user.email);
    };
    fetchProfile();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    await updateAdminProfilePhoto(file);
    const res = await viewAdminSettings();
    setAdmin(res.user);
  };

  const handleSaveProfile = async () => {
    await updateAdminProfile({ name, email });
    const res = await viewAdminSettings();
    setAdmin(res.user);
  };

  const handleChangePassword = async () => {
    await changeAdminPassword({
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const isProfileUnchanged =
    admin &&
    name === admin.name &&
    email === admin.email;

  const isPasswordInvalid =
    !currentPassword ||
    !newPassword ||
    !confirmPassword ||
    newPassword !== confirmPassword;

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
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="save-profile">
                <button
                  className="primary-btn"
                  disabled={isProfileUnchanged}
                  onClick={handleSaveProfile}
                  style={{
                    opacity: isProfileUnchanged ? 0.6 : 1,
                    cursor: isProfileUnchanged ? "not-allowed" : "pointer"
                  }}
                >
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
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="update-password">
              <button
                className="primary-btn"
                disabled={isPasswordInvalid}
                onClick={handleChangePassword}
                style={{
                  opacity: isPasswordInvalid ? 0.6 : 1,
                  cursor: isPasswordInvalid ? "not-allowed" : "pointer"
                }}
              >
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
