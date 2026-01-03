import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import "../../../css/admin/experiences/AddExperienceModal.css";
import { viewExperienceById } from "../../../services/experienceService";

const ViewExperienceModal = ({ isOpen, onClose, experienceId }) => {
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !experienceId) return;

    const fetchExperience = async () => {
      try {
        setLoading(true);
        const response = await viewExperienceById(experienceId);
        setExperience(response.data); // API returns { message, data }
      } catch (error) {
        alert(error.message || "Failed to fetch experience");
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [isOpen, experienceId]);

  if (!isOpen) return null;

  return (
    <div className="experience-modal-overlay">
      <div className="experience-modal-box">
        <div className="experience-modal-header">
          <div>
            <h2>Experience Details</h2>
            <p>View the details of this work experience</p>
          </div>
          <button className="experience-close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : experience ? (
          <div className="experience-modal-form">
            <label>
              Company Name
              <input type="text" value={experience.company_name} readOnly />
            </label>

            <label>
              Role
              <input type="text" value={experience.role} readOnly />
            </label>

            <label>
              Company Location
              <input
                type="text"
                value={experience.company_location || "N/A"}
                readOnly
              />
            </label>

            <div className="experience-row">
              <label>
                Start Date
                <input type="date" value={experience.start_date} readOnly />
              </label>

              <label>
                End Date
                <input
                  type="text"
                  value={
                    experience.is_current
                      ? "Present"
                      : experience.end_date || "N/A"
                  }
                  readOnly
                />
              </label>
            </div>

            <label className="experience-checkbox">
              <input type="checkbox" checked={experience.is_current} readOnly />
              I currently work here
            </label>

            <label>
              Description
              <textarea rows="4" value={experience.description} readOnly />
            </label>

            <div className="experience-modal-actions">
              <button
                type="button"
                className="experience-btn-cancel"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <p>No experience found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewExperienceModal;
