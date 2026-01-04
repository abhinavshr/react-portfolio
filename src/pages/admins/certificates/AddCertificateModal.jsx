import { useState } from "react";
import { X } from "lucide-react";
import "../../../css/admin/certificates/AddCertificateModal.css";
import Swal from "sweetalert2";
import { addCertificate } from "../../../services/certificatesService";

const AddCertificateModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    issue_date: "",
    credential_id: "",
    verification_url: ""
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!formData.title || !formData.issuer || !formData.issue_date) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }

    try {
      setLoading(true);
      await addCertificate(formData); // Call API
      Swal.fire("Success", "Certificate added successfully!", "success");
      onClose(); // Close modal
      if (onSuccess) onSuccess(); // Refresh main page
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to add certificate", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-certificate-modal-overlay">
      <div className="add-certificate-modal">

        {/* Header */}
        <div className="add-certificate-modal-header">
          <div>
            <h2>Add New Certificate</h2>
            <p>Add a new certificate to your profile</p>
          </div>

          <button
            className="add-certificate-close-btn"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="add-certificate-modal-body">
          <div className="add-certificate-form-group">
            <label>Certificate Name <span>*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="add-certificate-form-group">
            <label>Issuing Organization <span>*</span></label>
            <input
              type="text"
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
            />
          </div>

          <div className="add-certificate-form-group">
            <label>Issue Date <span>*</span></label>
            <input
              type="date"
              name="issue_date"
              value={formData.issue_date}
              onChange={handleChange}
            />
          </div>

          <div className="add-certificate-form-group">
            <label>Credential ID (Optional)</label>
            <input
              type="text"
              name="credential_id"
              value={formData.credential_id}
              onChange={handleChange}
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
            />
          </div>
        </div>

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
            {loading ? "Adding..." : "Add"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddCertificateModal;
