import React from "react";
import { FiX, FiExternalLink, FiGithub } from "react-icons/fi";
import "../../../css/admin/ViewProjectModal.css";

const ViewProjectModal = ({ isOpen, onClose, project }) => {
  if (!isOpen || !project) return null;

  const formatDate = (dateStr, fallback = "-") => {
    if (!dateStr) return fallback;
    return new Date(dateStr).toISOString().slice(0, 10);
  };

  const statusColors = {
    active: "status-active",
    completed: "status-completed",
    in_progress: "status-in-progress",
    on_hold: "status-on-hold",
  };

  const techStackList = project?.tech_stack
    ? project.tech_stack.split(",").map((tech) => tech.trim())
    : [];

  return (
    <div className="project-modal-overlay">
      <div className="project-modal-box">
        {/* Modal Header */}
        <div className="project-modal-header">
          <h2>View Project</h2>
          <button className="project-close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {/* Project Details */}
        <p className="project-modal-subtitle">Project Details</p>
        <div className="project-modal-form">
          <label>
            Title
            <input type="text" value={project.title || "Untitled Project"} readOnly />
          </label>

          <label>
            Description
            <textarea
              value={project.description || "No description available"}
              readOnly
              rows={4}
            />
          </label>

          <div className="project-info-grid">
            {/* Tech Stack */}
            <div className="project-info-card">
              <strong>Tech Stack</strong>
              <div className="tech-stack-list">
                {techStackList.length > 0 ? (
                  techStackList.map((tech, idx) => (
                    <span key={idx} className="tech-tag">{tech}</span>
                  ))
                ) : (
                  <p>-</p>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="project-info-card">
              <strong>Category</strong>
              <p>{project.category?.name || "-"}</p>
            </div>

            {/* Status */}
            <div className="project-info-card">
              <strong>Status</strong>
              <span className={`status-badge ${statusColors[project.status] || ""}`}>
                {project.status ? project.status.replace("_", " ") : "Not Specified"}
              </span>
            </div>

            {/* Start Date */}
            <div className="project-info-card">
              <strong>Start Date</strong>
              <p>{formatDate(project.start_date)}</p>
            </div>

            {/* End Date */}
            <div className="project-info-card">
              <strong>End Date</strong>
              <p>{project.end_date ? formatDate(project.end_date) : "Ongoing"}</p>
            </div>
          </div>

          {/* Project Links */}
          <div className="project-links">
            <strong>Project Links</strong>
            <div className="project-links-list">
              {project.live_link ? (
                <a
                  href={project.live_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link-btn"
                >
                  <FiExternalLink /> Live Site
                </a>
              ) : (
                <p>No live link available</p>
              )}

              {project.github_link ? (
                <a
                  href={project.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link-btn"
                >
                  <FiGithub /> GitHub
                </a>
              ) : (
                <p>No GitHub link available</p>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="project-modal-actions">
            <button className="project-btn-cancel" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProjectModal;
