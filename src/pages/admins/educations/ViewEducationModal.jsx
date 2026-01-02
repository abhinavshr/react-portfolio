import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import "../../../css/admin/educations/AddEducationModal.css";
import { viewEducationById } from "../../../services/educationService";

const ViewEducationModal = ({ isOpen, onClose, educationId }) => {
  const [education, setEducation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !educationId) return;

    const fetchEducation = async () => {
      try {
        setLoading(true);
        const response = await viewEducationById(educationId);
        setEducation(response.data); 
      } catch (error) {
        alert(error.message || "Failed to fetch education");
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, [isOpen, educationId]);

  if (!isOpen) return null;

  return (
    <div className="edu-modal-overlay">
      <div className="edu-modal">
        <div className="edu-modal-header">
          <div>
            <h2>Education Details</h2>
            <p>View the details of this education entry</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : education ? (
          <div className="edu-form">
            <label>
              Institution/University
              <input type="text" value={education.institution} readOnly />
            </label>

            <div className="two-col">
              <label>
                Level
                <input type="text" value={education.level} readOnly />
              </label>

              <label>
                Program of Study
                <input type="text" value={education.program} readOnly />
              </label>
            </div>

            <div className="two-col">
              <label>
                Start Year
                <input type="text" value={education.start_year} readOnly />
              </label>

              <label>
                End Year
                <input type="text" value={education.end_year} readOnly />
              </label>
            </div>

            <label>
              Board
              <input type="text" value={education.board || "-"} readOnly />
            </label>

            <label>
              Description
              <textarea rows="4" value={education.description || "-"} readOnly />
            </label>

            <div className="edu-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <p>No education found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewEducationModal;
