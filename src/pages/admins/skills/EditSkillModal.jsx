import React, { useState, useEffect, useCallback } from "react";
import { FiX } from "react-icons/fi";
import Select from "react-select";
import { fetchCategories } from "../../../services/projectService";
import { viewSkillById, updateSkill } from "../../../services/skillService";
import Swal from "sweetalert2";
import "../../../css/admin/skills/AddSkillModal.css";

const EditSkillModal = ({ isOpen, onClose, skillId, onSkillUpdated }) => {
  const [form, setForm] = useState({ name: "", level: 50, category: null });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSkill, setLoadingSkill] = useState(false);

  // --- Lock scroll when modal is open ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // --- Load categories ---
  const loadCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const res = await fetchCategories();
      const data = res?.data ?? res ?? [];
      setCategories(
        data.map((cat) => ({
          value: cat.id ?? cat,
          label: cat.name ?? cat,
        }))
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch categories",
        error,
      });
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  // --- Load skill data ---
  const loadSkill = useCallback(async () => {
    if (!skillId) return;
    try {
      setLoadingSkill(true);
      const skill = await viewSkillById(skillId);
      setForm({
        name: skill.name || "",
        level: skill.level ?? 50,
        category: skill.category
          ? { value: skill.category.id, label: skill.category.name }
          : null,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch skill data",
        error,
      });
    } finally {
      setLoadingSkill(false);
    }
  }, [skillId]);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      loadSkill();
    }
  }, [isOpen, loadCategories, loadSkill]);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      return { type: "warning", title: "Missing Field", text: "Skill name is required." };
    }
    if (!form.category) {
      return { type: "warning", title: "Missing Field", text: "Category is required." };
    }
    if (form.level < 0 || form.level > 100) {
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

    const cleanLevel = Math.max(0, Math.min(100, Number(form.level)));

    try {
      await updateSkill(skillId, {
        name: form.name.trim(),
        level: cleanLevel,
        category_id: form.category.value,
      });

      Swal.fire({ icon: "success", title: "Updated", text: "Skill updated successfully!" });
      onSkillUpdated?.();
      onClose();
      setForm({ name: "", level: 50, category: null });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: err.message || "Failed to update skill" });
    }
  };

  // --- Close modal on click outside ---
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box">
        <div className="modal-header">
          <h2>Edit Skill</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <p className="modal-subtitle">Edit the details of your skill</p>

        {loadingSkill ? (
          <div>Loading skill...</div>
        ) : (
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
                Update
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditSkillModal;
