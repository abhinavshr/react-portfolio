import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import "../../../css/admin/softskills/AddSoftSkillModal.css"; 
import { getSoftSkillById } from "../../../services/softSkillService";

const ViewSoftSkillModal = ({ isOpen, onClose, skillId }) => {
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (skillId && isOpen) {
      const fetchSkill = async () => {
        try {
          setLoading(true);
          const response = await getSoftSkillById(skillId);
          setSkill(response.data);
        } catch (error) {
          console.error("Error fetching soft skill:", error);
          alert(error.message || "Failed to fetch soft skill");
          onClose(); 
        } finally {
          setLoading(false);
        }
      };
      fetchSkill();
    }
  }, [skillId, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="softskill-modal-overlay">
      <div className="softskill-modal-box">
        <div className="softskill-modal-header">
          <h2>View Soft Skill</h2>
          <button className="softskill-close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {loading ? (
          <p className="softskill-modal-subtitle">Loading...</p>
        ) : (
          <>
            <p className="softskill-modal-subtitle">Details of the soft skill</p>

            <div className="softskill-modal-form">
              <label>
                Soft Skill Name
                <input type="text" value={skill.name} readOnly />
              </label>

              <label>
                Description
                <textarea value={skill.description} readOnly rows={3} />
              </label>

              <label>
                Level
                <input type="number" value={skill.level} readOnly />
              </label>

              <div className="softskill-level-slider-wrapper">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={skill.level}
                  readOnly
                  className="softskill-level-slider"
                  style={{ "--percent": `${skill.level}%` }}
                />
                <span className="softskill-level-percent">{skill.level}%</span>
              </div>

              <div className="softskill-modal-actions">
                <button type="button" className="softskill-btn-cancel" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewSoftSkillModal;
