import { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Save } from "lucide-react";
import Swal from "sweetalert2";
import "../../../css/admin/profiles/AdminProfileAbout.css";
import { getAdminProfileAbout } from "../../../services/adminProfileAbout";

const AdminProfileAbout = () => {
  const [active, setActive] = useState("Profile");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const fetchProfileAbout = async () => {
    setLoading(true);
    try {
      const response = await getAdminProfileAbout();
      setUser(response.user);
      setProfile(response.profile);
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAbout();
  }, []);

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar active={active} setActive={setActive} />
        <main className="admin-content">
          <p>Loading profile...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        <div className="profile-container">
          <div className="profile-header">
            <h1>Profile & About</h1>
            <p>Manage your professional profile and portfolio information</p>
          </div>

          {/* Identity */}
          <div className="profile-card">
            <h2>Identity Confirmation</h2>
            <span className="subtitle">Your core identity information</span>

            <div className="identity-box">
              <div className="avatar">
                {user?.profile_photo ? (
                  <img src={user.profile_photo} alt="Profile" />
                ) : (
                  "👤"
                )}
              </div>
              <div>
                <h3>{user?.name}</h3>
                <p>{user?.email}</p>
                <small>Update your photo, name, and email in Settings</small>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="profile-card">
            <h2>Basic Information</h2>
            <span className="subtitle">Professional identity and contact details</span>

            <div className="grid-2">
              <div className="form-group">
                <label>Phone Number</label>
                <input value={profile.phone_number || ""} readOnly />
              </div>

              <div className="form-group">
                <label>Professional Title</label>
                <input value={profile.professional_title || ""} readOnly />
              </div>
            </div>

            <div className="form-group">
              <label className="admin-about">Tagline</label>
              <input value={profile.tagline || ""} readOnly />
            </div>

            <div className="form-group">
              <label className="admin-about">About Me</label>
              <textarea rows="4" value={profile.about_me || ""} readOnly />
            </div>

            <button className="save-btn">
              <Save size={16} />
              Save Basic Info
            </button>
          </div>

          {/* Statistics */}
          <div className="profile-card">
            <h2>Portfolio Statistics</h2>

            <div className="grid-4">
              <div className="form-group">
                <label>Years of Experience</label>
                <input value={profile.years_of_experience} readOnly />
              </div>
              <div className="form-group">
                <label>Projects Completed</label>
                <input value={profile.projects_completed} readOnly />
              </div>
              <div className="form-group">
                <label>Happy Clients</label>
                <input value={profile.happy_clients} readOnly />
              </div>
              <div className="form-group">
                <label>Technologies Used</label>
                <input value={profile.technologies_used} readOnly />
              </div>
            </div>

            <button className="save-btn">
              <Save size={16} />
              Save Statistics
            </button>
          </div>

          {/* Social Links */}
          <div className="profile-card">
            <h2>Social Links</h2>

            <div className="grid-2">
              <div className="form-group">
                <label>GitHub</label>
                <input value={profile.github_url || ""} readOnly />
              </div>

              <div className="form-group">
                <label>LinkedIn</label>
                <input value={profile.linkedin_url || ""} readOnly />
              </div>

              <div className="form-group">
                <label>CV URL</label>
                <input value={profile.cv_url || ""} readOnly />
              </div>

              <div className="form-group">
                <label>Twitter / X</label>
                <input value={profile.twitter_url || ""} readOnly />
              </div>
            </div>

            <button className="save-btn">
              <Save size={16} />
              Save Social Links
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProfileAbout;
