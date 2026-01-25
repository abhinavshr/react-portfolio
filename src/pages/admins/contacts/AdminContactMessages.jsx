import { useEffect, useState, useCallback } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Eye, Trash2, Search } from "lucide-react";
import "../../../css/admin/contacts/AdminContactMessages.css";
import Swal from "sweetalert2";
import { viewAllContactMessages, deleteContactMessage } from "../../../services/contactMessagesService";
import ViewContactModal from "./ViewContactModal";
import Pagination from "../../../components/admin/Pagination";
import { motion as Motion } from "framer-motion";

const AdminContactMessages = () => {
  const [active, setActive] = useState("Contacts");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalState, setModalState] = useState({
    view: false,
    selectedId: null,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  const fetchMessages = useCallback(async (page = 1) => {
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
      const { current_page, last_page, total, from, to } = res.data;
      setPagination({ currentPage: current_page, lastPage: last_page, total, from, to });
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to load messages", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const unreadCount = messages.filter((m) => m.unread).length;

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
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
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
              {filteredMessages.map((msg, index) => (
                <Motion.div
                  key={msg.id}
                  className={`contact-message-card ${msg.unread ? "unread" : ""}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(37,99,235,0.4)" }}
                  whileTap={{ scale: 0.97 }}
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
                        onClick={() => setModalState({ view: true, selectedId: msg.id })}
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
                </Motion.div>
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
                onPageChange={(page) => fetchMessages(page)}
              />
            </div>
          )}
        </div>

        {modalState.view && modalState.selectedId && (
          <ViewContactModal
            isOpen={modalState.view}
            onClose={() => setModalState({ view: false, selectedId: null })}
            contactId={modalState.selectedId}
            onRefresh={() => fetchMessages(pagination.currentPage)}
          />
        )}
      </main>
    </div>
  );
};

export default AdminContactMessages;
