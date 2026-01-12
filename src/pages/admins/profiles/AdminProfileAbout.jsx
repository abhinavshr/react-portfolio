import { useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Save } from "lucide-react";
import "../../../css/admin/profiles/AdminProfileAbout.css";

const AdminProfileAbout = () => {
  const [active, setActive] = useState("Profile");

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        <div className="profile-container">
          <div className="profile-header">
            <div>
              <h1>Profile & About</h1>
              <p>Manage your professional profile and portfolio information</p>
            </div>
          </div>

          <div className="profile-card">
            <h2>Identity Confirmation</h2>
            <span className="subtitle">Your core identity information</span>

            <div className="identity-box">
              <div className="avatar">👤</div>
              <div>
                <h3>Admin User</h3>
                <p>admin@portfolio.com</p>
                <small>Update your photo, name, and email in Settings</small>
              </div>
            </div>
          </div>

          <div className="profile-card">
            <h2>Basic Information</h2>
            <span className="subtitle">Professional identity and contact details</span>

            <div className="grid-2">
              <div className="form-group">
                <label>Phone Number</label>
                <input value="+1 234 567 8900" readOnly />
              </div>

              <div className="form-group">
                <label>Professional Title</label>
                <input value="Full-Stack Developer" readOnly />
              </div>
            </div>

            <div className="form-group">
              <label>Tagline</label>
              <input value="Building scalable web & mobile solutions" readOnly />
            </div>

            <div className="form-group">
              <label>About Me</label>
              <textarea
                rows="4"
                readOnly
                value="Passionate developer with expertise in creating modern, responsive web applications. Specialized in React, Node.js, and cloud technologies with a focus on delivering high-quality solutions."
              />
            </div>

            <button className="save-btn">
              <Save size={16} />
              Save Basic Info
            </button>
          </div>

          <div className="profile-card">
            <h2>Portfolio Statistics</h2>

            <div className="grid-4">
              <div className="form-group">
                <label>Years of Experience</label>
                <input value="5" readOnly />
              </div>
              <div className="form-group">
                <label>Projects Completed</label>
                <input value="50" readOnly />
              </div>
              <div className="form-group">
                <label>Happy Clients</label>
                <input value="30" readOnly />
              </div>
              <div className="form-group">
                <label>Technologies Used</label>
                <input value="25" readOnly />
              </div>
            </div>

            <button className="save-btn">
              <Save size={16} />
              Save Statistics
            </button>
          </div>

          <div className="profile-card">
            <h2>Social Links</h2>

            <div className="grid-2">
              <div className="form-group">
                <label>GitHub</label>
                <input value="https://github.com/username" readOnly />
              </div>
              <div className="form-group">
                <label>LinkedIn</label>
                <input value="https://linkedin.com/in/username" readOnly />
              </div>
              <div className="form-group">
                <label>Portfolio Website</label>
                <input value="https://portfolio.com" readOnly />
              </div>
              <div className="form-group">
                <label>Twitter / X</label>
                <input value="https://twitter.com/username" readOnly />
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
