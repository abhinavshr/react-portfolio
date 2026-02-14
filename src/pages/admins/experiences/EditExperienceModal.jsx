import React, { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import "../../../css/admin/experiences/AddExperienceModal.css";
import { updateExperience, viewExperienceById } from "../../../services/experienceService";
import Swal from "sweetalert2";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const EditExperienceModal = ({ isOpen, onClose, experienceId, onExperienceUpdated }) => {
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
  const [loadingData, setLoadingData] = useState(false);

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

  useEffect(() => {
    if (!isOpen || !experienceId) return;

    const fetchExperience = async () => {
      try {
        setLoadingData(true);
        const response = await viewExperienceById(experienceId);
        const exp = response.data;

        setFormData({
          companyName: exp.company_name || "",
          companyLocation: exp.company_location || "",
          role: exp.role || "",
          start_date: exp.start_date || "",
          end_date: exp.end_date || "",
          is_current: !!exp.is_current,
          description: exp.description || "",
          // Note: State keys should match form inputs. 
          // Previous code had mixed keys (startDate vs start_date in payload).
          // Let's fix mapping below or in render.
          // Wait, the previous code had:
          // start_date: exp.start_date
          // But input name="startDate".
          // And handleChange updates "startDate".
          // So I should map API snake_case to camelCase state here.
          // Correcting keys:
          startDate: exp.start_date || "",
          endDate: exp.end_date || "",
          current: !!exp.is_current,
        });
      } catch (error) {
        Swal.fire("Error", error.response?.data?.message || "Failed to fetch experience", "error");
        onClose();
      } finally {
        setLoadingData(false);
      }
    };

    fetchExperience();
  }, [isOpen, experienceId, onClose]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      await updateExperience(experienceId, payload);

      Swal.fire({
        icon: "success",
        title: "Experience Updated",
        timer: 1500,
        showConfirmButton: false,
      });

      onExperienceUpdated?.();
      handleClose(); // Use animated close
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to update experience", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="experience-modal-overlay" ref={modalContainerRef}>
      <div className="experience-modal-box">
        <div className="experience-modal-header">
          <h2>Edit Experience</h2>
          <button
            className="experience-close-btn"
            onClick={handleClose}
            aria-label="Close modal"
            disabled={loading}
          >
            <FiX size={20} />
          </button>
        </div>

        {loadingData ? (
          <p>Loading experience data...</p>
        ) : (
          <form className="experience-modal-form" onSubmit={handleSubmit}>
            <div className="experience-row">
              <label>
                Company Name *
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
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
