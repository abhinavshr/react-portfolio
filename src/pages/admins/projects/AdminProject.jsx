import React, { useEffect, useState, useCallback, useMemo } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import "../../../css/admin/AdminProjects.css";
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  ExternalLink,
  Github,
  Layout
} from "lucide-react";
import {
  viewAllProjects,
  viewProjectById,
  deleteProject,
} from "../../../services/projectService";
import { useNavigate } from "react-router-dom";
import ViewProjectModal from "./ViewProjectModel";
import Swal from "sweetalert2";
import Pagination from "../../../components/admin/Pagination";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Skeleton = ({ className }) => (
  <div className={`skeleton ${className || ""}`} />
);

const SkeletonRow = () => (
  <tr>
    {Array.from({ length: 7 }).map((_, i) => (
      <td key={i}>
        <Skeleton className="skeleton-text" />
      </td>
    ))}
  </tr>
);

const AdminProjects = () => {
  const [active, setActive] = useState("Projects");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const containerRef = React.useRef(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  const navigate = useNavigate();

  const statusColors = useMemo(
    () => ({
      active: "status-active",
      completed: "status-completed",
      in_progress: "status-in-progress",
      on_hold: "status-on-hold",
    }),
    []
  );

  const fetchProjects = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await viewAllProjects(page);
      setProjects(response.projects?.data || []);
      setPagination({
        currentPage: response.projects.current_page,
        lastPage: response.projects.last_page,
        total: response.projects.total,
        from: response.projects.from,
        to: response.projects.to,
      });
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleViewProject = async (id) => {
    try {
      const response = await viewProjectById(id);
      setSelectedProject(response.project);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProject = async (id, title) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${title}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteProject(id);
        Swal.fire(
          "Deleted!",
          "Project has been deleted successfully.",
          "success"
        );
        fetchProjects(pagination.currentPage);
      } catch (error) {
        Swal.fire(
          "Error!",
          error.message || "Failed to delete project",
          "error"
        );
      }
    }
  };

  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.title
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          project.tech_stack
            ?.toLowerCase()
            .includes(search.toLowerCase())
      ),
    [projects, search]
  );

  useGSAP(() => {
    if (!loading) {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.8 }
      });

      tl.fromTo(".projects-header",
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1 }
      );

      tl.fromTo(".search-card",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1 },
        "-=0.6"
      );

      tl.fromTo(".table-card",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          clearProps: "transform,opacity"
        },
        "-=0.4"
      );
    }
  }, { dependencies: [loading], scope: containerRef });

  return (
    <div className="admin-layout" ref={containerRef}>
      <AdminSidebar active={active} setActive={setActive} />
      <main className="admin-content">
        <div className="projects-container">
          <div className="projects-header">
            <div>
              <div className="title-with-icon">
                <Layout className="header-icon" />
                <h1>Projects</h1>
              </div>
              <p>Manage and showcase your professional portfolio projects</p>
            </div>
            <button
              className="add-project-btn"
              onClick={() => navigate("/admin/add-project")}
            >
              <Plus size={18} /> Add Project
            </button>
          </div>

          <div className="search-card">
            <div className="search-wrapper">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search projects by title or tech stack..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-card">
            {loading ? (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Project Title</th>
                      <th>Tech Stack</th>
                      <th>Links</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <SkeletonRow key={i} />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="empty-state">
                <Layout size={48} className="empty-icon" />
                <h3>No projects found</h3>
                <p>Try a different search term or add a new project to your portfolio</p>
                <button
                  className="add-project-btn secondary"
                  onClick={() => setSearch("")}
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Project Title</th>
                      <th>Tech Stack</th>
                      <th>Links</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="project-row">
                        <td className="project-name-cell">
                          <div className="project-info">
                            <span className="project-title-text">{project.title}</span>
                          </div>
                        </td>
                        <td>
                          <div className="tech-stack-badges">
                            {project.tech_stack?.split(',').slice(0, 2).map((tech, i) => (
                              <span key={i} className="tech-badge-mini">{tech.trim()}</span>
                            ))}
                            {project.tech_stack?.split(',').length > 2 && (
                              <span className="tech-badge-more">+{project.tech_stack.split(',').length - 2}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="action-links">
                            {project.live_link && (
                              <a href={project.live_link} target="_blank" rel="noreferrer" title="Live Site">
                                <ExternalLink size={16} />
                              </a>
                            )}
                            {project.github_link && (
                              <a href={project.github_link} target="_blank" rel="noreferrer" title="GitHub Repo">
                                <Github size={16} />
                              </a>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${statusColors[project.status] || ""}`}>
                            <span className="status-dot"></span>
                            {project.status?.replace("_", " ") || "Not Specified"}
                          </span>
                        </td>
                        <td className="date-cell">
                          {project.start_date ? project.start_date.slice(0, 10) : "-"}
                        </td>
                        <td className="actions-cell">
                          <div className="action-buttons">
                            <button
                              className="action-btn view"
                              onClick={() => handleViewProject(project.id)}
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="action-btn edit"
                              onClick={() => navigate(`/admin/edit-project/${project.id}`)}
                              title="Edit Project"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => handleDeleteProject(project.id, project.title)}
                              title="Delete Project"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="table-footer">
                  <div className="table-summary">
                    Showing <span>{pagination.from || 0}</span> to <span>{pagination.to || 0}</span> of <span>{pagination.total}</span> projects
                  </div>
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.lastPage}
                    onPageChange={fetchProjects}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {showModal && selectedProject && (
          <ViewProjectModal
            project={selectedProject}
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        )}
      </main>
    </div>
  );
};

export default AdminProjects;
