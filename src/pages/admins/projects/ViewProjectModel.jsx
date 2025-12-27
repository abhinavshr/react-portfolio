import React from "react";
import { FiExternalLink, FiGithub, FiCalendar, FiCode, FiFolder, FiClock, FiGlobe } from "react-icons/fi";
import "../../../css/admin/ViewProjectModal.css";

const ViewProjectModal = ({ project, onClose, statusColors }) => {
  if (!project) return null;

  // Format tech stack into array if it's a string
  const techStackArray = project.tech_stack 
    ? project.tech_stack.split(',').map(tech => tech.trim())
    : [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>{project.title}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Description */}
        <div className="modal-description">
          <span className="description-label">Description</span>
          <div className="description-content">
            {project.description || "No description available"}
          </div>
        </div>

        {/* Project Details Grid */}
        <div className="modal-grid">
          {/* Tech Stack */}
          <div className="modal-grid-item">
            <strong>
              <FiCode style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Tech Stack
            </strong>
            {techStackArray.length > 0 ? (
              <div className="tech-stack-list">
                {techStackArray.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
            ) : (
              <p>-</p>
            )}
          </div>

          {/* Category */}
          <div className="modal-grid-item">
            <strong>
              <FiFolder style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Category
            </strong>
            <p>{project.category?.name || project.category || "-"}</p>
          </div>

          {/* Status */}
          <div className="modal-grid-item">
            <strong>
              <FiClock style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Status
            </strong>
            <span
              className={`status-badge ${
                project.status ? statusColors[project.status] : "status-in-progress"
              }`}
            >
              {project.status ? project.status.replace("_", " ") : "Not Specified"}
            </span>
          </div>

          {/* Start Date */}
          <div className="modal-grid-item">
            <strong>
              <FiCalendar style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Start Date
            </strong>
            <p className="date-item">
              {project.start_date?.slice(0, 10) || "-"}
            </p>
          </div>

          {/* End Date */}
          <div className="modal-grid-item">
            <strong>
              <FiCalendar style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              End Date
            </strong>
            <p className="date-item">
              {project.end_date?.slice(0, 10) || "Ongoing"}
            </p>
          </div>
        </div>

        {/* Project Links */}
        <div className="modal-links-section">
          <span className="links-label">Project Links</span>
          <div className="modal-links">
            {project.live_link && (
              <a href={project.live_link} target="_blank" rel="noreferrer">
                <FiGlobe /> Live Site
              </a>
            )}
            {project.github_link && (
              <a href={project.github_link} target="_blank" rel="noreferrer">
                <FiGithub /> GitHub Repository
              </a>
            )}
            {!project.live_link && !project.github_link && (
              <p style={{ color: '#999', fontStyle: 'italic' }}>
                No links available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProjectModal;