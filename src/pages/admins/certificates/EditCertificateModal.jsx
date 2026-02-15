import { useEffect, useState, useRef } from "react";
import { X, Award, Briefcase, Calendar, Link as LinkIcon, Hash } from "lucide-react";
import "../../../css/admin/certificates/AddCertificateModal.css";
import Swal from "sweetalert2";
import { viewCertificateById, updateCertificate } from "../../../services/certificatesService";
import gsap from "gsap";

const EditCertificateModal = ({ certificateId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    issue_date: "",
    credential_id: "",
    verification_url: ""
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!certificateId) return;

    const fetchCertificate = async () => {
      try {
        setLoadingData(true);
        const res = await viewCertificateById(certificateId);
        const cert = res.certificate;

        setFormData({
          title: cert.title ?? "",
          issuer: cert.issuer ?? "",
          issue_date: cert.issue_date ? cert.issue_date.split("T")[0] : "",
          credential_id: cert.credential_id ?? "",
          verification_url: cert.verification_url ?? ""
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to load certificate data",
          confirmButtonColor: "#6366f1"
        });
        onClose();
      } finally {
        setLoadingData(false);
      }
    };

    fetchCertificate();
  }, [certificateId, onClose]);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      .fromTo(modalRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" },
        "-=0.1"
      );
  }, []);

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(modalRef.current, { scale: 0.9, opacity: 0, y: 20, duration: 0.3, ease: "power2.in" })
      .to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.1");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.title.trim() || !formData.issuer.trim() || !formData.issue_date) {
      return { type: "error", title: "Missing Fields", text: "Please fill all required fields." };
    }
    if (formData.verification_url && !/^https?:\/\/.+/.test(formData.verification_url)) {
      return { type: "error", title: "Invalid URL", text: "Verification URL must start with http:// or https://." };
    }
    return null;
  };

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
      await updateCertificate(certificateId, formData);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Certificate updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      handleClose();
      onSuccess?.();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update certificate",
        confirmButtonColor: "#6366f1"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!certificateId) return null;

  return (
    <div className="add-certificate-modal-overlay" ref={overlayRef} onClick={handleClose}>
      <div className="add-certificate-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="add-certificate-modal-header">
          <div>
            <h2>Edit Certificate</h2>
            <p>Update your achievement details</p>
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

        {/* Body */}
        {loadingData ? (
          <div className="loading-data">
            <div className="spinner"></div>
            <p>Loading certificate data...</p>
          </div>
        ) : (
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
        )}

        {/* Footer */}
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
            disabled={loading || loadingData}
          >
            {loading ? "Updating..." : "Update Certificate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCertificateModal;
