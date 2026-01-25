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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      issuer: "",
      issue_date: "",
      credential_id: "",
      verification_url: ""
    });
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
      await addCertificate(formData);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Certificate added successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      resetForm();
      onClose();
      onSuccess?.();
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
            aria-label="Close modal"
            disabled={loading}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="add-certificate-modal-body">
          {["title", "issuer", "issue_date", "credential_id", "verification_url"].map((field, idx) => (
            <div className="add-certificate-form-group" key={idx}>
              <label>
                {field === "title" && <>Certificate Name <span>*</span></>}
                {field === "issuer" && <>Issuing Organization <span>*</span></>}
                {field === "issue_date" && <>Issue Date <span>*</span></>}
                {field === "credential_id" && "Credential ID (Optional)"}
                {field === "verification_url" && "Verification URL (Optional)"}
              </label>
              <input
                type={field === "issue_date" ? "date" : field === "verification_url" ? "url" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field === "verification_url" ? "https://" : ""}
                required={["title", "issuer", "issue_date"].includes(field)}
                disabled={loading}
              />
            </div>
          ))}
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
