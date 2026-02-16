import { useEffect, useState } from "react";
import { X, User, Mail, MessageSquare, Clock, CheckCircle, Info } from "lucide-react";
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
                        <X size={20} />
                    </button>
                </div>

                <div className="view-contact-body">
                    {loading ? (
                        <p className="loading-text">Loading message...</p>
                    ) : contact ? (
                        <>
                            <div className="info-row">
                                <span className="label">
                                    <User size={14} style={{ marginRight: '6px' }} />
                                    From
                                </span>
                                <div className="value">
                                    <strong>{contact.name}</strong>
                                    <small>
                                        <a href={`mailto:${contact.email}`} className="email-link">
                                            <Mail size={12} style={{ marginRight: '4px' }} />
                                            {contact.email}
                                        </a>
                                    </small>
                                </div>
                            </div>

                            <div className="info-row">
                                <span className="label">
                                    <Info size={14} style={{ marginRight: '6px' }} />
                                    Subject
                                </span>
                                <div className="value">{contact.subject}</div>
                            </div>

                            <div className="info-row">
                                <span className="label">
                                    <MessageSquare size={14} style={{ marginRight: '6px' }} />
                                    Message
                                </span>
                                <div className="message-box">
                                    <p>{contact.message}</p>
                                </div>
                            </div>

                            <div className="meta-row">
                                <span
                                    className={`status-badge ${contact.is_read ? "read" : "unread"}`}
                                >
                                    {contact.is_read ? (
                                        <><CheckCircle size={12} style={{ marginRight: '4px' }} /> Read</>
                                    ) : (
                                        <><Clock size={12} style={{ marginRight: '4px' }} /> Unread</>
                                    )}
                                </span>

                                <span className="date">
                                    <Clock size={14} style={{ marginRight: '6px' }} />
                                    {new Date(contact.created_at).toLocaleString("en-US", {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
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
