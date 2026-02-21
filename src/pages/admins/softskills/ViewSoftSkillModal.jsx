import React, { useEffect, useState, useRef } from "react";
import { X, Loader2 } from "lucide-react";
import "../../../css/admin/softskills/AddSoftSkillModal.css";
import { getSoftSkillById } from "../../../services/softSkillService";
import { gsap } from "gsap";

/**
 * ViewSoftSkillModal Component
 * 
 * Provides a read-only modal interface to view details of a specific soft skill.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {Function} props.onClose - Callback function to close the modal.
 * @param {number|string} props.skillId - The ID of the skill to view.
 * @returns {JSX.Element|null} The rendered modal or null if not open.
 */
const ViewSoftSkillModal = ({ isOpen, onClose, skillId }) => {
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  // Fetch skill data and manage modal animations
  useEffect(() => {
    if (skillId && isOpen) {
      const fetchSkill = async () => {
        try {
          setLoading(true);
          const response = await getSoftSkillById(skillId);
          setSkill(response.data);

          // Entrance animation
          gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
          gsap.fromTo(
            modalRef.current,
            { opacity: 0, scale: 0.9, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
          );
        } catch (error) {
          console.error("Error fetching soft skill:", error);
          onClose();
        } finally {
          setLoading(false);
        }
      };
      fetchSkill();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [skillId, isOpen, onClose]);

  if (!isOpen) return null;

  /**
   * Closes the modal with a leave animation.
   */
  const handleClose = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 20,
      duration: 0.3,
      onComplete: onClose,
    });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
  };

  return (
    <div className="softskill-modal-overlay" ref={overlayRef} onClick={(e) => e.target === overlayRef.current && handleClose()}>
      <div className="softskill-modal-box" ref={modalRef}>
        <div className="softskill-modal-header">
          <h2>Soft Skill Details</h2>
          <button className="softskill-close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {loading ? (
          // Spinner for data loading state
          <div className="flex items-center justify-center p-12 text-blue-500">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : (
          <>
            <p className="softskill-modal-subtitle">Reviewing your professional soft skill</p>

            <div className="softskill-modal-form">
              <label>
                Name
                <input type="text" value={skill.name} readOnly />
              </label>

              <label>
                Description
                <textarea value={skill.description} readOnly rows={4} />
              </label>

              <label>
                Proficiency Level
              </label>
              {/* Visual representation of proficiency - read-only */}
              <div className="softskill-level-slider-wrapper">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={skill.level}
                  readOnly
                  className="softskill-level-slider"
                  style={{ "--percent": `${skill.level}%` }}
                />
                <span className="softskill-level-percent">{skill.level}%</span>
              </div>

              <div className="softskill-modal-actions">
                <button type="button" className="softskill-btn-cancel" onClick={handleClose}>
                  Done
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewSoftSkillModal;
