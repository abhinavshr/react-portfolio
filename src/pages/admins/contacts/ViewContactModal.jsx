import { useEffect, useState } from "react";
import { X, User, Mail, MessageSquare, Clock, CheckCircle, Info } from "lucide-react";
import "../../../css/admin/contacts/ViewContactModal.css";
import {
    viewContactMessageById,
    markContactAsRead,
} from "../../../services/contactMessagesService";

/**
 * ViewContactModal Component
 * A modal window that displays the full details of a single contact message.
 * It automatically marks the message as 'read' upon opening if it wasn't already.
 * 
 * @param {boolean} isOpen - Controls the visibility of the modal.
 * @param {function} onClose - function to close the modal.
 * @param {string|number} contactId - The unique ID of the contact message to display.
 * @param {function} onRefresh - Callback to refresh the parent's message list.
 */
const ViewContactModal = ({ isOpen, onClose, contactId, onRefresh }) => {
    // --- State Management ---
    const [contact, setContact] = useState(null); // Contact message details
    const [loading, setLoading] = useState(false); // Loading state for fetching details

    /**
     * Effect Hook: Fetches details when the modal opens or contactId changes.
     * If the message is unread, it triggers an API call to mark it as read.
     */
    useEffect(() => {
        if (!isOpen || !contactId) return;

        const fetchAndMarkRead = async () => {
            try {
                setLoading(true);
                // Fetch full message details
                const res = await viewContactMessageById(contactId);
                const message = res.data;
                setContact(message);

                // If message is unread, mark it as read in the backend
                if (!message.is_read) {
                    await markContactAsRead(contactId);
                    setContact((prev) => ({ ...prev, is_read: true }));
                }
            } catch (err) {
                console.error("Error fetching contact details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAndMarkRead();
    }, [isOpen, contactId]);

    /**
     * Closes the modal and triggers a refresh of the parent message list.
     */
    const handleClose = () => {
        onClose();
        if (onRefresh) onRefresh();
    };

    // Render nothing if the modal is not open
    if (!isOpen) return null;

    return (
        <div className="view-contact-overlay">
            <div className="view-contact-modal">
                {/* Modal Header */}
                <div className="view-contact-header">
                    <h2>Message Details</h2>
                    <button className="close-btn" onClick={handleClose} title="Close">
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="view-contact-body">
                    {loading ? (
                        <p className="loading-text">Loading message...</p>
                    ) : contact ? (
                        <>
                            {/* Sender Information */}
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

                            {/* Subject Section */}
                            <div className="info-row">
                                <span className="label">
                                    <Info size={14} style={{ marginRight: '6px' }} />
                                    Subject
                                </span>
                                <div className="value">{contact.subject}</div>
                            </div>

                            {/* Message Content */}
                            <div className="info-row">
                                <span className="label">
                                    <MessageSquare size={14} style={{ marginRight: '6px' }} />
                                    Message
                                </span>
                                <div className="message-box">
                                    <p>{contact.message}</p>
                                </div>
                            </div>

                            {/* Meta Data: Status and Date */}
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

                {/* Modal Footer */}
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
