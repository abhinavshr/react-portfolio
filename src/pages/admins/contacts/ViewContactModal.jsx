import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import "../../../css/admin/contacts/ViewContactModal.css";
import { viewContactMessageById } from "../../../services/contactMessagesService";

const ViewContactModal = ({ isOpen, onClose, contactId }) => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !contactId) return;

    const fetchContact = async () => {
      try {
        setLoading(true);
        const res = await viewContactMessageById(contactId);
        setContact(res.data);
      } catch (err) {
        console.error("Failed to fetch contact", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [isOpen, contactId]);

  if (!isOpen) return null;

  return (
    <div className="view-contact-overlay">
      <div className="view-contact-modal">
        {/* Header */}
        <div className="view-contact-header">
          <h2>Message Details</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="view-contact-body">
          {loading ? (
            <p className="loading-text">Loading message...</p>
          ) : contact ? (
            <>
              <div className="info-row">
                <span className="label">From</span>
                <div className="value">
                  <strong>{contact.name}</strong>
                  <small>{contact.email}</small>
                </div>
              </div>

              <div className="info-row">
                <span className="label">Subject</span>
                <div className="value">{contact.subject}</div>
              </div>

              <div className="message-box">
                <p>{contact.message}</p>
              </div>

              <div className="meta-row">
                <span
                  className={`status-badge ${
                    contact.is_read ? "read" : "unread"
                  }`}
                >
                  {contact.is_read ? "Read" : "Unread"}
                </span>

                <span className="date">
                  {new Date(contact.created_at).toLocaleString()}
                </span>
              </div>
            </>
          ) : (
            <p className="error-text">Failed to load message</p>
          )}
        </div>

        {/* Footer */}
        <div className="view-contact-footer">
          <button className="close-modal-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewContactModal;
