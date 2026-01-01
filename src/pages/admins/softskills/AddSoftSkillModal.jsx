import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import "../../../css/admin/softskills/AddSoftSkillModal.css";

const AddSoftSkillModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState(0); 

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      name,
      description,
      level,
    });
    alert("Soft skill submitted! Check console.");
    setName("");
    setDescription("");
    setLevel(0); 
  };

  return (
    <div className="softskill-modal-overlay">
      <div className="softskill-modal-box">
        <div className="softskill-modal-header">
          <h2>Add Soft Skill</h2>
          <button className="softskill-close-btn" onClick={onClose}>
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
            />
          </label>

          <label>
            Description *
            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </label>

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

          <div className="softskill-level-slider-wrapper">
            <input
              type="range"
              min="0"
              max="100"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="softskill-level-slider"
              style={{ "--percent": `${level}%` }}
            />
            <span className="softskill-level-percent">{level}%</span>
          </div>

          <div className="softskill-modal-actions">
            <button type="button" className="softskill-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="softskill-btn-add">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSoftSkillModal;
