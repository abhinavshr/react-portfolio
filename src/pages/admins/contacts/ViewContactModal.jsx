import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import "../../../css/admin/contacts/ViewContactModal.css";
import {
    viewContactMessageById,
    markContactAsRead,
} from "../../../services/contactMessagesService";

const ViewContactModal = ({ isOpen, onClose, contactId, onRefresh }) => {
    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !contactId) return;

        const fetchAndMarkRead = async () => {
            try {
                setLoading(true);
                const res = await viewContactMessageById(contactId);
                const message = res.data;
                setContact(message);

                if (!message.is_read) {
                    await markContactAsRead(contactId);
                    setContact((prev) => ({ ...prev, is_read: true }));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAndMarkRead();
    }, [isOpen, contactId]);

    const handleClose = () => {
        onClose();
        if (onRefresh) onRefresh();
    };

    if (!isOpen) return null;

    return (
        <div className="view-contact-overlay">
            <div className="view-contact-modal">
                <div className="view-contact-header">
                    <h2>Message Details</h2>
                    <button className="close-btn" onClick={handleClose}>
                        <FiX size={22} />
                    </button>
                </div>

                <div className="view-contact-body">
                    {loading ? (
                        <p className="loading-text">Loading message...</p>
                    ) : contact ? (
                        <>
                            <div className="info-row">
                                <span className="label">From</span>
                                <div className="value">
                                    <strong>{contact.name}</strong>
                                    <small>
                                        <a href={`mailto:${contact.email}`} className="email-link">
                                            {contact.email}
                                        </a>
                                    </small>
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
                                    className={`status-badge ${contact.is_read ? "read" : "unread"
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

                <div className="view-contact-footer">
                    <button className="close-modal-btn" onClick={handleClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewContactModal;
