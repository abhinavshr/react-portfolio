import React, { useState, useRef, useCallback } from "react";
import { X, Plus, GraduationCap } from "lucide-react";
import "../../../css/admin/educations/AddEducationModal.css";
import { addEducation } from "../../../services/educationService";
import Swal from "sweetalert2";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * AddEducationModal Component
 * A modal window for administrators to add new education records.
 * Features: Form validation, layout responsiveness, and GSAP animations.
 * 
 * @param {boolean} isOpen - Controls visibility of the modal.
 * @param {function} onClose - function to close the modal.
 * @param {function} onEducationAdded - Callback to refresh parent list after successful addition.
 */
const AddEducationModal = ({ isOpen, onClose, onEducationAdded }) => {
  // --- Form State ---
  const [formData, setFormData] = useState({
    institution: "",
    level: "",
    program: "",
    startYear: "",
    endYear: "",
    board: "",
    description: "",
  });

  const [loading, setLoading] = useState(false); // Submission state
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

  /**
   * Updates form state on input change.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Resets form to its initial state.
   */
  const resetForm = () => {
    setFormData({
      institution: "",
      level: "",
      program: "",
      startYear: "",
      endYear: "",
      board: "",
      description: "",
    });
  };

  /**
   * Validates form fields before submission.
   * @returns {Object|null} Error details or null if valid.
   */
  const validateForm = () => {
    if (!formData.institution.trim() || !formData.level.trim() || !formData.program.trim()) {
      return { type: "warning", title: "Missing Fields", text: "Please fill in all required fields." };
    }
    if (formData.startYear && formData.endYear && Number(formData.endYear) < Number(formData.startYear)) {
      return { type: "error", title: "Invalid Years", text: "End year must be greater than or equal to start year." };
    }
    return null;
  };

  if (!isOpen) return null;

  /**
   * Handles the submission of the entire education entry.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      Swal.fire({
        icon: validationError.type,
        title: validationError.title,
        text: validationError.text,
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    const payload = {
      institution: formData.institution,
      level: formData.level,
      program: formData.program,
      board: formData.board,
      start_year: formData.startYear,
      end_year: formData.endYear,
      description: formData.description,
    };

    try {
      setLoading(true);
      const response = await addEducation(payload);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Education added successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      resetForm();
      onEducationAdded?.(response);
      handleClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "Failed to add education",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setLoading(false);
    }
  };

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
            <h2>Add New Education</h2>
            <p>Showcase your academic background and achievements</p>
          </div>
          <button
            className="close-btn"
            onClick={handleClose}
            aria-label="Close modal"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Form Fields */}
        <form onSubmit={handleSubmit} className="edu-form">
          <label>
            Institution / University *
            <input
              type="text"
              name="institution"
              placeholder="e.g. Stanford University"
              required
              value={formData.institution}
              onChange={handleChange}
              disabled={loading}
            />
          </label>

          <div className="two-col">
            <label>
              Level of Education *
              <input
                type="text"
                name="level"
                placeholder="e.g. Bachelor's"
                required
                value={formData.level}
                onChange={handleChange}
                disabled={loading}
              />
            </label>

            <label>
              Program / Major *
              <input
                type="text"
                name="program"
                placeholder="e.g. Computer Science"
                required
                value={formData.program}
                onChange={handleChange}
                disabled={loading}
              />
            </label>
          </div>

          <div className="two-col">
            <label>
              Start Year *
              <input
                type="number"
                name="startYear"
                placeholder="YYYY"
                required
                value={formData.startYear}
                onChange={handleChange}
                disabled={loading}
              />
            </label>

            <label>
              End Year *
              <input
                type="number"
                name="endYear"
                placeholder="YYYY (or expected)"
                required
                value={formData.endYear}
                onChange={handleChange}
                disabled={loading}
              />
            </label>
          </div>

          <label>
            Board / Affiliation
            <input
              type="text"
              name="board"
              placeholder="e.g. Oxford Board"
              value={formData.board}
              onChange={handleChange}
              disabled={loading}
            />
          </label>

          <label>
            Additional Description
            <textarea
              name="description"
              rows="4"
              placeholder="Mention honors, GPA, or key projects..."
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
            />
          </label>

          {/* Modal Footer / Actions */}
          <div className="edu-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="add-btn" disabled={loading}>
              {loading ? (
                "Adding..."
              ) : (
                <>
                  <Plus size={18} />
                  Add Education
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEducationModal;

