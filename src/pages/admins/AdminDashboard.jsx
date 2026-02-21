import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Folder, Code, Briefcase, Award, Mail, ChevronRight } from "lucide-react";
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
import { motion as Motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

// -- Helper Components & Constants --

/**
 * Framer Motion transition variants for the main content container.
 * Implements staggered entrance for children items.
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Entrance animation for individual dashboard items (cards, headers).
 */
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

/**
 * AnimatedNumber Component
 * 
 * Provides a high-performance counting animation for numeric values
 * using Framer Motion's useMotionValue and animate.
 * 
 * @param {Object} props
 * @param {number|string} props.value - The final number to animate to.
 */
const AnimatedNumber = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const end = parseInt(value, 10) || 0;
    // Animate from current to target over 1 second
    const controls = animate(count, end, { duration: 1 });
    return controls.stop;
  }, [value, count]);

  return <Motion.span>{rounded}</Motion.span>;
};

/**
 * AdminDashboard Component
 * 
 * The main administration hub. Aggregates data from various services
 * to provide a high-level overview of portfolio content and interactions.
 * 
 * @returns {JSX.Element} The rendered dashboard.
 */
const AdminDashboard = () => {
  // --- UI State ---
  const [active, setActive] = useState("Dashboard");
  const [loading, setLoading] = useState(true);

  // --- Statistics State ---
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalSkills, setTotalSkills] = useState(0);
  const [totalExperience, setTotalExperience] = useState(0);
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [totalContacts, setTotalContacts] = useState(0);

  // --- Recent Data Lists ---
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);

  const navigate = useNavigate();

  /**
   * Orchestrates the fetching of all dashboard metrics in parallel.
   * Handles API response variations to ensure robust data mapping.
   */
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

        // Mapping responses based on API structure (handling nested 'data' wrappers where present)
        setTotalProjects(projectsRes.data?.total_projects || projectsRes.total_projects || 0);
        setTotalSkills(skillsRes.data?.grand_total || 0);
        setTotalExperience(experienceRes.years_of_experience || 0);
        setTotalCertificates(certificatesRes.data?.total_certificates || 0);
        setTotalContacts(contactsRes.data?.total_contacts || 0);

        // Setting recent data arrays with fallback to empty arrays
        setRecentProjects(
          Array.isArray(recentProjectsRes.projects) ? recentProjectsRes.projects : []
        );
        setRecentContacts(
          Array.isArray(recentContactsRes.data) ? recentContactsRes.data : []
        );
      } catch (error) {
        console.error("Dashboard: All-Stats fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  /**
   * Configuration for the top metric cards.
   * Centralizing this allows for easy additions or reordering.
   */
  const stats = [
    {
      title: "Projects",
      count: totalProjects,
      icon: <Folder />,
      color: "blue",
      path: "/admin/projects",
      subtitle: "Total Projects",
    },
    {
      title: "Skills",
      count: totalSkills,
      icon: <Code />,
      color: "green",
      path: "/admin/skills",
      subtitle: "Competencies",
    },
    {
      title: "Experience",
      count: totalExperience,
      icon: <Briefcase />,
      color: "purple",
      path: "/admin/experience",
      subtitle: "Years Active",
    },
    {
      title: "Certificates",
      count: totalCertificates,
      icon: <Award />,
      color: "orange",
      path: "/admin/certificates",
      subtitle: "Achievements",
    },
    {
      title: "Messages",
      count: totalContacts,
      icon: <Mail />,
      color: "pink",
      path: "/admin/contacts",
      subtitle: "Inbox",
    },
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        <AnimatePresence mode="wait">
          {loading ? (
            /* Loading State: Atom Indicator */
            <Motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", minHeight: "80vh" }}
            >
              <Atom color="#4f46e5" size="medium" text="" textColor="" />
            </Motion.div>
          ) : (
            /* Main Content State */
            <Motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Dashboard Header */}
              <Motion.div className="dashboard-header" variants={itemVariants}>
                <h1>Dashboard Overview</h1>
                <p>Welcome back! Here's what's happening efficiently.</p>
              </Motion.div>

              {/* Top Statistics Grid: Interactive cards for navigation */}
              <Motion.div className="stats-grid" variants={containerVariants}>
                {stats.map((stat, index) => (
                  <Motion.div
                    key={index}
                    className={`stat-card ${stat.color}`}
                    onClick={() => navigate(stat.path)}
                    variants={itemVariants}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {stat.icon}
                    <div>
                      <h2><AnimatedNumber value={stat.count} /></h2>
                      <p>{stat.subtitle}</p>
                    </div>
                  </Motion.div>
                ))}
              </Motion.div>

              {/* Data Detail Section: Recent activity logs */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>

                {/* Recent Projects Table Preview */}
                <Motion.div className="card" variants={itemVariants}>
                  <div className="card-header">
                    <h2>Recent Projects</h2>
                    <button className="view-all" onClick={() => navigate("/admin/projects")}>
                      View All <ChevronRight size={16} style={{ marginLeft: 4, verticalAlign: 'middle' }} />
                    </button>
                  </div>

                  <table className="projects-table">
                    <thead>
                      <tr>
                        <th>Project Name</th>
                        <th>Category</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentProjects.length > 0 ? (
                        recentProjects.slice(0, 5).map((project) => (
                          <Motion.tr
                            key={project.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td>{project.title}</td>
                            <td>{project.category?.name || "—"}</td>
                            <td>
                              <span className={`status ${project.status?.toLowerCase() || 'pending'}`}>
                                {project.status ? project.status.replace(/_/g, " ") : "Unknown"}
                              </span>
                            </td>
                          </Motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
                            No recent projects found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Motion.div>

                {/* Recent Contact Messages Feed */}
                <Motion.div className="card" variants={itemVariants}>
                  <div className="card-header">
                    <h2>Recent Messages</h2>
                    <button className="view-all" onClick={() => navigate("/admin/contacts")}>
                      View All <ChevronRight size={16} style={{ marginLeft: 4, verticalAlign: 'middle' }} />
                    </button>
                  </div>

                  <div className="messages-list">
                    {recentContacts.length > 0 ? (
                      recentContacts.slice(0, 5).map((contact) => (
                        <div className="message" key={contact.id}>
                          <div className="message-content">
                            <div className="message-header">
                              <strong>{contact.name || "Anonymous"}</strong>
                              <span className="dot"></span>
                              <p className="message-date">
                                {contact.created_at
                                  ? new Date(contact.created_at).toLocaleDateString()
                                  : "—"}
                              </p>
                            </div>
                            <p className="message-subject">{contact.subject || 'No Subject'}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
                        No recent messages found
                      </p>
                    )}
                  </div>
                </Motion.div>

              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};


export default AdminDashboard;
