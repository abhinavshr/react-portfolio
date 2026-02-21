import React, { useState, useEffect, useRef } from "react";
import { X, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import "../../../css/admin/softskills/AddSoftSkillModal.css";
import { getSoftSkillById, updateSoftSkill } from "../../../services/softSkillService";
import { gsap } from "gsap";

/**
 * EditSoftSkillModal Component
 * 
 * Provides a modal interface to edit an existing soft skill.
 * Fetches the current skill data upon opening and allows the user to update it.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {Function} props.onClose - Callback function to close the modal.
 * @param {number|string} props.skillId - The ID of the skill being edited.
 * @param {Function} props.onSkillUpdated - Callback function triggered after a successful update.
 * @returns {JSX.Element|null} The rendered modal or null if not open.
 */
const EditSoftSkillModal = ({ isOpen, onClose, skillId, onSkillUpdated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState(50);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  // Fetch skill data and manage modal animations
  useEffect(() => {
    if (skillId && isOpen) {
      const fetchSkill = async () => {
        try {
          setFetching(true);
          const response = await getSoftSkillById(skillId);
          const skill = response.data;

          // Populate form with existing data
          setName(skill.name || "");
          setDescription(skill.description || "");
          setLevel(skill.level ?? 50);

          // Entrance animation
          gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
          gsap.fromTo(
            modalRef.current,
            { opacity: 0, scale: 0.9, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
          );
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message || "Failed to fetch skill data",
          });
          onClose(); // Close modal on error
        } finally {
          setFetching(false);
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

  /**
   * Handles the update submission for the soft skill.
   * 
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim() || !description.trim()) {
      Swal.fire("Warning", "Name and description are required.", "warning");
      return;
    }

    try {
      setLoading(true);
      const response = await updateSoftSkill(skillId, { name, description, level });

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Soft skill updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      onSkillUpdated?.(response);
      handleClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "Failed to update soft skill",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="softskill-modal-overlay" ref={overlayRef} onClick={(e) => e.target === overlayRef.current && handleClose()}>
      <div className="softskill-modal-box" ref={modalRef}>
        <div className="softskill-modal-header">
          <h2>Edit Soft Skill</h2>
          <button
            className="softskill-close-btn"
            onClick={handleClose}
            aria-label="Close modal"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {fetching ? (
          // Loading spinner during data retrieval
          <div className="flex items-center justify-center p-12 text-blue-500">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : (
          <>
            <p className="softskill-modal-subtitle">Update the soft skill details to reflect your growth</p>

            <form className="softskill-modal-form" onSubmit={handleSubmit}>
              <label>
                Soft Skill Name *
                <input
                  type="text"
                  placeholder="e.g., Time Management"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </label>

              <label>
                Description *
                <textarea
                  placeholder="Enter details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                  disabled={loading}
                />
              </label>

              <label>
                Proficiency Level (0–100%) *
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  onBlur={() => {
                    const clean = Math.max(0, Math.min(100, Number(level)));
                    setLevel(isNaN(clean) ? 50 : clean);
                  }}
                  required
                  disabled={loading}
                />
              </label>

              {/* Slider for Proficiency Level UX */}
              <div className="softskill-level-slider-wrapper">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className="softskill-level-slider"
                  style={{ "--percent": `${level}%` }}
                  disabled={loading}
                />
                <span className="softskill-level-percent">{level}%</span>
              </div>

              <div className="softskill-modal-actions">
                <button
                  type="button"
                  className="softskill-btn-cancel"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="softskill-btn-add"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Soft Skill"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EditSoftSkillModal;
