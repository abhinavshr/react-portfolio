import React, { useEffect, useState, useRef, useCallback } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import "../../../css/admin/educations/AddEducationModal.css";
import { viewEducationById, updateEducation } from "../../../services/educationService";
import Swal from "sweetalert2";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const EditEducationModal = ({ isOpen, onClose, educationId, onEducationUpdated }) => {
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

  useEffect(() => {
    if (!isOpen || !educationId) return;

    const fetchEducation = async () => {
      try {
        setLoading(true);
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
        setLoading(false);
      }
    };

    fetchEducation();
  }, [isOpen, educationId, handleClose]);

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

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      setLoading(true);
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
            <h2>Edit Education</h2>
            <p>Modify your academic experience details</p>
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

        {loading && !formData.institution ? (
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
                placeholder="e.g. Stanford University"
                value={formData.institution}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </label>

            <div className="two-col">
              <label>
                Level of Education *
                <input
                  type="text"
                  name="level"
                  placeholder="e.g. Master's"
                  value={formData.level}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </label>

              <label>
                Program / Major *
                <input
                  type="text"
                  name="program"
                  placeholder="e.g. Software Engineering"
                  value={formData.program}
                  onChange={handleChange}
                  required
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
                  value={formData.startYear}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </label>

              <label>
                End Year *
                <input
                  type="number"
                  name="endYear"
                  placeholder="YYYY (or expected)"
                  value={formData.endYear}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </label>
            </div>

            <label>
              Board / Affiliation
              <input
                type="text"
                name="board"
                placeholder="e.g. National Board"
                value={formData.board}
                onChange={handleChange}
                disabled={loading}
              />
            </label>

            <label>
              Additional Description
              <textarea
                rows="4"
                name="description"
                placeholder="Details about your studies..."
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

