import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import "../../../css/admin/educations/AddEducationModal.css";

const AddEducationModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    institution: "",
    level: "",
    program: "",
    startYear: "",
    endYear: "",
    board: "",
    description: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  return (
    <div className="edu-modal-overlay">
      <div className="edu-modal">
        {/* Header */}
        <div className="edu-modal-header">
          <div>
            <h2>Add New Education</h2>
            <p>Add a new education entry to your profile</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="edu-form">
          <label>
            Institution/University *
            <input
              type="text"
              name="institution"
              required
              value={formData.institution}
              onChange={handleChange}
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
              />
            </label>
          </div>

          <label>
            Board
            <input
              type="text"
              name="board"
              placeholder="e.g., State Board"
              value={formData.board}
              onChange={handleChange}
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            />
          </label>

          {/* Actions */}
          <div className="edu-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="add-btn">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEducationModal;
