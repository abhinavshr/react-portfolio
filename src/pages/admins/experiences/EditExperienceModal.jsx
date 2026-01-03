import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import "../../../css/admin/experiences/AddExperienceModal.css";
import { updateExperience, viewExperienceById } from "../../../services/experienceService";

const EditExperienceModal = ({ isOpen, onClose, experienceId, onExperienceUpdated }) => {
  const [companyName, setCompanyName] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [role, setRole] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [current, setCurrent] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Fetch experience data by ID when modal opens
  useEffect(() => {
    if (!isOpen || !experienceId) return;

    const fetchExperience = async () => {
      try {
        setLoadingData(true);
        const response = await viewExperienceById(experienceId);
        const exp = response.data;
        setCompanyName(exp.company_name);
        setCompanyLocation(exp.company_location || "");
        setRole(exp.role);
        setStartDate(exp.start_date);
        setEndDate(exp.end_date || "");
        setCurrent(!!exp.is_current);
        setDescription(exp.description);
      } catch (error) {
        alert(error.message || "Failed to fetch experience");
      } finally {
        setLoadingData(false);
      }
    };

    fetchExperience();
  }, [isOpen, experienceId]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      company_name: companyName,
      company_location: companyLocation,
      role,
      start_date: startDate,
      end_date: current ? null : endDate,
      is_current: current,
      description,
    };

    try {
      setLoading(true);
      await updateExperience(experienceId, payload);

      // refresh parent list
      if (onExperienceUpdated) onExperienceUpdated();

      // close modal
      onClose();
    } catch (error) {
      alert(error.message || "Failed to update experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="experience-modal-overlay">
      <div className="experience-modal-box">
        {/* Header */}
        <div className="experience-modal-header">
          <h2>Edit Experience</h2>
          <button className="experience-close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <p className="experience-modal-subtitle">
          Update your work experience details
        </p>

        {loadingData ? (
          <p>Loading experience data...</p>
        ) : (
          <form className="experience-modal-form" onSubmit={handleSubmit}>
            <div className="experience-row">
              <label>
                Company Name *
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Tech Corp Inc."
                  required
                />
              </label>

              <label>
                Role *
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Developer"
                  required
                />
              </label>
            </div>

            <label>
              Company Location *
              <input
                type="text"
                value={companyLocation}
                onChange={(e) => setCompanyLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA"
                required
              />
            </label>

            <div className="experience-row">
              <label>
                Start Date *
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </label>

              <label>
                End Date
                <input
                  type="date"
                  value={endDate}
                  disabled={current}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </label>
            </div>

            <label className="experience-checkbox">
              <input
                type="checkbox"
                checked={current}
                onChange={() => setCurrent(!current)}
              />
              I currently work here
            </label>

            <label>
              Description *
              <textarea
                rows={4}
                placeholder="Describe your role and achievements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>

            <div className="experience-modal-actions">
              <button
                type="button"
                className="experience-btn-cancel"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="experience-btn-add"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditExperienceModal;
