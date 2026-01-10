import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import Swal from "sweetalert2";
import "../../../css/admin/softskills/AddSoftSkillModal.css";
import { getSoftSkillById, updateSoftSkill } from "../../../services/softSkillService";

const EditSoftSkillModal = ({ isOpen, onClose, skillId, onSkillUpdated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (skillId && isOpen) {
      const fetchSkill = async () => {
        try {
          setFetching(true);
          const response = await getSoftSkillById(skillId);
          const skill = response.data;
          setName(skill.name);
          setDescription(skill.description);
          setLevel(skill.level);
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message || "Failed to fetch skill data"
          });
          onClose();
        } finally {
          setFetching(false);
        }
      };
      fetchSkill();
    }
  }, [skillId, isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = { name, description, level };

    try {
      setLoading(true);
      const response = await updateSoftSkill(skillId, updatedData);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Soft skill updated successfully.",
        timer: 1500,
        showConfirmButton: false
      });

      if (onSkillUpdated) onSkillUpdated(response);

      onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "Failed to update soft skill"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="softskill-modal-overlay">
      <div className="softskill-modal-box">
        <div className="softskill-modal-header">
          <h2>Edit Soft Skill</h2>
          <button className="softskill-close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {fetching ? (
          <p className="softskill-modal-subtitle">Loading...</p>
        ) : (
          <>
            <p className="softskill-modal-subtitle">Update the soft skill details</p>

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
                  onChange={(e) => setLevel(Number(e.target.value))}
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
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EditSoftSkillModal;
