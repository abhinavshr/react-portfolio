import { X } from "lucide-react";
import "../../../css/admin/certificates/AddCertificateModal.css";

const AddCertificateModal = () => {
  return (
    <div className="add-certificate-modal-overlay">
      <div className="add-certificate-modal">

        {/* Header */}
        <div className="add-certificate-modal-header">
          <div>
            <h2>Add New Certificate</h2>
            <p>Add a new certificate to your profile</p>
          </div>

          <button className="add-certificate-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="add-certificate-modal-body">

          <div className="add-certificate-form-group">
            <label>Certificate Name <span>*</span></label>
            <input type="text" placeholder="" />
          </div>

          <div className="add-certificate-form-group">
            <label>Issuing Organization <span>*</span></label>
            <input type="text" placeholder="" />
          </div>

          <div className="add-certificate-form-group">
            <label>Issue Date <span>*</span></label>
            <input type="date" />
          </div>

          <div className="add-certificate-form-group">
            <label>Credential ID (Optional)</label>
            <input type="text" placeholder="" />
          </div>

          <div className="add-certificate-form-group">
            <label>Verification URL (Optional)</label>
            <input type="url" placeholder="https://" />
          </div>

        </div>

        {/* Footer */}
        <div className="add-certificate-modal-footer">
          <button className="add-certificate-cancel-btn">Cancel</button>
          <button className="add-certificate-add-btn">Add</button>
        </div>

      </div>
    </div>
  );
};

export default AddCertificateModal;
