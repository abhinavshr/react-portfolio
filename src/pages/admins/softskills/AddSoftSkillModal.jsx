import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import Swal from "sweetalert2";
import "../../../css/admin/softskills/AddSoftSkillModal.css";
import { addSoftSkill } from "../../../services/softSkillService";

const AddSoftSkillModal = ({ isOpen, onClose, onSkillAdded }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState(50);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setName("");
    setDescription("");
    setLevel(50);
  };

  const validateForm = () => {
    if (!name.trim()) {
      return { type: "warning", title: "Missing Field", text: "Soft skill name is required." };
    }
    if (!description.trim()) {
      return { type: "warning", title: "Missing Field", text: "Description is required." };
    }
    if (level < 0 || level > 100) {
      return { type: "error", title: "Invalid Level", text: "Level must be between 0 and 100." };
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

    try {
      setLoading(true);
      const response = await addSoftSkill({ name, description, level });

      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "Soft skill added successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      resetForm();
      onSkillAdded?.(response);
      onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.message || "Failed to add soft skill",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="softskill-modal-overlay">
      <div className="softskill-modal-box">
        <div className="softskill-modal-header">
          <h2>Add Soft Skill</h2>
          <button
            className="softskill-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            disabled={loading}
          >
            <FiX size={20} />
          </button>
        </div>

        <p className="softskill-modal-subtitle">Add a new soft skill</p>

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
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
              disabled={loading}
            />
          </label>

          <label>
            Level (0–100%) *
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
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="softskill-btn-add"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSoftSkillModal;
