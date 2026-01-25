import React, { useEffect, useRef, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { User, Lock, Upload, Save, Eye, EyeOff } from "lucide-react";
import "../../../css/admin/settings/AdminSettings.css";
import Swal from "sweetalert2";
import {
  viewAdminSettings,
  updateAdminProfilePhoto,
  updateAdminProfile,
  changeAdminPassword
} from "../../../services/adminSettingService";

const AdminSettings = () => {
  const [active, setActive] = useState("Settings");
  const [admin, setAdmin] = useState(null);

  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await viewAdminSettings();
        setAdmin(res.user);
        setProfileData({ name: res.user.name, email: res.user.email });
      } catch {
        Swal.fire("Error", "Failed to load profile", "error");
      }
    };
    fetchProfile();
  }, []);

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      await updateAdminProfilePhoto(file);
      const res = await viewAdminSettings();
      setAdmin(res.user);
      Swal.fire("Success", "Profile photo updated successfully", "success");
    } catch (err) {
      Swal.fire("Error", err?.message || "Failed to update profile photo", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileData.name.trim() || !profileData.email.trim()) {
      Swal.fire("Error", "Name and email are required", "error");
      return;
    }
    try {
      setLoading(true);
      await updateAdminProfile(profileData);
      const res = await viewAdminSettings();
      setAdmin(res.user);
      Swal.fire("Success", "Profile updated successfully", "success");
    } catch (err) {
      Swal.fire("Error", err?.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      Swal.fire("Error", "All password fields are required", "error");
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      Swal.fire("Error", "New password and confirmation do not match", "error");
      return;
    }
    try {
      setLoading(true);
      await changeAdminPassword({
        current_password: passwordData.current,
        new_password: passwordData.new,
        new_password_confirmation: passwordData.confirm
      });
      setPasswordData({ current: "", new: "", confirm: "" });
      Swal.fire("Success", "Password updated successfully", "success");
    } catch (err) {
      Swal.fire("Error", err?.message || "Failed to update password", "error");
    } finally {
      setLoading(false);
    }
  };

  const isProfileUnchanged =
    admin &&
    profileData.name === admin.name &&
    profileData.email === admin.email;

  const isPasswordInvalid =
    !passwordData.current ||
    !passwordData.new ||
    !passwordData.confirm ||
    passwordData.new !== passwordData.confirm;

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        <div className="settings-container">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Manage your account settings and preferences</p>

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
                  <button className="upload-btn" onClick={handleUploadClick} disabled={loading}>
                    <Upload size={16} /> Upload Photo
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/png,image/jpeg,image/jpg,image/gif"
                    onChange={handleFileChange}
                  />
                  <span className="photo-hint">JPG, PNG or GIF. Max size 2MB.</span>
                </div>
              </div>

              <div className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="save-profile">
                <button
                  className="primary-btn"
                  disabled={isProfileUnchanged || loading}
                  onClick={handleSaveProfile}
                >
                  <Save size={16} /> Save Profile
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
              {["current", "new", "confirm"].map((field) => (
                <div className="form-group password-group" key={field}>
                  <label>
                    {field === "current" && "Current Password"}
                    {field === "new" && "New Password"}
                    {field === "confirm" && "Confirm New Password"}
                  </label>
                  <div className="password-input">
                    <input
                      type={showPassword[field] ? "text" : "password"}
                      value={passwordData[field]}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, [field]: e.target.value })
                      }
                      disabled={loading}
                    />
                    <span
                      aria-label={`Toggle ${field} password visibility`}
                      onClick={() =>
                        setShowPassword({ ...showPassword, [field]: !showPassword[field] })
                      }
                    >
                      {showPassword[field] ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="update-password">
              <button
                className="primary-btn"
                disabled={isPasswordInvalid || loading}
                onClick={handleChangePassword}
              >
                <Lock size={16} /> Update Password
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
