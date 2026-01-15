import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  Folder,
  Code,
  Briefcase,
  Award,
  Mail,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import "../../css/admin/AdminDashboard.css";
import {
  getTotalProjects,
  getTotalSkills,
  getTotalExperience,
  getTotalCertificates,
  getTotalContacts,
  getRecentProjects,
} from "../../services/dashboardService";

const AdminDashboard = () => {
  const [active, setActive] = useState("Dashboard");
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalSkills, setTotalSkills] = useState(0);
  const [totalExperience, setTotalExperience] = useState(0);
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [totalContacts, setTotalContacts] = useState(0);
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const projectsRes = await getTotalProjects();
        setTotalProjects(projectsRes.total_projects);

        const skillsRes = await getTotalSkills();
        setTotalSkills(skillsRes.data.grand_total);

        const experienceRes = await getTotalExperience();
        setTotalExperience(experienceRes.years_of_experience);

        const certificatesRes = await getTotalCertificates();
        setTotalCertificates(certificatesRes.data.total_certificates);

        const contactsRes = await getTotalContacts();
        setTotalContacts(contactsRes.data.total_contacts);

        const recentProjectsRes = await getRecentProjects();
        setRecentProjects(recentProjectsRes.projects);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's an overview of your portfolio.</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <Folder />
            <h2>{totalProjects}</h2>
            <p>Total Projects</p>
          </div>

          <div className="stat-card green">
            <Code />
            <h2>{totalSkills}</h2>
            <p>Total Skills</p>
          </div>

          <div className="stat-card purple">
            <Briefcase />
            <h2>{totalExperience}</h2>
            <p>Experiences</p>
          </div>

          <div className="stat-card orange">
            <Award />
            <h2>{totalCertificates}</h2>
            <p>Certificates</p>
          </div>

          <div className="stat-card pink">
            <Mail />
            <h2>{totalContacts}</h2>
            <p>Messages</p>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="card">
          <div className="card-header">
            <h2>Recent Projects</h2>
            <button className="view-all">View All</button>
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
            <button className="view-all">View All</button>
          </div>

          <div className="message">
            <div>
              <strong>John Smith</strong>
              <span className="dot"></span>
              <p>john@example.com</p>
              <span>Project Inquiry</span>
            </div>
            <small>2024-12-22</small>
          </div>

          <div className="message">
            <div>
              <strong>Sarah Johnson</strong>
              <span className="dot"></span>
              <p>sarah@example.com</p>
              <span>Collaboration Opportunity</span>
            </div>
            <small>2024-12-21</small>
          </div>

          <div className="message">
            <div>
              <strong>Mike Wilson</strong>
              <p>mike@example.com</p>
              <span>Question about your work</span>
            </div>
            <small>2024-12-20</small>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
