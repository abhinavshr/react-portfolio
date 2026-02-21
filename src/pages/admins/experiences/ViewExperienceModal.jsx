import React, { useEffect, useState, useRef } from "react";
import { X, Briefcase, MapPin, Calendar, AlignLeft, CheckCircle2 } from "lucide-react";
import "../../../css/admin/experiences/AddExperienceModal.css";
import { viewExperienceById } from "../../../services/experienceService";
import Swal from "sweetalert2";
import gsap from "gsap";

/**
 * ViewExperienceModal Component
 * A read-only modal window for viewing the full details of a work experience entry.
 * Includes entrance/exit animations and displays both meta info and responsibilities.
 * 
 * @param {boolean} isOpen - Controls visibility.
 * @param {function} onClose - function to close the modal.
 * @param {string|number} experienceId - ID of the record to fetch and display.
 */
const ViewExperienceModal = ({ isOpen, onClose, experienceId }) => {
  // --- Refs & State ---
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const [experience, setExperience] = useState(null); // Fetched record details
  const [loading, setLoading] = useState(false); // Data fetching state

  /**
   * Animation & Scroll Management
   */
  useEffect(() => {
    if (isOpen) {
      const tl = gsap.timeline();
      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        .fromTo(modalRef.current,
          { scale: 0.9, opacity: 0, y: 30 },
          { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" },
          "-=0.1"
        );
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  /**
   * Gracefully closes the modal.
   */
  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: onClose
    });
    tl.to(modalRef.current, { scale: 0.9, opacity: 0, y: 20, duration: 0.3, ease: "power2.in" })
      .to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.1");
  };

  /**
   * Data Fetching: Retrieves the full experience record via ID.
   */
  useEffect(() => {
    if (!isOpen || !experienceId) return;

    const fetchExperience = async () => {
      try {
        setLoading(true);
        const response = await viewExperienceById(experienceId);
        setExperience(response.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to fetch experience",
          confirmButtonColor: "#6366f1"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [isOpen, experienceId]);

  if (!isOpen) return null;

  return (
    <div className="experience-modal-overlay" ref={overlayRef} onClick={handleClose}>
      <div className="experience-modal-box" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="experience-modal-header">
          <h2>Experience Details</h2>
          <button
            className="experience-close-btn"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="experience-modal-content">
          <p className="experience-modal-subtitle">View the detailed information of this professional experience.</p>

          {loading ? (
            <div className="loading-state">
              <p>Loading details...</p>
            </div>
          ) : experience ? (
            <div className="experience-modal-form">
              <div className="experience-row">
                <div className="experience-form-group">
                  <label><Briefcase size={14} /> Company Name</label>
                  <input type="text" value={experience.company_name} readOnly />
                </div>

                <div className="experience-form-group">
                  <label><CheckCircle2 size={14} /> Role</label>
                  <input type="text" value={experience.role} readOnly />
                </div>
              </div>

              <div className="experience-form-group">
                <label><MapPin size={14} /> Company Location</label>
                <input
                  type="text"
                  value={experience.company_location || "N/A"}
                  readOnly
                />
              </div>

              <div className="experience-row">
                <div className="experience-form-group">
                  <label><Calendar size={14} /> Start Date</label>
                  <input type="text" value={experience.start_date} readOnly />
                </div>

                <div className="experience-form-group">
                  <label><Calendar size={14} /> End Date</label>
                  <input
                    type="text"
                    value={
                      experience.is_current
                        ? "Present"
                        : experience.end_date || "N/A"
                    }
                    readOnly
                  />
                </div>
              </div>

              <label className="experience-checkbox" style={{ cursor: "default" }}>
                <input type="checkbox" checked={experience.is_current} readOnly />
                I currently work here
              </label>

              <div className="experience-form-group">
                <label><AlignLeft size={14} /> Description</label>
                <textarea rows="4" value={experience.description} readOnly />
              </div>

              {experience.responsibilities && experience.responsibilities.length > 0 && (
                <div className="experience-responsibilities">
                  <label>Key Responsibilities</label>
                  {experience.responsibilities.map((resp, index) => (
                    <div key={index} className="responsibility-row">
                      <input
                        type="text"
                        value={resp.responsibility || resp}
                        readOnly
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="no-data-state">
              <p>No experience data found.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="experience-modal-footer">
          <button
            type="button"
            className="experience-btn-cancel"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewExperienceModal;

