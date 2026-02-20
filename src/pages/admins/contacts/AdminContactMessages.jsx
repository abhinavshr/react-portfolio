import { useEffect, useState, useCallback, useRef } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Eye, Trash2, Search, Mail, Calendar, MessageSquare } from "lucide-react";
import "../../../css/admin/contacts/AdminContactMessages.css";
import Swal from "sweetalert2";
import {
  viewAllContactMessages,
  deleteContactMessage,
} from "../../../services/contactMessagesService";
import ViewContactModal from "./ViewContactModal";
import Pagination from "../../../components/admin/Pagination";
import gsap from "gsap";

/**
 * SkeletonContactCard component
 * Displays a loading state for individual contact message cards.
 */
const SkeletonContactCard = () => (
  <div className="contact-message-card skeleton-contact">
    <div className="message-left">
      <div className="skeleton-avatar" />
      <div className="message-content">
        <div className="skeleton-line name" />
        <div className="skeleton-line email" />
        <div className="skeleton-line subject" />
        <div className="skeleton-line text" />
      </div>
    </div>

    <div className="message-right">
      <div className="skeleton-line date" />
      <div className="skeleton-actions">
        <div className="skeleton-icon" />
        <div className="skeleton-icon" />
      </div>
    </div>
  </div>
);

/**
 * AdminContactMessages Component
 * Manages and displays the list of contact messages received from users.
 * Features: Filtering, Searching, Pagination, Viewing Details, and Deletion.
 */
const AdminContactMessages = () => {
  // --- State Management ---
  const [active, setActive] = useState("Contacts"); // Active sidebar menu item
  const [filter, setFilter] = useState("all"); // Current filter: all, unread, read
  const [searchTerm, setSearchTerm] = useState(""); // Search query
  const [messages, setMessages] = useState([]); // List of messages
  const [loading, setLoading] = useState(true); // Loading state for data fetching

  // --- Refs for Animations ---
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const toolbarRef = useRef(null);

  // --- Modal State ---
  const [modalState, setModalState] = useState({
    view: false,
    selectedId: null,
  });

  // --- Pagination State ---
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  /**
   * Fetches contact messages from the service based on the specified page.
   * @param {number} page - The page number to fetch.
   */
  const fetchMessages = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await viewAllContactMessages(page);

      // Formating the API response to match component needs
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

      // Update pagination state
      const { current_page, last_page, total, from, to } = res.data;
      setPagination({ currentPage: current_page, lastPage: last_page, total, from, to });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message || "Failed to load messages",
        customClass: {
          popup: "premium-swal-popup",
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  /**
   * GSAP Entrance Animation for Message Cards
   * Triggers whenever the loading finishes or messages list changes.
   */
  useEffect(() => {
    if (!loading && messages.length > 0) {
      const cards = containerRef.current.querySelectorAll(".contact-message-card");

      gsap.fromTo(cards,
        {
          opacity: 0,
          x: -30,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out"
        }
      );
    }
  }, [loading, messages]);

  /**
   * GSAP Animation for Header and Toolbar
   * Runs once on component mount.
   */
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
    if (toolbarRef.current) {
      gsap.fromTo(toolbarRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
      );
    }
  }, []);

  // Total count of unread messages currently in state
  const unreadCount = messages.filter((m) => m.unread).length;

  /**
   * Filter and Search Logic
   * Filters the messages based on the search term and current filter status.
   */
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

  /**
   * Handles message deletion with a confirmation dialog.
   * @param {Object} msg - The message object to delete.
   */
  const handleDelete = async (msg) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the message from "${msg.name}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#fff",
      customClass: {
        popup: "premium-swal-popup",
      }
    });

    if (!result.isConfirmed) return;

    try {
      await deleteContactMessage(msg.id);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Message has been removed successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
      // Refresh the current page after deletion
      fetchMessages(pagination.currentPage);
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to delete message", "error");
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        <div className="contact-messages-container">
          {/* Header Section */}
          <div className="contact-messages-header" ref={headerRef}>
            <div>
              <h1>Contact Messages</h1>
              <p>You have {unreadCount} unread messages waiting for your response</p>
            </div>
          </div>

          {/* Toolbar: Search and Filters */}
          <div className="contact-toolbar-card" ref={toolbarRef}>
            <div className="contact-toolbar-inner">
              <div className="contact-messages-search">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search by name, email or subject..."
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

          {/* Messages List Area */}
          {loading ? (
            <div className="contact-messages-list">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonContactCard key={i} />
              ))}
            </div>
          ) : (
            <div className="contact-messages-list" ref={containerRef}>
              {filteredMessages.length === 0 ? (
                <div className="no-data">
                  <Mail size={48} />
                  <p>No messages found matching your criteria.</p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
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
                        <div className="message-email">
                          <Mail size={14} style={{ marginRight: "6px", verticalAlign: "middle" }} />
                          {msg.email}
                        </div>
                        <h4 className="message-subject">
                          <MessageSquare size={14} style={{ marginRight: "6px", verticalAlign: "middle" }} />
                          {msg.subject}
                        </h4>
                        <p className="message-text">{msg.message}</p>
                      </div>
                    </div>

                    <div className="message-right">
                      <span className="message-date">
                        <Calendar size={14} style={{ marginRight: "6px", verticalAlign: "middle" }} />
                        {new Date(msg.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <div className="message-actions">
                        <button
                          className="icon-btn view"
                          onClick={() => setModalState({ view: true, selectedId: msg.id })}
                          title="View Message"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          className="icon-btn delete"
                          onClick={() => handleDelete(msg)}
                          title="Delete Message"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Pagination Footer */}
          {!loading && messages.length > 0 && (
            <div className="table-footer-contacts">
              <div className="table-summary-contacts">
                Showing <b>{pagination.from}</b> to <b>{pagination.to}</b> of <b>{pagination.total}</b> messages
              </div>
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.lastPage}
                onPageChange={(page) => fetchMessages(page)}
              />
            </div>
          )}
        </div>

        {/* View Details Modal overlay */}
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
