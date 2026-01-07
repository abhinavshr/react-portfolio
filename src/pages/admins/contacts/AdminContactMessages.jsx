import { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Eye, Trash2, Search } from "lucide-react";
import "../../../css/admin/contacts/AdminContactMessages.css";
import Swal from "sweetalert2";
import { viewAllContactMessages } from "../../../services/contactMessagesService";
import ViewContactModal from "./ViewContactModal";

const AdminContactMessages = () => {
  const [active, setActive] = useState("Contacts");
  const [filter, setFilter] = useState("all");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await viewAllContactMessages();

      const formatted = res.data.map((msg) => ({
        id: msg.id,
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
        date: msg.created_at,
        unread: !msg.is_read
      }));

      setMessages(formatted);
    } catch (err) {
      Swal.fire("Error", "Failed to load messages", "error", err);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = messages.filter((m) => m.unread).length;

  const filteredMessages = messages.filter((msg) => {
    if (filter === "unread") return msg.unread;
    if (filter === "read") return !msg.unread;
    return true;
  });

  const handleDelete = async (msg) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete message from "${msg.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#2563eb",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      Swal.fire("Deleted!", "Message has been deleted.", "success");
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        <div className="contact-messages-container">
          {/* Header */}
          <div className="contact-messages-header">
            <h1>Contact Messages</h1>
            <p>{unreadCount} unread messages</p>
          </div>

          {/* Toolbar */}
          <div className="contact-toolbar-card">
            <div className="contact-toolbar-inner">
              <div className="contact-messages-search">
                <Search size={18} />
                <input type="text" placeholder="Search messages..." />
              </div>

              <div className="contact-messages-filters">
                <button
                  className={`filter-btn ${filter === "all" ? "active" : ""}`}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>

                <button
                  className={`filter-btn ${filter === "unread" ? "active" : ""}`}
                  onClick={() => setFilter("unread")}
                >
                  Unread ({unreadCount})
                </button>

                <button
                  className={`filter-btn ${filter === "read" ? "active" : ""}`}
                  onClick={() => setFilter("read")}
                >
                  Read
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          {loading ? (
            <p>Loading messages...</p>
          ) : (
            <div className="contact-messages-list">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`contact-message-card ${msg.unread ? "unread" : ""
                    }`}
                >
                  <div className="message-left">
                    <div className="message-avatar">
                      {msg.name.charAt(0)}
                    </div>

                    <div className="message-content">
                      <h3 className="message-name">
                        {msg.name}
                        {msg.unread && <span className="unread-dot" />}
                      </h3>

                      <p className="message-email">{msg.email}</p>
                      <h4 className="message-subject">{msg.subject}</h4>
                      <p className="message-text">{msg.message}</p>
                    </div>
                  </div>

                  <div className="message-right">
                    <span className="message-date">
                      {new Date(msg.date).toLocaleDateString()}
                    </span>

                    <div className="message-actions">
                      <button
                        className="icon-btn view"
                        onClick={() => {
                          setSelectedContactId(msg.id);
                          setIsViewOpen(true);
                        }}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => handleDelete(msg)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <ViewContactModal
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          contactId={selectedContactId}
        />
      </main>
    </div>
  );
};

export default AdminContactMessages;
