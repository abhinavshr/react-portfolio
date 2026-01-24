import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import "../../../css/admin/educations/AddEducationModal.css";
import { addEducation } from "../../../services/educationService";
import Swal from "sweetalert2";

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

  if (!isOpen) return null;

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      Swal.fire({ icon: validationError.type, title: validationError.title, text: validationError.text });
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
      onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "Failed to add education",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edu-modal-overlay">
      <div className="edu-modal">
        <div className="edu-modal-header">
          <div>
            <h2>Add New Education</h2>
            <p>Add a new education entry to your profile</p>
          </div>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close modal"
            disabled={loading}
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edu-form">
          <label>
            Institution/University *
            <input
              type="text"
              name="institution"
              required
              value={formData.institution}
              onChange={handleChange}
              disabled={loading}
            />
          </label>

          <div className="two-col">
            <label>
              Level *
              <input
                type="text"
                name="level"
                required
                value={formData.level}
                onChange={handleChange}
                disabled={loading}
              />
            </label>

            <label>
              Program of Study *
              <input
                type="text"
                name="program"
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
                required
                value={formData.endYear}
                onChange={handleChange}
                disabled={loading}
              />
            </label>
          </div>

          <label>
            Board
            <input
              type="text"
              name="board"
              value={formData.board}
              onChange={handleChange}
              disabled={loading}
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
            />
          </label>

          <div className="edu-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="add-btn" disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEducationModal;
