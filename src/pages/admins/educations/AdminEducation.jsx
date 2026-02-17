import { useEffect, useState, useCallback, useRef } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Plus, Edit, Trash2, Eye, GraduationCap, Calendar, Info } from "lucide-react";
import "../../../css/admin/educations/AdminEducation.css";
import Swal from "sweetalert2";
import { viewAllEducations, deleteEducation } from "../../../services/educationService";
import AddEducationModal from "./AddEducationModal";
import ViewEducationModal from "./ViewEducationModal";
import EditEducationModal from "./EditEducationModal";
import Pagination from "../../../components/admin/Pagination";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/* ---------- Skeleton Card ---------- */
const SkeletonEducation = () => (
  <div className="education-card skeleton-education">
    <div className="skeleton-input title" />
    <div className="skeleton-input subtitle" />
    <div className="skeleton-input meta" />
    <div className="skeleton-input desc" />
  </div>
);

const AdminEducation = () => {
  const [active, setActive] = useState("Education");
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  const [modalState, setModalState] = useState({
    add: false,
    view: false,
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

  const fetchEducations = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await viewAllEducations(page);
      const { data, current_page, last_page, total, from, to } = response.data;
      setEducations(data || []);
      setPagination({ currentPage: current_page, lastPage: last_page, total, from, to });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Connection Error",
        text: err.message || "Failed to fetch educations. Please check your connection.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEducations();
  }, [fetchEducations]);

  useGSAP(() => {
    if (!loading) {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 0.8 }
      });

      // Header Animation
      tl.fromTo(".education-header",
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1 }
      );

      // Cards or Empty State Animation
      if (educations.length > 0) {
        tl.fromTo(".education-card",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
            clearProps: "transform,opacity"
          },
          "-=0.5"
        );

        // Footer Animation
        tl.fromTo(".table-footer-education",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        );
      } else {
        tl.fromTo(".empty-state",
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.6 }
        );
      }
    }
  }, { dependencies: [loading, educations], scope: containerRef });

  const handleDelete = async (edu) => {
    const result = await Swal.fire({
      title: "Delete Education?",
      text: `Are you sure you want to remove "${edu.level} from ${edu.institution}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      customClass: {
        title: "swal2-title-custom",
        popup: "swal2-popup-custom",
      }
    });

    if (result.isConfirmed) {
      try {
        await deleteEducation(edu.id);
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Education record has been removed.",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchEducations(pagination.currentPage);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to delete education",
        });
      }
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content" ref={containerRef}>
        <div className="admin-education-page">
          <header className="education-header">
            <div>
              <h1>Education</h1>
              <p>Manage your academic journey and qualifications</p>
            </div>
            <button
              className="add-education-btn"
              onClick={() => setModalState((prev) => ({ ...prev, add: true }))}
            >
              <Plus size={20} strokeWidth={2.5} /> Add New Record
            </button>
          </header>

          {/* ---------- Skeletons ---------- */}
          {loading ? (
            <div className="education-skeleton-wrapper">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonEducation key={i} />
              ))}
            </div>
          ) : educations.length > 0 ? (
            <div className="education-list">
              {educations.map((edu) => (
                <div key={edu.id} className="education-card">
                  <div className="education-card-header">
                    <h2 className="education-title">
                      <GraduationCap size={24} className="edu-icon" strokeWidth={2.5} />
                      <span>{edu.level} {edu.program && <span className="program-text">({edu.program})</span>}</span>
                    </h2>
                    <div className="education-actions">
                      <button
                        className="icon-btn view"
                        title="View Details"
                        onClick={() =>
                          setModalState({ view: true, selectedId: edu.id, add: false, edit: false })
                        }
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="icon-btn edit"
                        title="Edit Record"
                        onClick={() =>
                          setModalState({ edit: true, selectedId: edu.id, add: false, view: false })
                        }
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="icon-btn delete"
                        title="Delete Record"
                        onClick={() => handleDelete(edu)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <h4>{edu.institution}</h4>

                  <div className="education-duration">
                    <Calendar size={16} className="calendar-icon" />
                    <span>
                      {edu.start_year} — {edu.end_year}
                      {edu.board && (
                        <>
                          <span className="dot mx-2">•</span>
                          <span className="board-text">Board: {edu.board}</span>
                        </>
                      )}
                    </span>
                  </div>

                  {edu.description && (
                    <p className="education-description">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <Info size={40} />
              </div>
              <p>No education records found. Start by adding your first qualification.</p>
              <button
                className="add-education-btn mt-4"
                onClick={() => setModalState((prev) => ({ ...prev, add: true }))}
                style={{ margin: '1rem auto' }}
              >
                Add Education
              </button>
            </div>
          )}

          {!loading && educations.length > 0 && (
            <footer className="table-footer-education">
              <div className="table-summary">
                Showing <strong>{pagination.from || 0}</strong> to <strong>{pagination.to || 0}</strong> of <strong>{pagination.total}</strong> records
              </div>
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.lastPage}
                onPageChange={(page) => fetchEducations(page)}
              />
            </footer>
          )}
        </div>

        {/* ---------- Modals ---------- */}
        <AddEducationModal
          isOpen={modalState.add}
          onClose={() => setModalState((prev) => ({ ...prev, add: false }))}
          onEducationAdded={() => fetchEducations(pagination.currentPage)}
        />

        {modalState.view && modalState.selectedId && (
          <ViewEducationModal
            isOpen={modalState.view}
            onClose={() => setModalState((prev) => ({ ...prev, view: false, selectedId: null }))}
            educationId={modalState.selectedId}
          />
        )}

        {modalState.edit && modalState.selectedId && (
          <EditEducationModal
            isOpen={modalState.edit}
            onClose={() => setModalState((prev) => ({ ...prev, edit: false, selectedId: null }))}
            educationId={modalState.selectedId}
            onEducationUpdated={() => fetchEducations(pagination.currentPage)}
          />
        )}
      </main>
    </div>
  );
};

export default AdminEducation;

