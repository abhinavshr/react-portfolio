import { useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Eye, Trash2, Search } from "lucide-react";
import "../../../css/admin/contacts/AdminContactMessages.css";
import Swal from "sweetalert2";

const AdminContactMessages = () => {
  const [active, setActive] = useState("Contacts");
  const [filter, setFilter] = useState("all");

  const messages = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      subject: "Project Inquiry",
      message:
        "Hi, I'm interested in discussing a potential project collaboration. Could we schedule a call?",
      date: "2024-12-22",
      unread: true
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      subject: "Collaboration Opportunity",
      message:
        "I came across your portfolio and I'm impressed with your work. I'd love to discuss a collaboration opportunity.",
      date: "2024-12-21",
      unread: true
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike@example.com",
      subject: "Question about your work",
      message:
        "I saw your e-commerce project and I have some questions about the technology stack you used.",
      date: "2024-12-20",
      unread: false
    }
  ];

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

          {/* Toolbar Container */}
          <div className="contact-toolbar-card">
            <div className="contact-toolbar-inner">
              {/* Search */}
              <div className="contact-messages-search">
                <Search size={18} />
                <input type="text" placeholder="Search messages..." />
              </div>

              {/* Filters */}
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
          <div className="contact-messages-list">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`contact-message-card ${msg.unread ? "unread" : ""}`}
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
                  <span className="message-date">{msg.date}</span>

                  <div className="message-actions">
                    <button className="icon-btn view">
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
        </div>
      </main>
    </div>
  );
};

export default AdminContactMessages;
