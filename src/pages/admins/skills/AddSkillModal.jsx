import React, { useState, useEffect, useCallback, useRef } from "react";
import { X } from "lucide-react";
import Select from "react-select";
import { fetchCategories } from "../../../services/projectService";
import { addSkill } from "../../../services/skillService";
import "../../../css/admin/skills/AddSkillModal.css";
import { gsap } from "gsap";

const AddSkillModal = ({ isOpen, onClose, onSkillAdded }) => {
  const [form, setForm] = useState({ name: "", level: 50, category: null });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

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
    if (isOpen) {
      loadCategories();
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
  }, [isOpen, loadCategories]);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

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
      handleClose();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to add skill");
    }
  };

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={(e) => e.target === overlayRef.current && handleClose()}>
      <div className="modal-box" ref={modalRef}>
        <div className="modal-header">
          <h2>Add New Skill</h2>
          <button className="close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <p className="modal-subtitle">Add a new skill to your technical profile</p>

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
              Add Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkillModal;
