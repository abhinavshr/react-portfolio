import React, { useState, useEffect, useRef } from "react";
import { X, Briefcase, MapPin, Calendar, AlignLeft, Plus, Trash2, CheckCircle2 } from "lucide-react";
import "../../../css/admin/experiences/AddExperienceModal.css";
import { updateExperience, viewExperienceById } from "../../../services/experienceService";
import { addResponsibilities, deleteResponsibility, updateResponsibility } from "../../../services/experienceResponsibilitiesService";
import Swal from "sweetalert2";
import gsap from "gsap";

/**
 * EditExperienceModal Component
 * Facilitates the editing of an existing work experience record.
 * Handles meta-data updates and granular responsibility management (add/edit/delete).
 * 
 * @param {boolean} isOpen - Controls modal visibility.
 * @param {function} onClose - function to close the modal.
 * @param {string|number} experienceId - ID of the experience to edit.
 * @param {function} onExperienceUpdated - Callback to refresh data in parent component.
 */
const EditExperienceModal = ({ isOpen, onClose, experienceId, onExperienceUpdated }) => {
  // --- Refs & State ---
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

  const [responsibilities, setResponsibilities] = useState([{ id: null, text: "" }]); // Combined existing and new items
  const [loading, setLoading] = useState(false); // Update submission state
  const [loadingData, setLoadingData] = useState(false); // Initial fetch state

  /**
   * Animation & Body Scroll Lock
   */
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

  /**
   * Gracefully closes the modal.
   */
  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: onClose
    });
    tl.to(modalRef.current, { scale: 0.9, opacity: 0, y: 20, duration: 0.3, ease: "power2.in" })
      .to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.1");
  };

  /**
   * Data Fetching: Retrieves existing experience details when opened.
   */
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
          startDate: exp.start_date || "",
          endDate: exp.end_date || "",
          current: !!exp.is_current,
          description: exp.description || "",
        });

        // Set responsibilities: map response objects to local state format
        if (exp.responsibilities && exp.responsibilities.length > 0) {
          setResponsibilities(exp.responsibilities.map(r => ({
            id: r.id,
            text: r.responsibility || ""
          })));
        } else {
          setResponsibilities([{ id: null, text: "" }]);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to fetch experience",
          confirmButtonColor: "#6366f1"
        });
        onClose();
      } finally {
        setLoadingData(false);
      }
    };

    fetchExperience();
  }, [isOpen, experienceId, onClose]);

  /**
   * Updates meta form data state.
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /**
   * Updates specific responsibility text by index.
   */
  const handleResponsibilityChange = (index, value) => {
    const updated = [...responsibilities];
    updated[index].text = value;
    setResponsibilities(updated);
  };

  /**
   * Appends a new empty responsibility object to the state.
   */
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
    setResponsibilities([...responsibilities, { id: null, text: "" }]);
  };

  /**
   * Handles the removal of a responsibility.
   * If the item is already saved, it calls the delete API; otherwise, it just updates the state.
   */
  const removeResponsibilityField = async (index) => {
    const item = responsibilities[index];

    // Case 1: Existing Responsibility (needs API call)
    if (item.id) {
      const result = await Swal.fire({
        title: "Delete responsibility?",
        text: "This will permanently remove this item from your experience.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Yes, delete it!"
      });

      if (!result.isConfirmed) return;

      try {
        setLoading(true);
        await deleteResponsibility(item.id);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Responsibility removed.",
          timer: 1500,
          showConfirmButton: false
        });
        setResponsibilities(responsibilities.filter((_, i) => i !== index));
        onExperienceUpdated?.(); // Refresh parent to reflect deletion
      } catch (error) {
        Swal.fire("Error", error.message || "Failed to delete responsibility", "error");
      } finally {
        setLoading(false);
      }
    } else {
      // Case 2: New unsaved item
      setResponsibilities(responsibilities.filter((_, i) => i !== index));
    }
  };

  /**
   * Validates form inputs.
   */
  const validateForm = () => {
    if (!formData.companyName.trim() || !formData.role.trim() || !formData.companyLocation.trim() || !formData.description.trim()) {
      return { type: "warning", title: "Missing Fields", text: "Please fill in all required fields." };
    }
    if (!formData.current && formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      return { type: "error", title: "Invalid Dates", text: "End date must be after start date." };
    }
    return null;
  };

  /**
   * Handles the submission of all changes.
   * Synchronizes meta updates and handles separate logic for updating existing vs adding new responsibilities.
   */
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

      // 1. Update the main experience meta details
      await updateExperience(experienceId, payload);

      // 2. Synchronize responsibilities
      const toUpdate = responsibilities.filter(r => r.id && r.text.trim() !== "");
      const toAdd = responsibilities.filter(r => !r.id && r.text.trim() !== "");

      // Perform individual updates for existing items
      if (toUpdate.length > 0) {
        await Promise.all(
          toUpdate.map(r => updateResponsibility(r.id, { responsibility: r.text }))
        );
      }

      // Perform batch add for new items
      if (toAdd.length > 0) {
        await addResponsibilities(experienceId, {
          responsibilities: toAdd.map(r => r.text)
        });
      }

      Swal.fire({
        icon: "success",
        title: "Experience Updated",
        text: "Your work experience and responsibilities have been successfully updated.",
        timer: 2000,
        showConfirmButton: false,
      });

      onExperienceUpdated?.();
      handleClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || error.message || "Failed to update experience",
        confirmButtonColor: "#6366f1"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="experience-modal-overlay" ref={overlayRef} onClick={handleClose}>
      <div className="experience-modal-box" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="experience-modal-header">
          <h2>Edit Experience</h2>
          <button
            className="experience-close-btn"
            onClick={handleClose}
            aria-label="Close modal"
            disabled={loading || loadingData}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="experience-modal-content">
          <p className="experience-modal-subtitle">Update the details of your professional experience.</p>

          {loadingData ? (
            <div className="loading-state">
              <p>Loading experience data...</p>
            </div>
          ) : (
            <form id="editExperienceForm" className="experience-modal-form" onSubmit={handleSubmit}>
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
                      value={item.text}
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
          )}
        </div>

        {/* Modal Footer / Actions */}
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
            form="editExperienceForm"
            className="experience-btn-add"
            disabled={loading || loadingData}
          >
            {loading ? "Updating..." : "Update Experience"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditExperienceModal;


