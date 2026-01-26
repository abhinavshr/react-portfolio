import { useState, useEffect, useCallback } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Plus, Edit, Trash2, Award, ExternalLink } from "lucide-react";
import "../../../css/admin/certificates/AdminCertificates.css";
import Swal from "sweetalert2";
import { viewAllCertificates, deleteCertificate } from "../../../services/certificatesService";
import AddCertificateModal from "./AddCertificateModal";
import EditCertificateModal from "./EditCertificateModal";
import Pagination from "../../../components/admin/Pagination";
import { motion as Motion } from "framer-motion";

/* ------------ SKELETON CARD ------------ */
const SkeletonCertificateCard = () => (
  <div className="certificate-card skeleton-certificate">
    <div className="certificate-top">
      <div className="skeleton-icon-lg" />
      <div className="skeleton-actions">
        <div className="skeleton-icon" />
        <div className="skeleton-icon" />
      </div>
    </div>

    <div className="skeleton-line title" />
    <div className="skeleton-line org" />

    <div className="certificate-meta">
      <div className="skeleton-line meta" />
      <div className="skeleton-line meta short" />
    </div>

    <div className="skeleton-line link" />
  </div>
);

const AdminCertificates = () => {
  const [active, setActive] = useState("Certificates");
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    selectedId: null,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  const fetchCertificates = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await viewAllCertificates(page);
      setCertificates(res.data || []);
      if (res.pagination) {
        const { current_page, last_page, total, from, to } = res.pagination;
        setPagination({ currentPage: current_page, lastPage: last_page, total, from, to });
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to load certificates", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const handleDelete = async (cert) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete "${cert.title}" certificate?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
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
              onClick={() => setModalState((prev) => ({ ...prev, add: true }))}
            >
              <Plus size={18} /> Add Certificate
            </button>
          </div>

          {/* ---------- SKELETON ---------- */}
          {loading && (
            <div className="certificates-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCertificateCard key={i} />
              ))}
            </div>
          )}

          {/* ---------- REAL GRID ---------- */}
          {!loading && (
            <div className="certificates-grid">
              {certificates.length === 0 && <p>No certificates found.</p>}

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
                        onClick={() =>
                          setModalState({ edit: true, selectedId: cert.id, add: false })
                        }
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
                    {cert.credential_id && <span>ID: {cert.credential_id}</span>}
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
          )}

          {!loading && certificates.length > 0 && (
            <div className="table-footer-certificates">
              <div className="table-summary-certificates">
                Showing {pagination.from} to {pagination.to} of {pagination.total} certificates
              </div>
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.lastPage}
                onPageChange={(page) => fetchCertificates(page)}
              />
            </div>
          )}
        </div>

        {modalState.add && (
          <AddCertificateModal
            onClose={() => setModalState((prev) => ({ ...prev, add: false }))}
            onSuccess={() => fetchCertificates(pagination.currentPage)}
          />
        )}

        {modalState.edit && modalState.selectedId && (
          <EditCertificateModal
            certificateId={modalState.selectedId}
            onClose={() =>
              setModalState((prev) => ({ ...prev, edit: false, selectedId: null }))
            }
            onSuccess={() => fetchCertificates(pagination.currentPage)}
          />
        )}
      </main>
    </div>
  );
};

export default AdminCertificates;
