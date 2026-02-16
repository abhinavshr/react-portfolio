import React, { useEffect, useRef, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { User, Lock, Upload, Save, Eye, EyeOff } from "lucide-react";
import "../../../css/admin/settings/AdminSettings.css";
import Swal from "sweetalert2";
import gsap from "gsap";
import {
  viewAdminSettings,
  updateAdminProfilePhoto,
  updateAdminProfile,
  changeAdminPassword
} from "../../../services/adminSettingService";

/* ---------------- Skeleton Layout ---------------- */
const SkeletonSettings = () => (
  <div className="settings-container skeleton-setting">
    <div className="settings-header">
      <div className="skeleton-title" />
      <div className="skeleton-subtitle" />
    </div>

    <div className="settings-card">
      <div className="settings-card-header">
        <div className="skeleton-icon" />
        <div className="skeleton-line w-180" style={{ height: "1.5rem" }} />
      </div>

      <div className="profile-section">
        <div className="profile-photo">
          <div className="skeleton-avatar" />
          <div className="photo-actions">
            <div className="skeleton-line w-120" style={{ height: "2.5rem" }} />
            <div className="skeleton-line w-160" />
          </div>
        </div>

        <div className="profile-form">
          <div className="skeleton-input" />
          <div className="skeleton-input" />
        </div>

        <div className="skeleton-btn" />
      </div>
    </div>

    <div className="settings-card">
      <div className="settings-card-header">
        <div className="skeleton-icon" />
        <div className="skeleton-line w-160" style={{ height: "1.5rem" }} />
      </div>

      <div className="password-form">
        <div className="skeleton-input" />
        <div className="skeleton-input" />
        <div className="skeleton-input" />
      </div>

      <div className="skeleton-btn" />
    </div>
  </div>
);

/* ---------------- Main Component ---------------- */
const AdminSettings = () => {
  const [active, setActive] = useState("Settings");
  const [admin, setAdmin] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

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

  // Animation Refs
  const headerRef = useRef(null);
  const profileCardRef = useRef(null);
  const passwordCardRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const res = await viewAdminSettings();
        setAdmin(res.user);
        setProfileData({ name: res.user.name, email: res.user.email });
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load profile",
          customClass: { popup: "premium-swal-popup" }
        });
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!loadingProfile) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8 }
      )
        .fromTo([profileCardRef.current, passwordCardRef.current],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 },
          "-=0.4"
        );
    }
  }, [loadingProfile]);

  if (loadingProfile) {
    return (
      <div className="admin-layout">
        <AdminSidebar active={active} setActive={setActive} />
        <main className="admin-content">
          <SkeletonSettings />
        </main>
      </div>
    );
  }

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      await updateAdminProfilePhoto(file);
      const res = await viewAdminSettings();
      setAdmin(res.user);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile photo updated successfully",
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: "premium-swal-popup" }
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.message || "Failed to update profile photo",
        customClass: { popup: "premium-swal-popup" }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileData.name.trim() || !profileData.email.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Name and email are required",
        customClass: { popup: "premium-swal-popup" }
      });
      return;
    }
    try {
      setLoading(true);
      await updateAdminProfile(profileData);
      const res = await viewAdminSettings();
      setAdmin(res.user);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile updated successfully",
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: "premium-swal-popup" }
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.message || "Failed to update profile",
        customClass: { popup: "premium-swal-popup" }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "All password fields are required",
        customClass: { popup: "premium-swal-popup" }
      });
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "New password and confirmation do not match",
        customClass: { popup: "premium-swal-popup" }
      });
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
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Password updated successfully",
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: "premium-swal-popup" }
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.message || "Failed to update password",
        customClass: { popup: "premium-swal-popup" }
      });
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
          <header className="settings-header" ref={headerRef}>
            <h1 className="settings-title">Settings</h1>
            <p className="settings-subtitle">
              Manage your account settings and preferences
            </p>
          </header>

          {/* Profile Card */}
          <div className="settings-card" ref={profileCardRef}>
            <div className="settings-card-header">
              <User size={24} />
              <h2>Profile Information</h2>
            </div>

            <div className="profile-section">
              <div className="profile-photo">
                <div className="photo-circle">
                  {admin?.profile_photo ? (
                    <img src={admin.profile_photo} alt="Profile" />
                  ) : (
                    <User size={40} />
                  )}
                </div>

                <div className="photo-actions">
                  <button
                    className="upload-btn"
                    onClick={handleUploadClick}
                    disabled={loading}
                  >
                    <Upload size={18} /> Upload New Photo
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
                    placeholder="Enter your full name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        name: e.target.value
                      })
                    }
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        email: e.target.value
                      })
                    }
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
                  <Save size={20} /> Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Password Card */}
          <div className="settings-card" ref={passwordCardRef}>
            <div className="settings-card-header">
              <Lock size={24} />
              <h2>Security Settings</h2>
            </div>

            <div className="password-form">
              {[
                { key: "current", label: "Current Password" },
                { key: "new", label: "New Password" },
                { key: "confirm", label: "Confirm New Password" }
              ].map((field) => (
                <div className="form-group" key={field.key}>
                  <label>{field.label}</label>
                  <div className="password-input">
                    <input
                      type={showPassword[field.key] ? "text" : "password"}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      value={passwordData[field.key]}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          [field.key]: e.target.value
                        })
                      }
                      disabled={loading}
                    />
                    <span
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          [field.key]: !showPassword[field.key]
                        })
                      }
                    >
                      {showPassword[field.key] ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
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
                <Lock size={20} /> Update Password
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;

