import { useState, useEffect, useCallback, useRef } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Plus, Edit, Trash2, Award, ExternalLink, Calendar, IdCard } from "lucide-react";
import "../../../css/admin/certificates/AdminCertificates.css";
import Swal from "sweetalert2";
import { viewAllCertificates, deleteCertificate } from "../../../services/certificatesService";
import AddCertificateModal from "./AddCertificateModal";
import EditCertificateModal from "./EditCertificateModal";
import Pagination from "../../../components/admin/Pagination";
import gsap from "gsap";

/**
 * SkeletonCertificateCard component
 * Displays a loading state for individual certificate cards.
 */
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

/**
 * AdminCertificates Component
 * This is the main management page for personal certificates and professional achievements.
 * It provides functionality for viewing, adding, editing, and deleting certificates.
 */
const AdminCertificates = () => {
  // --- State Management ---
  const [active, setActive] = useState("Certificates"); // Sidebar active state
  const [certificates, setCertificates] = useState([]); // List of certificates
  const [loading, setLoading] = useState(true); // Loading state for data fetching

  // --- Animation Refs ---
  const containerRef = useRef(null);
  const headerRef = useRef(null);

  // --- Modal Management State ---
  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
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
   * Fetches certificates from the service for a specific page.
   * @param {number} page - The page number to fetch.
   */
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
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Failed to load certificates",
        customClass: {
          popup: "premium-swal-popup",
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch on mount
  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  /**
   * GSAP Entrance Animation for Certificate Cards
   * Triggers whenever the load is finished and data is present.
   */
  useEffect(() => {
    if (!loading && certificates.length > 0) {
      const cards = containerRef.current.querySelectorAll(".certificate-card");

      gsap.fromTo(cards,
        {
          opacity: 0,
          y: 40,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out"
        }
      );
    }
  }, [loading, certificates]);

  /**
   * Header entrance animation with GSAP
   */
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  /**
   * Handles the deletion of a single certificate.
   * Prompts user with a confirmation dialog before proceeding.
   * @param {Object} cert - The certificate object to delete.
   */
  const handleDelete = async (cert) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${cert.title}". This action cannot be undone!`,
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
      await deleteCertificate(cert.id);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Certificate has been removed successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
      // Refresh current page list
      fetchCertificates(pagination.currentPage);
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to delete certificate", "error");
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar navigation */}
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        <div className="certificates-container">
          {/* Dashboard Header */}
          <div className="certificates-header" ref={headerRef}>
            <div>
              <h1>Certificates</h1>
              <p>Manage and showcase your professional achievements</p>
            </div>
            <button
              className="add-certificate-btn"
              onClick={() => setModalState((prev) => ({ ...prev, add: true }))}
            >
              <Plus size={20} /> Add Certificate
            </button>
          </div>

          {/* Skeleton loading display */}
          {loading && (
            <div className="certificates-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCertificateCard key={i} />
              ))}
            </div>
          )}

          {/* Certificate grid display */}
          {!loading && (
            <div className="certificates-grid" ref={containerRef}>
              {certificates.length === 0 && (
                <div className="no-data">
                  <Award size={48} />
                  <p>No certificates found. Start by adding one!</p>
                </div>
              )}

              {certificates.map((cert) => (
                <div key={cert.id} className="certificate-card">
                  <div className="certificate-top">
                    <div className="certificate-icon">
                      <Award size={28} />
                    </div>
                    <div className="certificate-actions">
                      <button
                        className="icon-btn edit"
                        onClick={() =>
                          setModalState({ edit: true, selectedId: cert.id, add: false })
                        }
                        title="Edit Certificate"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => handleDelete(cert)}
                        title="Delete Certificate"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <h3 className="certificate-title">{cert.title}</h3>
                  <div className="certificate-org">{cert.issuer}</div>

                  <div className="certificate-meta">
                    <span>
                      <Calendar size={14} />
                      Issued: {cert.issue_date ? cert.issue_date.split("T")[0] : "N/A"}
                    </span>
                    {cert.credential_id && (
                      <span>
                        <IdCard size={14} />
                        ID: {cert.credential_id}
                      </span>
                    )}
                  </div>

                  {cert.verification_url && (
                    <a
                      href={cert.verification_url}
                      className="verify-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Verify Authenticity <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && certificates.length > 0 && (
            <div className="table-footer-certificates">
              <div className="table-summary-certificates">
                Showing <b>{pagination.from}</b> to <b>{pagination.to}</b> of <b>{pagination.total}</b> certificates
              </div>
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.lastPage}
                onPageChange={(page) => fetchCertificates(page)}
              />
            </div>
          )}
        </div>

        {/* Action Modals */}
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
