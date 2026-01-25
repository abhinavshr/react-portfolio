import { useEffect, useState } from "react";
import { X } from "lucide-react";
import "../../../css/admin/certificates/AddCertificateModal.css";
import Swal from "sweetalert2";
import { viewCertificateById, updateCertificate } from "../../../services/certificatesService";

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
        Swal.fire("Error", error.message || "Failed to load certificate data", "error");
        onClose();
      } finally {
        setLoadingData(false);
      }
    };

    fetchCertificate();
  }, [certificateId, onClose]);

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
      Swal.fire({ icon: validationError.type, title: validationError.title, text: validationError.text });
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

      onClose();
      onSuccess?.();
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to update certificate", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!certificateId) return null;

  return (
    <div className="add-certificate-modal-overlay">
      <div className="add-certificate-modal">
        {/* Header */}
        <div className="add-certificate-modal-header">
          <div>
            <h2>Edit Certificate</h2>
            <p>Update your certificate details</p>
          </div>
          <button
            className="add-certificate-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            disabled={loading}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        {loadingData ? (
          <p>Loading certificate data...</p>
        ) : (
          <div className="add-certificate-modal-body">
            <div className="add-certificate-form-group">
              <label>Certificate Name <span>*</span></label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="add-certificate-form-group">
              <label>Issuing Organization <span>*</span></label>
              <input
                type="text"
                name="issuer"
                value={formData.issuer}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="add-certificate-form-group">
              <label>Issue Date <span>*</span></label>
              <input
                type="date"
                name="issue_date"
                value={formData.issue_date}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="add-certificate-form-group">
              <label>Credential ID (Optional)</label>
              <input
                type="text"
                name="credential_id"
                value={formData.credential_id}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="add-certificate-form-group">
              <label>Verification URL (Optional)</label>
              <input
                type="url"
                name="verification_url"
                value={formData.verification_url}
                onChange={handleChange}
                placeholder="https://"
                disabled={loading}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="add-certificate-modal-footer">
          <button
            className="add-certificate-cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="add-certificate-add-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCertificateModal;
