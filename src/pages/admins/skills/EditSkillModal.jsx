import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, Loader2 } from "lucide-react";
import Select from "react-select";
import { fetchCategories } from "../../../services/projectService";
import { viewSkillById, updateSkill } from "../../../services/skillService";
import Swal from "sweetalert2";
import "../../../css/admin/skills/AddSkillModal.css";
import { gsap } from "gsap";

/**
 * EditSkillModal Component
 * 
 * Provides a modal interface to modify existing technical skills.
 * Features:
 * - Pre-loads current skill data based on skillId
 * - Updates name, proficiency level, and category
 * - GSAP animations for smooth transition
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Modal close handler
 * @param {number|string} props.skillId - ID of the skill to edit
 * @param {Function} props.onSkillUpdated - Success callback
 */
const EditSkillModal = ({ isOpen, onClose, skillId, onSkillUpdated }) => {
  const [form, setForm] = useState({ name: "", level: 50, category: null });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSkill, setLoadingSkill] = useState(false);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  /**
   * Fetches skill categories from the database.
   */
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
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch categories",
      });
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  /**
   * Loads the existing skill details to populate the form.
   */
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
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch skill data",
      });
    } finally {
      setLoadingSkill(false);
    }
  }, [skillId]);

  // Modal initialization and animations
  useEffect(() => {
    if (isOpen) {
      loadCategories();
      loadSkill();
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, loadCategories, loadSkill]);

  if (!isOpen) return null;

  /**
   * Exit animation handler before closing.
   */
  const handleClose = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 20,
      duration: 0.3,
      onComplete: onClose,
    });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
  };

  /**
   * Updates local form state.
   */
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Submits the updated skill data.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category) {
      Swal.fire("Warning", "Skill name and category are required.", "warning");
      return;
    }

    const cleanLevel = Math.max(0, Math.min(100, Number(form.level)));

    try {
      await updateSkill(skillId, {
        name: form.name.trim(),
        level: cleanLevel,
        category_id: form.category.value,
      });

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Skill updated successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
      onSkillUpdated?.();
      handleClose();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.message || "Failed to update skill",
      });
    }
  };

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={(e) => e.target === overlayRef.current && handleClose()}>
      <div className="modal-box" ref={modalRef}>
        <div className="modal-header">
          <h2>Edit Skill</h2>
          <button className="close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <p className="modal-subtitle">Refine the details of your technical expertise</p>

        {loadingSkill ? (
          // Loading spinner for fetching specific skill data
          <div className="flex items-center justify-center p-12 text-blue-500">
            <Loader2 className="animate-spin" size={32} />
          </div>
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
              Proficiency Level (0–100%) *
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

            {/* Range slider for proficiency */}
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
                classNamePrefix="select"
                value={form.category}
                onChange={(val) => handleChange("category", val)}
                options={categories}
                isLoading={loadingCategories}
                placeholder={loadingCategories ? "Loading..." : "Select category"}
                isClearable
              />
            </label>

            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="btn-add">
                Update Skill
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditSkillModal;
