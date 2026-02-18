import React, { useState, useRef, useEffect } from "react";
import { X, Briefcase, MapPin, Calendar, AlignLeft, Plus, Trash2, CheckCircle2 } from "lucide-react";
import "../../../css/admin/experiences/AddExperienceModal.css";
import { addExperience } from "../../../services/experienceService";
import { addResponsibilities } from "../../../services/experienceResponsibilitiesService";
import Swal from "sweetalert2";
import gsap from "gsap";

const AddExperienceModal = ({ isOpen, onClose, onExperienceAdded }) => {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  const [formData, setFormData] = useState({
    companyName: "",
    companyLocation: "",
    role: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

  const [responsibilities, setResponsibilities] = useState([""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const tl = gsap.timeline();
      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        .fromTo(modalRef.current,
          { scale: 0.9, opacity: 0, y: 30 },
          { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" },
          "-=0.1"
        );
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        onClose();
        resetForm();
      }
    });
    tl.to(modalRef.current, { scale: 0.9, opacity: 0, y: 20, duration: 0.3, ease: "power2.in" })
      .to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.1");
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
    setResponsibilities([""]);
  };

  const validateForm = () => {
    if (!formData.companyName.trim() || !formData.role.trim() || !formData.companyLocation.trim() || !formData.description.trim()) {
      return { type: "warning", title: "Missing Fields", text: "Please fill in all required fields." };
    }
    if (!formData.current && formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      return { type: "error", title: "Invalid Dates", text: "End date must be after start date." };
    }
    return null;
  };

  const addResponsibilityField = () => {
    if (responsibilities.length >= 5) {
      Swal.fire({
        icon: "warning",
        title: "Limit reached",
        text: "Maximum 5 responsibilities allowed",
        confirmButtonColor: "#6366f1"
      });
      return;
    }
    setResponsibilities([...responsibilities, ""]);
  };

  const removeResponsibilityField = (index) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
  };

  const handleResponsibilityChange = (index, value) => {
    const updated = [...responsibilities];
    updated[index] = value;
    setResponsibilities(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      Swal.fire({
        icon: validationError.type,
        title: validationError.title,
        text: validationError.text,
        confirmButtonColor: "#6366f1"
      });
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

      const res = await addExperience(payload);
      const experienceId = res.data?.id || res.data?.data?.id;

      const filtered = responsibilities.filter(r => r.trim() !== "");
      if (filtered.length > 0 && experienceId) {
        await addResponsibilities(experienceId, { responsibilities: filtered });
      }

      Swal.fire({
        icon: "success",
        title: "Experience Added",
        text: "Your work experience has been successfully added.",
        timer: 2000,
        showConfirmButton: false,
      });

      onExperienceAdded?.();
      handleClose();

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || error.message || "Failed to add experience",
        confirmButtonColor: "#6366f1"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="experience-modal-overlay" ref={overlayRef} onClick={handleClose}>
      <div className="experience-modal-box" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <div className="experience-modal-header">
          <h2>Add New Experience</h2>
          <button
            className="experience-close-btn"
            onClick={handleClose}
            aria-label="Close modal"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="experience-modal-content">
          <p className="experience-modal-subtitle">Fill in the details of your professional experience to showcase on your portfolio.</p>

          <form id="experienceForm" className="experience-modal-form" onSubmit={handleSubmit}>
            <div className="experience-row">
              <div className="experience-form-group">
                <label><Briefcase size={14} /> Company Name <span>*</span></label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Google"
                  required
                  disabled={loading}
                />
              </div>

              <div className="experience-form-group">
                <label><CheckCircle2 size={14} /> Role <span>*</span></label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="experience-form-group">
              <label><MapPin size={14} /> Company Location <span>*</span></label>
              <input
                type="text"
                name="companyLocation"
                value={formData.companyLocation}
                onChange={handleChange}
                placeholder="e.g. Mountain View, CA"
                required
                disabled={loading}
              />
            </div>

            <div className="experience-row">
              <div className="experience-form-group">
                <label><Calendar size={14} /> Start Date <span>*</span></label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="experience-form-group">
                <label><Calendar size={14} /> End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  disabled={formData.current || loading}
                />
              </div>
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

            <div className="experience-form-group">
              <label><AlignLeft size={14} /> Description <span>*</span></label>
              <textarea
                name="description"
                rows={4}
                placeholder="Briefly describe your responsibilities and impact..."
                value={formData.description}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="experience-responsibilities">
              <label>
                <span>Key Responsibilities</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>Max 5</span>
              </label>

              {responsibilities.map((item, index) => (
                <div key={index} className="responsibility-row">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                    placeholder={`e.g. Led a team of 5 developers...`}
                    disabled={loading}
                  />
                  {responsibilities.length > 1 && (
                    <button
                      type="button"
                      className="remove-responsibility-btn"
                      onClick={() => removeResponsibilityField(index)}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}

              {responsibilities.length < 5 && (
                <button
                  type="button"
                  className="add-responsibility-btn"
                  onClick={addResponsibilityField}
                  disabled={loading}
                >
                  <Plus size={16} /> Add Responsibility
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="experience-modal-footer">
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
            form="experienceForm"
            className="experience-btn-add"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Experience"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExperienceModal;
