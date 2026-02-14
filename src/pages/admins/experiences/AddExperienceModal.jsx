import React, { useState, useRef } from "react";
import { FiX } from "react-icons/fi";
import "../../../css/admin/experiences/AddExperienceModal.css";
import { addExperience } from "../../../services/experienceService";
import Swal from "sweetalert2";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const AddExperienceModal = ({ isOpen, onClose, onExperienceAdded }) => {
  const modalContainerRef = useRef(null);

  const [formData, setFormData] = useState({
    companyName: "",
    companyLocation: "",
    role: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  const [loading, setLoading] = useState(false);

  useGSAP(() => {
    if (isOpen) {
      gsap.from(".experience-modal-overlay", { opacity: 0, duration: 0.3 });
      gsap.from(".experience-modal-box", {
        y: 50,
        opacity: 0,
        scale: 0.95,
        duration: 0.4,
        ease: "power3.out"
      });
    }
  }, { scope: modalContainerRef, dependencies: [isOpen] });

  // Handle closing with animation
  const handleClose = () => {
    gsap.to(".experience-modal-box", {
      y: 20,
      opacity: 0,
      duration: 0.2,
      ease: "power3.in"
    });
    gsap.to(".experience-modal-overlay", {
      opacity: 0,
      duration: 0.2,
      onComplete: onClose
    });
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      companyName: "",
      companyLocation: "",
      role: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
  };

  const validateForm = () => {
    if (!formData.companyName.trim() || !formData.role.trim() || !formData.companyLocation.trim()) {
      return { type: "warning", title: "Missing Fields", text: "Please fill in all required fields." };
    }
    if (!formData.current && formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      return { type: "error", title: "Invalid Dates", text: "End date must be after start date." };
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      Swal.fire({ icon: validationError.type, title: validationError.title, text: validationError.text });
      return;
    }

    const payload = {
      company_name: formData.companyName,
      company_location: formData.companyLocation,
      role: formData.role,
      start_date: formData.startDate,
      end_date: formData.current ? null : formData.endDate,
      is_current: formData.current,
      description: formData.description,
    };

    try {
      setLoading(true);
      await addExperience(payload);

      Swal.fire({
        icon: "success",
        title: "Experience Added",
        text: "Your work experience has been successfully added.",
        timer: 2000,
        showConfirmButton: false,
      });

      onExperienceAdded?.();
      onClose();
      resetForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || error.message || "Failed to add experience",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="experience-modal-overlay" ref={modalContainerRef}>
      <div className="experience-modal-box">
        {/* Header */}
        <div className="experience-modal-header">
          <h2>Add New Experience</h2>
          <button
            className="experience-close-btn"
            onClick={handleClose}
            aria-label="Close modal"
            disabled={loading}
          >
            <FiX size={20} />
          </button>
        </div>

        <p className="experience-modal-subtitle">Add a new work experience to your profile</p>

        {/* Form */}
        <form className="experience-modal-form" onSubmit={handleSubmit}>
          <div className="experience-row">
            <label>
              Company Name *
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Tech Corp Inc."
                required
                disabled={loading}
              />
            </label>

            <label>
              Role *
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Senior Developer"
                required
                disabled={loading}
              />
            </label>
          </div>

          <label>
            Company Location *
            <input
              type="text"
              name="companyLocation"
              value={formData.companyLocation}
              onChange={handleChange}
              placeholder="e.g. San Francisco, CA"
              required
              disabled={loading}
            />
          </label>

          <div className="experience-row">
            <label>
              Start Date *
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </label>

            <label>
              End Date
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.current || loading}
              />
            </label>
          </div>

          <label className="experience-checkbox">
            <input
              type="checkbox"
              name="current"
              checked={formData.current}
              onChange={handleChange}
              disabled={loading}
            />
            I currently work here
          </label>

          <label>
            Description *
            <textarea
              name="description"
              rows={4}
              placeholder="Describe your role and achievements..."
              value={formData.description}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>

          <div className="experience-modal-actions">
            <button
              type="button"
              className="experience-btn-cancel"
              onClick={handleClose}
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
