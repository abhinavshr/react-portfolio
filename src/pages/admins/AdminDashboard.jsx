import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Folder, Code, Briefcase, Award, Mail } from "lucide-react";
import "../../css/admin/AdminDashboard.css";
import {
  getTotalProjects,
  getTotalSkills,
  getTotalExperience,
  getTotalCertificates,
  getTotalContacts,
  getRecentProjects,
  getRecentContacts,
} from "../../services/dashboardService";
import { Atom } from "react-loading-indicators";
import { motion as Motion } from "framer-motion"; 

const AdminDashboard = () => {
  const [active, setActive] = useState("Dashboard");
  const [loading, setLoading] = useState(true);

  const [totalProjects, setTotalProjects] = useState(0);
  const [totalSkills, setTotalSkills] = useState(0);
  const [totalExperience, setTotalExperience] = useState(0);
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [totalContacts, setTotalContacts] = useState(0);
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          projectsRes,
          skillsRes,
          experienceRes,
          certificatesRes,
          contactsRes,
          recentProjectsRes,
          recentContactsRes,
        ] = await Promise.all([
          getTotalProjects(),
          getTotalSkills(),
          getTotalExperience(),
          getTotalCertificates(),
          getTotalContacts(),
          getRecentProjects(),
          getRecentContacts(),
        ]);

        setTotalProjects(projectsRes.total_projects);
        setTotalSkills(skillsRes.data.grand_total);
        setTotalExperience(experienceRes.years_of_experience);
        setTotalCertificates(certificatesRes.data.total_certificates);
        setTotalContacts(contactsRes.data.total_contacts);

        setRecentProjects(
          Array.isArray(recentProjectsRes.projects) ? recentProjectsRes.projects : []
        );
        setRecentContacts(
          Array.isArray(recentContactsRes.data) ? recentContactsRes.data : []
        );
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "80px" }}>
            <Atom color="#2563eb" size="medium" text="" textColor="" />
          </div>
        ) : (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="dashboard-header">
              <h1>Dashboard</h1>
              <p>Welcome back! Here's an overview of your portfolio.</p>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              <div
                className="stat-card blue"
                onClick={() => navigate("/admin/projects")}
                style={{ cursor: "pointer" }}
              >
                <Folder />
                <h2>{totalProjects}</h2>
                <p>Total Projects</p>
              </div>

              <div
                className="stat-card green"
                onClick={() => navigate("/admin/skills")}
                style={{ cursor: "pointer" }}
              >
                <Code />
                <h2>{totalSkills}</h2>
                <p>Total Skills</p>
              </div>

              <div
                className="stat-card purple"
                onClick={() => navigate("/admin/experience")}
                style={{ cursor: "pointer" }}
              >
                <Briefcase />
                <h2>{totalExperience}</h2>
                <p>Experiences</p>
              </div>

              <div
                className="stat-card orange"
                onClick={() => navigate("/admin/certificates")}
                style={{ cursor: "pointer" }}
              >
                <Award />
                <h2>{totalCertificates}</h2>
                <p>Certificates</p>
              </div>

              <div
                className="stat-card pink"
                onClick={() => navigate("/admin/contacts")}
                style={{ cursor: "pointer" }}
              >
                <Mail />
                <h2>{totalContacts}</h2>
                <p>Messages</p>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="card">
              <div className="card-header">
                <h2>Recent Projects</h2>
                <button
                  className="view-all"
                  onClick={() => navigate("/admin/projects")}
                >
                  View All
                </button>
              </div>

              <table className="projects-table">
                <thead>
                  <tr>
                    <th>PROJECT NAME</th>
                    <th>CATEGORY</th>
                    <th>START DATE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.length > 0 ? (
                    recentProjects.map((project) => (
                      <tr key={project.id}>
                        <td>{project.title}</td>
                        <td>{project.category?.name || "—"}</td>
                        <td>
                          {project.start_date
                            ? new Date(project.start_date).toISOString().split("T")[0]
                            : "—"}
                        </td>
                        <td>
                          <span className={`status ${project.status}`}>
                            {project.status.replace("_", " ")}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>
                        No recent projects found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Recent Messages */}
            <div className="card">
              <div className="card-header">
                <h2>Recent Messages</h2>
                <button
                  className="view-all"
                  onClick={() => navigate("/admin/contacts")}
                >
                  View All
                </button>
              </div>

              {recentContacts.length > 0 ? (
                recentContacts.map((contact) => (
                  <div className="message" key={contact.id}>
                    <div>
                      <strong>{contact.name}</strong>
                      <span className="dot"></span>
                      <p>{contact.email}</p>
                      <span>{contact.subject}</span>
                    </div>
                    <small>
                      {contact.created_at
                        ? new Date(contact.created_at).toISOString().split("T")[0]
                        : "—"}
                    </small>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "center", padding: "16px" }}>
                  No recent messages found
                </p>
              )}
            </div>
          </Motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
