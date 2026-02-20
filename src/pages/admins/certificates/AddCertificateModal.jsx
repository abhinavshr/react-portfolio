import { useState, useEffect, useRef } from "react";
import { X, Award, Briefcase, Calendar, Link as LinkIcon, Hash } from "lucide-react";
import "../../../css/admin/certificates/AddCertificateModal.css";
import Swal from "sweetalert2";
import { addCertificate } from "../../../services/certificatesService";
import gsap from "gsap";

/**
 * AddCertificateModal Component
 * A modal window that allows administrators to add a new professional certificate.
 * Includes form validation and GSAP animations for entrance/exit.
 * 
 * @param {function} onClose - function to close the modal.
 * @param {function} onSuccess - callback to refresh the parent list upon successful addition.
 */
const AddCertificateModal = ({ onClose, onSuccess }) => {
  // --- State Management ---
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    issue_date: "",
    credential_id: "",
    verification_url: ""
  });

  const [loading, setLoading] = useState(false); // Submitting state
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  /**
   * Entrance Animation using GSAP on mount
   */
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      .fromTo(modalRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" },
        "-=0.1"
      );
  }, []);

  /**
   * Gracefully closes the modal with an exit animation.
   */
  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(modalRef.current, { scale: 0.9, opacity: 0, y: 20, duration: 0.3, ease: "power2.in" })
      .to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.1");
  };

  /**
   * Handles input changes and updates the form state.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Validates the form data before submission.
   * @returns {Object|null} Error object with type, title, and text, or null if valid.
   */
  const validateForm = () => {
    if (!formData.title.trim() || !formData.issuer.trim() || !formData.issue_date) {
      return { type: "error", title: "Missing Fields", text: "Please fill all required fields." };
    }
    if (formData.verification_url && !/^https?:\/\/.+/.test(formData.verification_url)) {
      return { type: "error", title: "Invalid URL", text: "Verification URL must start with http:// or https://." };
    }
    return null;
  };

  /**
   * Submits the form data to the backend.
   */
  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      Swal.fire({
        icon: "error",
        title: validationError.title,
        text: validationError.text,
        confirmButtonColor: "#6366f1"
      });
      return;
    }

    try {
      setLoading(true);
      await addCertificate(formData);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Certificate added successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      handleClose();
      onSuccess?.();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to add certificate",
        confirmButtonColor: "#6366f1"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-certificate-modal-overlay" ref={overlayRef} onClick={handleClose}>
      <div className="add-certificate-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header Section */}
        <div className="add-certificate-modal-header">
          <div>
            <h2>Add New Certificate</h2>
            <p>Showcase your latest achievements</p>
          </div>
          <button
            className="add-certificate-close-btn"
            onClick={handleClose}
            aria-label="Close modal"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Form Fields */}
        <div className="add-certificate-modal-body">
          <div className="add-certificate-form-group">
            <label><Award size={14} style={{ marginRight: '6px' }} /> Certificate Name <span>*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. AWS Certified Solutions Architect"
              disabled={loading}
            />
          </div>

          <div className="add-certificate-form-group">
            <label><Briefcase size={14} style={{ marginRight: '6px' }} /> Issuing Organization <span>*</span></label>
            <input
              type="text"
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              placeholder="e.g. Amazon Web Services"
              disabled={loading}
            />
          </div>

          <div className="add-certificate-form-group">
            <label><Calendar size={14} style={{ marginRight: '6px' }} /> Issue Date <span>*</span></label>
            <input
              type="date"
              name="issue_date"
              value={formData.issue_date}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="add-certificate-form-group">
            <label><Hash size={14} style={{ marginRight: '6px' }} /> Credential ID (Optional)</label>
            <input
              type="text"
              name="credential_id"
              value={formData.credential_id}
              onChange={handleChange}
              placeholder="Enter credential ID"
              disabled={loading}
            />
          </div>

          <div className="add-certificate-form-group">
            <label><LinkIcon size={14} style={{ marginRight: '6px' }} /> Verification URL (Optional)</label>
            <input
              type="url"
              name="verification_url"
              value={formData.verification_url}
              onChange={handleChange}
              placeholder="https://verify.certificate.com/..."
              disabled={loading}
            />
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="add-certificate-modal-footer">
          <button
            className="add-certificate-cancel-btn"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="add-certificate-add-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Certificate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCertificateModal;
