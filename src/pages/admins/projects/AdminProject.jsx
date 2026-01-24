import React, { useEffect, useState, useCallback, useMemo } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import "../../../css/admin/AdminProjects.css";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import { viewAllProjects, viewProjectById, deleteProject } from "../../../services/projectService";
import { useNavigate } from "react-router-dom";
import ViewProjectModal from "./ViewProjectModel";
import Swal from "sweetalert2";
import Pagination from "../../../components/admin/Pagination";
import { motion as Motion } from "framer-motion";

const AdminProjects = () => {
  const [active, setActive] = useState("Projects");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, total: 0, from: 0, to: 0 });

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
        Swal.fire("Deleted!", "Project has been deleted successfully.", "success");
        fetchProjects(pagination.currentPage);
      } catch (error) {
        Swal.fire("Error!", error.message || "Failed to delete project", "error");
      }
    }
  };

  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          project.title?.toLowerCase().includes(search.toLowerCase()) ||
          project.tech_stack?.toLowerCase().includes(search.toLowerCase())
      ),
    [projects, search]
  );

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />
      <main className="admin-content">
        <div className="projects-header">
          <div>
            <h1>Projects</h1>
            <p>Manage all your portfolio projects</p>
          </div>
          <button className="add-project-btn" onClick={() => navigate("/admin/add-project")}>
            + Add Project
          </button>
        </div>
        <div className="search-card">
          <input
            type="text"
            placeholder="Search projects by title or tech stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="table-card">
          {loading ? (
            <div className="empty-state">Loading projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="empty-state">
              <h3>No projects found</h3>
              <p>Try a different search term or add a new project</p>
            </div>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>PROJECT TITLE</th>
                    <th>TECH STACK</th>
                    <th>LIVE</th>
                    <th>GITHUB</th>
                    <th>STATUS</th>
                    <th>START DATE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project, index) => (
                    <Motion.tr
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, boxShadow: "0 0 12px rgba(37,99,235,0.5)" }}
                      className="project-row"
                    >
                      <td className="project-name">
                        <span className="text-clamp">{project.title}</span>
                      </td>
                      <td>
                        <span className="text-clamp tech-clamp">{project.tech_stack}</span>
                      </td>
                      <td>
                        {project.live_link ? (
                          <a href={project.live_link} target="_blank" rel="noreferrer" className="link-btn">
                            Live
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        {project.github_link ? (
                          <a href={project.github_link} target="_blank" rel="noreferrer" className="link-btn github">
                            GitHub
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${statusColors[project.status] || ""}`}>
                          {project.status?.replace("_", " ") || "Not Specified"}
                        </span>
                      </td>
                      <td>{project.start_date ? project.start_date.slice(0, 10) : "-"}</td>
                      <td className="actions">
                        <button className="icon-btn view" title="View" onClick={() => handleViewProject(project.id)}>
                          <FiEye />
                        </button>
                        <button className="icon-btn edit" title="Edit" onClick={() => navigate(`/admin/edit-project/${project.id}`)}>
                          <FiEdit2 />
                        </button>
                        <button className="icon-btn delete" title="Delete" onClick={() => handleDeleteProject(project.id, project.title)}>
                          <FiTrash2 />
                        </button>
                      </td>
                    </Motion.tr>
                  ))}
                </tbody>
              </table>
              <div className="table-footer">
                <div className="table-summary">
                  Showing {pagination.from} to {pagination.to} of {pagination.total} projects
                </div>
                <Pagination currentPage={pagination.currentPage} totalPages={pagination.lastPage} onPageChange={fetchProjects} />
              </div>
            </>
          )}
        </div>
        {showModal && selectedProject && (
          <ViewProjectModal project={selectedProject} isOpen={showModal} onClose={() => setShowModal(false)} />
        )}
      </main>
    </div>
  );
};

export default AdminProjects;
