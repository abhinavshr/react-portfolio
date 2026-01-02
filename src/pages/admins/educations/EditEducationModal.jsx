import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import "../../../css/admin/educations/AddEducationModal.css";
import { viewEducationById, updateEducation } from "../../../services/educationService";

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

  useEffect(() => {
    if (!isOpen || !educationId) return;

    const fetchEducation = async () => {
      try {
        setLoading(true);
        const response = await viewEducationById(educationId);
        const edu = response.data;

        setFormData({
          institution: edu.institution,
          level: edu.level,
          program: edu.program,
          startYear: edu.start_year,
          endYear: edu.end_year,
          board: edu.board || "",
          description: edu.description || "",
        });
      } catch (error) {
        alert(error.message || "Failed to fetch education");
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, [isOpen, educationId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      alert("Education updated successfully!");
      if (onEducationUpdated) onEducationUpdated(response);
      onClose();
    } catch (error) {
      alert(error.message || "Failed to update education");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edu-modal-overlay">
      <div className="edu-modal">
        <div className="edu-modal-header">
          <div>
            <h2>Edit Education</h2>
            <p>Update your education details</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <form className="edu-form" onSubmit={handleSubmit}>
            <label>
              Institution/University *
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                required
              />
            </label>

            <div className="two-col">
              <label>
                Level *
                <input
                  type="text"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Program of Study *
                <input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  required
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
              />
            </label>

            <label>
              Description
              <textarea
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </label>

            <div className="edu-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="add-btn" disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditEducationModal;
