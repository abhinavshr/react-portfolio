import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import "../../../css/admin/AdminProjects.css";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import { viewAllProjects, viewProjectById } from "../../../services/projectService";
import { useNavigate } from "react-router-dom";
import ViewProjectModal from "./ViewProjectModel";

const AdminProjects = () => {
  const [active, setActive] = useState("Projects");
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const statusColors = {
    active: "status-active",
    completed: "status-completed",
    in_progress: "status-in-progress",
    on_hold: "status-on-hold",
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await viewAllProjects();
      setProjects(data.projects || data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

const handleViewProject = async (id) => {
  try {
    const response = await viewProjectById(id);
    
    let projectData;
    if (response.project) {
      projectData = response.project;
    } else if (response.data) {
      projectData = response.data;
    } else {
      projectData = response;
    }
    
    setSelectedProject(projectData);
    setShowModal(true);
  } catch (error) {
    console.error("Error fetching project:", error);
  }
};

  const filteredProjects = projects.filter(
    (project) =>
      project.title?.toLowerCase().includes(search.toLowerCase()) ||
      project.tech_stack?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        {/* Header */}
        <div className="projects-header">
          <div>
            <h1>Projects</h1>
            <p>Manage all your portfolio projects</p>
          </div>

          <button
            className="add-project-btn"
            onClick={() => navigate("/admin/add-project")}
          >
            + Add Project
          </button>
        </div>

        {/* Search */}
        <div className="search-card">
          <input
            type="text"
            placeholder="Search projects by title or tech stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="table-card">
          {loading ? (
            <div className="empty-state">Loading projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="empty-state">
              <h3>No projects found</h3>
            </div>
          ) : (
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
                {filteredProjects.map((project) => (
                  <tr key={project.id}>
                    <td className="project-name">{project.title}</td>
                    <td>{project.tech_stack}</td>

                    <td>
                      {project.live_link ? (
                        <a
                          href={project.live_link}
                          target="_blank"
                          rel="noreferrer"
                          className="link-btn"
                        >
                          Live
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      {project.github_link ? (
                        <a
                          href={project.github_link}
                          target="_blank"
                          rel="noreferrer"
                          className="link-btn github"
                        >
                          GitHub
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${statusColors[project.status]}`}
                      >
                        {project.status.replace("_", " ")}
                      </span>
                    </td>

                    <td>
                      {project.start_date
                        ? project.start_date.slice(0, 10)
                        : "-"}
                    </td>

                    <td className="actions">
                      <button
                        className="icon-btn view"
                        title="View"
                        onClick={() => handleViewProject(project.id)}
                      >
                        <FiEye />
                      </button>

                      <button
                        className="icon-btn edit"
                        title="Edit"
                        onClick={() =>
                          navigate(`/admin/edit-project/${project.id}`)
                        }
                      >
                        <FiEdit2 />
                      </button>

                      <button className="icon-btn delete" title="Delete">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* View Modal */}
        {showModal && selectedProject && (
          <ViewProjectModal
            project={selectedProject}
            onClose={() => setShowModal(false)}
            statusColors={statusColors}
          />
        )}

      </main>
    </div>
  );
};

export default AdminProjects;
