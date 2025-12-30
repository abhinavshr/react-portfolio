import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import Select from "react-select";
import { fetchCategories } from "../../../services/projectService";
import "../../../css/admin/skills/AddSkillModal.css";

const AddSkillModal = ({ isOpen, onClose, onSkillAdded }) => {
  const [name, setName] = useState("");
  const [level, setLevel] = useState(0);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await fetchCategories();
        const data = res?.data ?? res ?? [];
        setCategories(data.map((cat) => ({ value: cat.id ?? cat, label: cat.name ?? cat })));
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category) return; // extra safety
    onSkillAdded({
      name,
      level: Number(level),
      category: category.value,
    });
    onClose();
    setName("");
    setLevel(50);
    setCategory(null);
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
              required
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
            <Select
              value={category}
              onChange={setCategory}
              options={categories}
              isLoading={loadingCategories}
              placeholder={loadingCategories ? "Loading categories..." : "Select category"}
              isClearable
            />
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
