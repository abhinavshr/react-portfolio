import React, { useState, useRef, useCallback } from "react";
import { X, Plus, GraduationCap } from "lucide-react";
import "../../../css/admin/educations/AddEducationModal.css";
import { addEducation } from "../../../services/educationService";
import Swal from "sweetalert2";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const AddEducationModal = ({ isOpen, onClose, onEducationAdded }) => {
  const [formData, setFormData] = useState({
    institution: "",
    level: "",
    program: "",
    startYear: "",
    endYear: "",
    board: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

