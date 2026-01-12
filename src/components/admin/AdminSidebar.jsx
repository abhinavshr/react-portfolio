import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/admin/AdminSidebar.css";
import {
  LayoutDashboard,
  Folder,
  Image,
  Code,
  Heart,
  GraduationCap,
  Briefcase,
  Award,
  Mail,
  Settings,
  LogOut,
  User,
} from "lucide-react";

const menuItems = [
  "Dashboard",
  "Profile",
  "Projects",
  "Project Images",
  "Skills",
  "Soft Skills",
  "Education",
  "Experience",
  "Certificates",
  "Contacts",
  "Settings",
];

const icons = {
  Dashboard: <LayoutDashboard />,
  Profile: <User />,
  Projects: <Folder />,
  "Project Images": <Image />,
  Skills: <Code />,
  "Soft Skills": <Heart />,
  Education: <GraduationCap />,
  Experience: <Briefcase />,
  Certificates: <Award />,
  Contacts: <Mail />,
  Settings: <Settings />,
};

const AdminSidebar = ({ active, setActive }) => {
  const navigate = useNavigate();

  const handleClick = (item) => {
    setActive(item);

    if (item === "Dashboard") {
      navigate("/admin/dashboard");
    }
    if (item === "Projects") {
      navigate("/admin/projects");
    }
    if (item === "Project Images") {
      navigate("/admin/project-images");
    }
    if (item === "Skills") {
      navigate("/admin/skills");
    }
    if (item === "Soft Skills") {
      navigate("/admin/soft-skills");
    }
    if (item === "Education") {
      navigate("/admin/education");
    }
    if (item === "Experience") {
      navigate("/admin/experience");
    }
    if (item === "Certificates") {
      navigate("/admin/certificates");
    }
    if (item === "Contacts") {
      navigate("/admin/contacts");
    }
    if (item === "Settings") {
      navigate("/admin/settings");
    }
    if (item === "Profile") {
      navigate("/admin/profiles");
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item}
            className={`sidebar-item ${active === item ? "active" : ""}`}
            onClick={() => handleClick(item)}
          >
            {icons[item]}
            <span>{item}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn">
          <LogOut />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
