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

/**
 * SkeletonSettings Component
 * 
 * Renders a placeholder UI structure that mimics the settings page layout.
 * Used to enhance perceived performance during the initial data fetch.
 */
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

/**
 * AdminSettings Component
 * 
 * Provides a specialized interface for administrators to manage their profile
 * information, including profile photo, personal details, and security credentials.
 */
const AdminSettings = () => {
  // --- UI and State Management ---
  const [active, setActive] = useState("Settings");
  const [admin, setAdmin] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Form states for profile and security management
  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  // Controls visibility toggle for password fields
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // --- Animation References ---
  const headerRef = useRef(null);
  const profileCardRef = useRef(null);
  const passwordCardRef = useRef(null);

  /**
   * Initial effect to fetch current administrator settings.
   * Synchronizes component state with the backend profile data.
   */
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
          title: "Extraction Error",
          text: "Failed to load administrator profile settings.",
          customClass: { popup: "premium-swal-popup" }
        });
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  /**
   * Orchestrates the entrance animations for the settings layout
   * using GSAP when the profile data has finished loading.
   */
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

  /**
   * Triggers the hidden file input click event for photo selection.
   */
  const handleUploadClick = () => fileInputRef.current.click();

  /**
   * Handles the selection and immediate upload of a new profile photo.
   * @param {Event} e - The change event from the file input.
   */
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
        title: "Photo Updated",
        text: "Administrator profile photo has been successfully updated.",
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: "premium-swal-popup" }
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err?.message || "An error occurred while updating the profile photo.",
        customClass: { popup: "premium-swal-popup" }
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validates and submits updated profile metadata (name, email).
   */
  const handleSaveProfile = async () => {
    if (!profileData.name.trim() || !profileData.email.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Full name and email address are required fields.",
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
        title: "Profile Synchronized",
        text: "Your profile details have been successfully updated.",
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: "premium-swal-popup" }
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err?.message || "There was a problem synchronizing your profile details.",
        customClass: { popup: "premium-swal-popup" }
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validates security credentials and initiates the password change process.
   */
  const handleChangePassword = async () => {
    // Validation: Check for presence of all required fields
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      Swal.fire({
        icon: "error",
        title: "Incomplete Request",
        text: "All credentials fields must be populated to proceed.",
        customClass: { popup: "premium-swal-popup" }
      });
      return;
    }

    // Validation: Ensure the new password matches the confirmation
    if (passwordData.new !== passwordData.confirm) {
      Swal.fire({
        icon: "error",
        title: "Mismatch Detected",
        text: "The new password and confirmation entry do not match.",
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

      // Clear password fields upon successful rotation
      setPasswordData({ current: "", new: "", confirm: "" });

      Swal.fire({
        icon: "success",
        title: "Security Updated",
        text: "Your account password has been successfully rotated.",
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: "premium-swal-popup" }
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Rotation Failed",
        text: err?.message || "Credential update failed. Please verify your current password.",
        customClass: { popup: "premium-swal-popup" }
      });
    } finally {
      setLoading(false);
    }
  };

  // Logic to determine if save button should be active for profile
  const isProfileUnchanged =
    admin &&
    profileData.name === admin.name &&
    profileData.email === admin.email;

  // Logic to determine if update button should be active for security
  const isPasswordInvalid =
    !passwordData.current ||
    !passwordData.new ||
    !passwordData.confirm ||
    passwordData.new !== passwordData.confirm;

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        <div className="settings-container">
          {/* Header Section */}
          <header className="settings-header" ref={headerRef}>
            <h1 className="settings-title">Settings</h1>
            <p className="settings-subtitle">
              Manage your account configurations and security preferences
            </p>
          </header>

          {/* Profile Configuration Card */}
          <div className="settings-card" ref={profileCardRef}>
            <div className="settings-card-header">
              <User size={24} />
              <h2>Profile Information</h2>
            </div>

            <div className="profile-section">
              {/* Profile Avatar Management */}
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

              {/* Personal Details Form */}
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

          {/* Security and Password Card */}
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
                      className="visibility-toggle"
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

