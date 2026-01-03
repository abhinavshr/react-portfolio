import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import "../../../css/admin/experiences/AddExperienceModal.css";

const AddExperienceModal = ({ isOpen, onClose }) => {
    const [current, setCurrent] = useState(false);

    if (!isOpen) return null;

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
                <form className="experience-modal-form">
                    <div className="experience-row">
                        <label>
                            Company Name *
                            <input type="text" placeholder="e.g. Tech Corp Inc." />
                        </label>

                        <label>
                            Position *
                            <input type="text" placeholder="e.g. Senior Developer" />
                        </label>
                    </div>

                    <label>
                        Location *
                        <input type="text" placeholder="e.g. San Francisco, CA" />
                    </label>

                    <div className="experience-row">
                        <label>
                            Start Date *
                            <input type="date" />
                        </label>

                        <label>
                            End Date
                            <input type="date" disabled={current} />
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
                            placeholder="Describe your role and achievements..."
                            rows={4}
                        />
                    </label>

                    <div className="experience-modal-actions">
                        <button type="button" className="experience-btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="button" className="experience-btn-add">
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExperienceModal;
