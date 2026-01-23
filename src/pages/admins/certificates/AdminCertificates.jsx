import { useState, useEffect } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Plus, Edit, Trash2, Award, ExternalLink } from "lucide-react";
import "../../../css/admin/certificates/AdminCertificates.css";
import Swal from "sweetalert2";
import { viewAllCertificates, deleteCertificate } from "../../../services/certificatesService";
import AddCertificateModal from "./AddCertificateModal";
import EditCertificateModal from "./EditCertificateModal";
import Pagination from "../../../components/admin/Pagination";
import { motion as Motion } from "framer-motion";

const AdminCertificates = () => {
  const [active, setActive] = useState("Certificates");
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCertificateId, setSelectedCertificateId] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  const fetchCertificates = async (page = 1) => {
    try {
      setLoading(true);
      const res = await viewAllCertificates(page);
      setCertificates(res.data || []);
      if (res.pagination) {
        setPagination({
          currentPage: res.pagination.current_page,
          lastPage: res.pagination.last_page,
          total: res.pagination.total,
          from: res.pagination.from,
          to: res.pagination.to,
        });
      }
    } catch (error) {
      setError(error.message || "Failed to load certificates");
      Swal.fire("Error", error.message || "Failed to load certificates", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleDelete = async (cert) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete "${cert.title}" certificate?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCertificate(cert.id);
      Swal.fire("Deleted!", "Certificate has been deleted.", "success");
      fetchCertificates(pagination.currentPage);
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to delete certificate", "error");
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        <div className="certificates-container">
          <div className="certificates-header">
            <div>
              <h1>Certificates</h1>
              <p>Manage your professional certifications</p>
            </div>
            <button
              className="add-certificate-btn"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={18} /> Add Certificate
            </button>
          </div>

          {loading && <p>Loading certificates...</p>}
          {error && <p className="error-text">{error}</p>}

          <div className="certificates-grid">
            {!loading && certificates.length === 0 && (
              <p>No certificates found.</p>
            )}

            {certificates.map((cert, index) => (
              <Motion.div
                key={cert.id}
                className="certificate-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(37,99,235,0.5)" }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="certificate-top">
                  <div className="certificate-icon">
                    <Award size={26} />
                  </div>
                  <div className="certificate-actions">
                    <button
                      className="icon-btn edit"
                      onClick={() => {
                        setSelectedCertificateId(cert.id);
                        setShowEditModal(true);
                      }}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete(cert)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h3 className="certificate-title">{cert.title}</h3>
                <p className="certificate-org">{cert.issuer}</p>

                <div className="certificate-meta">
                  <span>
                    Issued: {cert.issue_date ? cert.issue_date.split("T")[0] : ""}
                  </span>
                  {cert.credential_id && (
                    <span>ID: {cert.credential_id}</span>
                  )}
                </div>

                {cert.verification_url && (
                  <a
                    href={cert.verification_url}
                    className="verify-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Verify <ExternalLink size={14} />
                  </a>
                )}
              </Motion.div>
            ))}
          </div>

          {!loading && certificates.length > 0 && (
            <div className="table-footer-certificates">
              <div className="table-summary-certificates">
                Showing {pagination.from} to {pagination.to} of {pagination.total} certificates
              </div>
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.lastPage}
                onPageChange={(page) => {
                  setLoading(true);
                  fetchCertificates(page);
                }}
              />
            </div>
          )}
        </div>

        {showAddModal && (
          <AddCertificateModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => fetchCertificates(pagination.currentPage)}
          />
        )}

        {showEditModal && (
          <EditCertificateModal
            certificateId={selectedCertificateId}
            onClose={() => setShowEditModal(false)}
            onSuccess={() => {
              setShowEditModal(false);
              fetchCertificates(pagination.currentPage);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default AdminCertificates;
