import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import "../../../css/admin/softskills/AddSoftSkillModal.css";
import { addSoftSkill } from "../../../services/softSkillService";
import { gsap } from "gsap";

const AddSoftSkillModal = ({ isOpen, onClose, onSkillAdded }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState(50);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  if (!isOpen) return null;

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

  const resetForm = () => {
    setName("");
    setDescription("");
    setLevel(50);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      Swal.fire("Warning", "Name and description are required.", "warning");
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
      handleClose();
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
    <div className="softskill-modal-overlay" ref={overlayRef} onClick={(e) => e.target === overlayRef.current && handleClose()}>
      <div className="softskill-modal-box" ref={modalRef}>
        <div className="softskill-modal-header">
          <h2>Add Soft Skill</h2>
          <button
            className="softskill-close-btn"
            onClick={handleClose}
            aria-label="Close modal"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <p className="softskill-modal-subtitle">Add a new professional soft skill to your profile</p>

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
              placeholder="Enter details about this skill..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              disabled={loading}
            />
          </label>

          <label>
            Proficiency Level (0–100%) *
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
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="softskill-btn-add"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Soft Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSoftSkillModal;
