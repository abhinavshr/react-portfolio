import React, { useEffect, useState, useRef, useCallback } from "react";
import { X, GraduationCap, Calendar, BookOpen, School } from "lucide-react";
import "../../../css/admin/educations/AddEducationModal.css";
import { viewEducationById } from "../../../services/educationService";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * ViewEducationModal Component
 * A read-only modal window for viewing the full details of an education record.
 * Includes entrance/exit animations and displays academic details.
 * 
 * @param {boolean} isOpen - Controls visibility of the modal.
 * @param {function} onClose - function to close the modal.
 * @param {string|number} educationId - ID of the record to fetch and display.
 */
const ViewEducationModal = ({ isOpen, onClose, educationId }) => {
  // --- Refs & State ---
  const [education, setEducation] = useState(null); // Fetched record details
  const [loading, setLoading] = useState(false); // Data fetching state
  const modalRef = useRef(null); // Ref for GSAP animation
  const overlayRef = useRef(null); // Ref for GSAP animation

  /**
   * Gracefully closes the modal with an exit animation.
   */
  const handleClose = useCallback(() => {
    gsap.to(modalRef.current, {
      y: 50,
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      onComplete: onClose
    });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
  }, [onClose]);

  /**
   * Data Fetching: Retrieves the full education record via ID.
   */
  useEffect(() => {
    if (!isOpen || !educationId) return;

    const fetchEducation = async () => {
      try {
        setLoading(true);
        const response = await viewEducationById(educationId);
        setEducation(response.data);
      } catch (error) {
        console.error(error.message || "Failed to fetch education");
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, [isOpen, educationId]);

  /**
   * Animation & Body Scroll Lock
   * Triggers entrance animation when open.
   */
  useGSAP(() => {
    if (isOpen) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(
        modalRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, { dependencies: [isOpen] });

  if (!isOpen) return null;

  return (
    <div className="edu-modal-overlay" ref={overlayRef} onClick={handleClose}>
      <div
        className="edu-modal"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Section */}
        <div className="edu-modal-header">
          <div>
            <h2>Education Details</h2>
            <p>Comprehensive overview of your academic record</p>
          </div>
          <button className="close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        {loading ? (
          <div className="modal-loading">
            <div className="spinner"></div>
            <p>Retrieving education details...</p>
          </div>
        ) : education ? (
          <div className="edu-form view-only">
            <label>
              <div className="label-with-icon"><School size={16} /> Institution</div>
              <input type="text" value={education.institution} readOnly className="read-only-input" />
            </label>

            <div className="two-col">
              <label>
                <div className="label-with-icon"><BookOpen size={16} /> Level</div>
                <input type="text" value={education.level} readOnly className="read-only-input" />
              </label>

              <label>
                <div className="label-with-icon"><GraduationCap size={16} /> Program</div>
                <input type="text" value={education.program} readOnly className="read-only-input" />
              </label>
            </div>

            <div className="two-col">
              <label>
                <div className="label-with-icon"><Calendar size={16} /> Start Year</div>
                <input type="text" value={education.start_year} readOnly className="read-only-input" />
              </label>

              <label>
                <div className="label-with-icon"><Calendar size={16} /> End Year</div>
                <input type="text" value={education.end_year} readOnly className="read-only-input" />
              </label>
            </div>

            <label>
              Board / Affiliation
              <input type="text" value={education.board || "Not specified"} readOnly className="read-only-input" />
            </label>

            <label>
              Description / Notes
              <textarea rows="4" value={education.description || "No additional description provided."} readOnly className="read-only-input" />
            </label>

            {/* Modal Footer / Actions */}
            <div className="edu-actions">
              <button type="button" className="cancel-btn" style={{ background: '#f8fafc', width: '100px' }} onClick={handleClose}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <p className="empty-message">No education details found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewEducationModal;

