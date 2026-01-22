import { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Eye, Trash2, Search } from "lucide-react";
import "../../../css/admin/contacts/AdminContactMessages.css";
import Swal from "sweetalert2";
import { viewAllContactMessages, deleteContactMessage } from "../../../services/contactMessagesService";
import ViewContactModal from "./ViewContactModal";
import Pagination from "../../../components/admin/Pagination";

const AdminContactMessages = () => {
  const [active, setActive] = useState("Contacts");
  const [filter, setFilter] = useState("all");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState("");

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async (page = 1) => {
    try {
      setLoading(true);
      const res = await viewAllContactMessages(page);

      const formatted = res.data.data.map((msg) => ({
        id: msg.id,
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
        date: msg.created_at,
        unread: !msg.is_read,
      }));

      setMessages(formatted);
      setPagination({
        currentPage: res.data.current_page,
        lastPage: res.data.last_page,
        total: res.data.total,
        from: res.data.from,
        to: res.data.to,
      });
    } catch (err) {
      setError(err.message || "Failed to load messages");
      Swal.fire("Error", err.message || "Failed to load messages", "error");
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
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteContactMessage(msg.id);
        Swal.fire("Deleted!", "Message has been deleted.", "success");
        fetchMessages(pagination.currentPage);
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to delete message", "error");
      }
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        <div className="contact-messages-container">
          <div className="contact-messages-header">
            <h1>Contact Messages</h1>
            <p>{unreadCount} unread messages</p>
          </div>

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

          {loading ? (
            <p>Loading messages...</p>
          ) : (
            <div className="contact-messages-list">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`contact-message-card ${msg.unread ? "unread" : ""}`}
                >
                  <div className="message-left">
                    <div className="message-avatar">{msg.name.charAt(0)}</div>
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

          {!loading && messages.length > 0 && (
            <div className="table-footer-contacts">
              <div className="table-summary-contacts">
                Showing {pagination.from} to {pagination.to} of {pagination.total} messages
              </div>
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.lastPage}
                onPageChange={(page) => {
                  setLoading(true);
                  fetchMessages(page);
                }}
              />
            </div>
          )}
        </div>

        <ViewContactModal
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          contactId={selectedContactId}
          onRefresh={() => fetchMessages(pagination.currentPage)}
        />
      </main>
    </div>
  );
};

export default AdminContactMessages;
