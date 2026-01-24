import React, { useState, useEffect, useCallback } from "react";
import { FiX } from "react-icons/fi";
import Select from "react-select";
import { fetchCategories } from "../../../services/projectService";
import { addSkill } from "../../../services/skillService";
import "../../../css/admin/skills/AddSkillModal.css";

const AddSkillModal = ({ isOpen, onClose, onSkillAdded }) => {
  const [form, setForm] = useState({ name: "", level: 50, category: null });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const loadCategories = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (isOpen) loadCategories();
  }, [isOpen, loadCategories]);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) return;

    const cleanLevel = Math.max(0, Math.min(100, Number(form.level)));

    try {
      await addSkill({
        name: form.name.trim(),
        level: cleanLevel,
        category_id: form.category.value,
      });

      onSkillAdded?.();
      setForm({ name: "", level: 50, category: null });
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to add skill");
    }
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
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </label>

          <label>
            Level (0–100%) *
            <input
              type="number"
              min="0"
              max="100"
              value={form.level}
              onChange={(e) => handleChange("level", e.target.value)}
              onBlur={() => handleChange("level", Math.max(0, Math.min(100, Number(form.level))))}
              required
            />
          </label>

          <div className="level-slider-wrapper">
            <input
              type="range"
              min="0"
              max="100"
              value={form.level}
              onChange={(e) => handleChange("level", Number(e.target.value))}
              className="level-slider"
              style={{ "--percent": `${form.level}%` }}
            />
            <span className="level-percent">{form.level}%</span>
          </div>

          <label>
            Category *
            <Select
              value={form.category}
              onChange={(val) => handleChange("category", val)}
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
