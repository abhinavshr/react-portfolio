import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import "../../../css/admin/skills/AddSkillModal.css";

const AddSkillModal = ({ isOpen, onClose, onSkillAdded }) => {
  const [name, setName] = useState("");
  const [level, setLevel] = useState(50);
  const [category, setCategory] = useState("");

  const categories = [
    "Frontend Development",
    "Backend Development",
    "Database",
    "DevOps",
    "Other",
  ];

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSkillAdded({ name, level, category });
    onClose();
    setName("");
    setLevel(50);
    setCategory("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>Add New Skill</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <p className="modal-subtitle">Add a new skill to your profile</p>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Skill Name *
            <input
              type="text"
              placeholder="e.g., React"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          {/* LEVEL */}
          <label>
            Level (0–100%) *
            <input
              type="number"
              min="0"
              max="100"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              onBlur={() => {
                const clean = Math.max(0, Math.min(100, Number(level)));
                setLevel(isNaN(clean) ? 0 : clean);
              }}
            />
          </label>

          <div className="level-slider-wrapper">
            <input
              type="range"
              min="0"
              max="100"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="level-slider"
              style={{ "--percent": `${level}%` }}
            />
            <span className="level-percent">{level}%</span>
          </div>

          <label>
            Category *
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-add">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkillModal;
