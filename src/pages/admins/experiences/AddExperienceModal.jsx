import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import "../../../css/admin/experiences/AddExperienceModal.css";
import { addExperience } from "../../../services/experienceService";

const AddExperienceModal = ({ isOpen, onClose, onExperienceAdded }) => {
    const [companyName, setCompanyName] = useState("");
    const [companyLocation, setCompanyLocation] = useState("");
    const [role, setRole] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [current, setCurrent] = useState(false);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

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
            await addExperience(payload);

            // refresh parent list
            if (onExperienceAdded) onExperienceAdded();

            // close modal
            onClose();

            // reset form
            setCompanyName("");
            setCompanyLocation("");
            setRole("");
            setStartDate("");
            setEndDate("");
            setCurrent(false);
            setDescription("");
        } catch (error) {
            alert(error.message || "Failed to add experience");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="experience-modal-overlay">
            <div className="experience-modal-box">
                {/* Header */}
                <div className="experience-modal-header">
                    <h2>Add New Experience</h2>
                    <button className="experience-close-btn" onClick={onClose}>
                        <FiX size={20} />
                    </button>
                </div>

                <p className="experience-modal-subtitle">
                    Add a new work experience to your profile
                </p>

                {/* Form */}
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
                            {loading ? "Adding..." : "Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExperienceModal;
