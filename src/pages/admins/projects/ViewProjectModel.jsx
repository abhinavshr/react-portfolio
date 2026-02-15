import React, { useRef } from "react";
import {
  X,
  ExternalLink,
  Github,
  Calendar,
  Tag,
  Activity,
  Layers,
  Info
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "../../../css/admin/ViewProjectModal.css";

const ViewProjectModal = ({ isOpen, onClose, project }) => {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  useGSAP(() => {
    if (isOpen) {
      gsap.from(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
      });
      gsap.from(modalRef.current, {
        y: 50,
        scale: 0.95,
        opacity: 0,
        duration: 0.4,
        ease: "back.out(1.7)",
      });
    }
  }, [isOpen]);

  if (!isOpen || !project) return null;

  const formatDate = (dateStr, fallback = "-") => {
    if (!dateStr) return fallback;
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
    <div className="project-modal-overlay" ref={overlayRef} onClick={onClose}>
      <div
        className="project-modal-box"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="project-modal-header">
          <div className="header-title">
            <div className="header-icon-box">
              <Layers size={20} />
            </div>
            <div>
              <h2>Project Overview</h2>
              <p>Details and configuration of your project</p>
            </div>
          </div>
          <button className="project-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="project-modal-content">
          <div className="project-section">
            <div className="section-header">
              <Info size={16} />
              <h3>Basic Information</h3>
            </div>
            <div className="info-field">
              <label>Project Title</label>
              <div className="field-value highlight">{project.title || "Untitled Project"}</div>
            </div>
            <div className="info-field">
              <label>Description</label>
              <div className="field-value textarea">
                {project.description || "No description available"}
              </div>
            </div>
          </div>

          <div className="project-grid-fields">
            <div className="project-section">
              <div className="section-header">
                <Tag size={16} />
                <h3>Metadata</h3>
              </div>
              <div className="grid-2-fields">
                <div className="info-field">
                  <label>Category</label>
                  <div className="field-value">{project.category?.name || "Uncategorized"}</div>
                </div>
                <div className="info-field">
                  <label>Status</label>
                  <span className={`status-badge ${statusColors[project.status] || ""}`}>
                    <span className="status-dot"></span>
                    {project.status ? project.status.replace("_", " ") : "Not Specified"}
                  </span>
                </div>
              </div>
            </div>

            <div className="project-section">
              <div className="section-header">
                <Calendar size={16} />
                <h3>Timeline</h3>
              </div>
              <div className="grid-2-fields">
                <div className="info-field">
                  <label>Start Date</label>
                  <div className="field-value">{formatDate(project.start_date)}</div>
                </div>
                <div className="info-field">
                  <label>End Date</label>
                  <div className="field-value">
                    {project.end_date ? formatDate(project.end_date) : "Ongoing"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="project-section">
            <div className="section-header">
              <Activity size={16} />
              <h3>Technologies</h3>
            </div>
            <div className="tech-stack-container">
              {techStackList.length > 0 ? (
                techStackList.map((tech, idx) => (
                  <span key={idx} className="tech-tag-premium">{tech}</span>
                ))
              ) : (
                <p className="no-data">No technologies listed</p>
              )}
            </div>
          </div>

          <div className="project-section no-border">
            <div className="section-header">
              <ExternalLink size={16} />
              <h3>Resources & Links</h3>
            </div>
            <div className="project-links-grid">
              {project.live_link ? (
                <a
                  href={project.live_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-link-card live"
                >
                  <div className="link-icon"><ExternalLink size={18} /></div>
                  <div className="link-info">
                    <strong>Live Preview</strong>
                    <span>Visit the production site</span>
                  </div>
                </a>
              ) : (
                <div className="link-card-disabled">
                  <ExternalLink size={18} />
                  <span>No live link</span>
                </div>
              )}

              {project.github_link ? (
                <a
                  href={project.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-link-card github"
                >
                  <div className="link-icon"><Github size={18} /></div>
                  <div className="link-info">
                    <strong>Source Code</strong>
                    <span>View on GitHub</span>
                  </div>
                </a>
              ) : (
                <div className="link-card-disabled">
                  <Github size={18} />
                  <span>No repository</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="project-modal-footer">
          <button className="modal-close-action" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProjectModal;
