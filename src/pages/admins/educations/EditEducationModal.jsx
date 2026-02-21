import React, { useEffect, useState, useRef, useCallback } from "react";
import { X, Save } from "lucide-react";
import "../../../css/admin/educations/AddEducationModal.css";
import { viewEducationById, updateEducation } from "../../../services/educationService";
import Swal from "sweetalert2";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * EditEducationModal Component
 * Facilitates the editing of an existing education record.
 * Handles data fetching on open and form submission for updates.
 * 
 * @param {boolean} isOpen - Controls visibility of the modal.
 * @param {function} onClose - function to close the modal.
 * @param {string|number} educationId - ID of the education record to edit.
 * @param {function} onEducationUpdated - Callback to refresh data in parent component.
 */
const EditEducationModal = ({ isOpen, onClose, educationId, onEducationUpdated }) => {
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

  const [fetching, setFetching] = useState(false); // Initial data load state
  const [saving, setSaving] = useState(false); // Update submission state

  const modalRef = useRef(null); // Ref for GSAP animation
  const overlayRef = useRef(null); // Ref for GSAP animation

  /**
   * Gracefully closes the modal with an exit animation.
   */
  const handleClose = useCallback(() => {
    if (saving) return; // Prevent closing while saving

    if (!modalRef.current || !overlayRef.current) {
      onClose?.();
      return;
    }

    gsap.to(modalRef.current, {
      y: 50,
      opacity: 0,
      scale: 0.95,
      duration: 0.25,
      onComplete: onClose,
    });

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.25,
    });
  }, [onClose, saving]);

  /**
   * Data Fetching: Retrieves existing education details when opened.
   */
  useEffect(() => {
    if (!isOpen || !educationId) return;

    const fetchEducation = async () => {
      try {
        setFetching(true);
        const response = await viewEducationById(educationId);
        const edu = response.data;

        setFormData({
          institution: edu.institution || "",
          level: edu.level || "",
          program: edu.program || "",
          startYear: edu.start_year || "",
          endYear: edu.end_year || "",
          board: edu.board || "",
          description: edu.description || "",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Fetch Failed",
          text: error.message || "Could not retrieve education details",
          confirmButtonColor: "#2563eb",
        });
        handleClose();
      } finally {
        setFetching(false);
      }
    };

    fetchEducation();
  }, [isOpen, educationId, handleClose]);

  /**
   * Accessibility: Close on Escape key
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, handleClose]);

  /**
   * Animation & Body Scroll Lock
   * Triggers entrance animation when open.
   */
  useGSAP(
    () => {
      if (!isOpen || !modalRef.current || !overlayRef.current) return;

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25 }
      );

      gsap.fromTo(
        modalRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: "back.out(1.7)",
        }
      );
    },
    { dependencies: [isOpen] }
  );

  if (!isOpen) return null;

  /**
   * Updates form state on input change.
   */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * Validates form fields before submission.
   * @returns {Object|null} Error details or null if valid.
   */
  const validateForm = () => {
    if (!formData.institution.trim() || !formData.level.trim() || !formData.program.trim()) {
      return {
        type: "warning",
        title: "Missing Fields",
        text: "Please fill in all required fields.",
      };
    }

    if (
      formData.startYear &&
      formData.endYear &&
      Number(formData.endYear) < Number(formData.startYear)
    ) {
      return {
        type: "error",
        title: "Invalid Years",
        text: "End year must be greater than or equal to start year.",
      };
    }

    return null;
  };

  /**
   * Handles the submission of the updated education entry.
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
      start_year: formData.startYear,
      end_year: formData.endYear,
      board: formData.board,
      description: formData.description,
    };

    try {
      setSaving(true);
      const response = await updateEducation(educationId, payload);

      Swal.fire({
        icon: "success",
        title: "Record Updated",
        text: "Your education details have been saved.",
        timer: 1500,
        showConfirmButton: false,
      });

      onEducationUpdated?.(response);
      handleClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error?.message || "Could not save your changes",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="edu-modal-overlay"
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      <div
        className="edu-modal"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Section */}
        <div className="edu-modal-header">
          <div>
            <h2>Edit Education</h2>
            <p>Modify your academic experience details</p>
          </div>

          <button
            className="close-btn"
            onClick={handleClose}
            aria-label="Close modal"
            disabled={saving}
          >
            <X size={20} />
          </button>
        </div>

        {/* Conditional Rendering: Loading or Form */}
        {fetching ? (
          <div className="modal-loading">
            <div className="spinner"></div>
            <p>Loading details...</p>
          </div>
        ) : (
          <form className="edu-form" onSubmit={handleSubmit}>
            <label>
              Institution / University *
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                required
                disabled={saving}
              />
            </label>

            <div className="two-col">
              <label>
                Level of Education *
                <input
                  type="text"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
              </label>

              <label>
                Program / Major *
                <input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
              </label>
            </div>

            <div className="two-col">
              <label>
                Start Year *
                <input
                  type="number"
                  name="startYear"
                  value={formData.startYear}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
              </label>

              <label>
                End Year *
                <input
                  type="number"
                  name="endYear"
                  value={formData.endYear}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
              </label>
            </div>

            <label>
              Board / Affiliation
              <input
                type="text"
                name="board"
                value={formData.board}
                onChange={handleChange}
                disabled={saving}
              />
            </label>

            <label>
              Additional Description
              <textarea
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={saving}
              />
            </label>

            {/* Modal Footer / Actions */}
            <div className="edu-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleClose}
                disabled={saving}
              >
                Cancel
              </button>

              <button type="submit" className="add-btn" disabled={saving}>
                {saving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditEducationModal;
