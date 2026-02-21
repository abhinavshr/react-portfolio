import { useState, useEffect, useCallback, useRef } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Plus, Edit, Trash2, Eye, Briefcase, Calendar, MapPin } from "lucide-react";
import "../../../css/admin/experiences/AdminExperience.css";
import Swal from "sweetalert2";
import { viewAllExperiences, deleteExperience } from "../../../services/experienceService";
import AddExperienceModal from "./AddExperienceModal";
import ViewExperienceModal from "./ViewExperienceModal";
import EditExperienceModal from "./EditExperienceModal";
import Pagination from "../../../components/admin/Pagination";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * SkeletonExperienceCard component
 * Renders a placeholder card while experience data is loading.
 */
const SkeletonExperienceCard = () => {
  return (
    <div className="experience-card skeleton-experience">
      <div className="experience-card-header">
        <div className="skeleton-line title" />
        <div className="skeleton-actions">
          <div className="skeleton-icon" />
          <div className="skeleton-icon" />
          <div className="skeleton-icon" />
        </div>
      </div>

      <div className="skeleton-line company" />

      <div className="experience-meta">
        <div className="skeleton-line meta" />
        <div className="skeleton-line meta" />
      </div>

      <div className="skeleton-line desc" />
      <div className="skeleton-line desc short" />
    </div>
  );
};

/**
 * AdminExperience Component
 * Manages the display and administration of work experience entries.
 * Features: Pagination, CRUD operations (via modals), and GSAP-powered animations.
 */
const AdminExperience = () => {
  // --- State Management ---
  const [active, setActive] = useState("Experience"); // Active sidebar menu item
  const [experiences, setExperiences] = useState([]); // List of work experiences
  const [loading, setLoading] = useState(true); // Loading state for API calls

  const containerRef = useRef(null); // Ref for GSAP animation scope

  // --- Modal Visibility State ---
  const [modalState, setModalState] = useState({
    add: false,
    view: false,
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
   * Fetches work experience records from the server.
   * @param {number} page - The page number to retrieve.
   */
  const fetchExperiences = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await viewAllExperiences(page);
      const { data, current_page, last_page, total, from, to } = response.data;
      setExperiences(data || []);
      setPagination({ currentPage: current_page, lastPage: last_page, total, from, to });
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to fetch experiences", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  /**
   * GSAP entrance animation for experience cards.
   * Triggers when the loader hides and data is available.
   */
  useGSAP(() => {
    if (!loading && experiences.length > 0) {
      gsap.fromTo(
        ".experience-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "all",
        }
      );
    }
  }, { scope: containerRef, dependencies: [loading, experiences] });

  /**
   * Handles scroll lock and positioning when modals are active.
   */
  useEffect(() => {
    const content = document.querySelector(".admin-content");

    if (!content) return;

    if (modalState.add || modalState.edit || modalState.view) {
      content.scrollTo({ top: 0, behavior: "smooth" });
      content.style.overflow = "hidden";
    } else {
      content.style.overflow = "auto";
    }

    return () => {
      content.style.overflow = "auto";
    };
  }, [modalState]);

  /**
   * Orchestrates the deletion of an experience entry.
   * Includes optimistic UI update and background re-sync.
   * @param {Object} exp - The experience object to delete.
   */
  const handleDelete = async (exp) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete "${exp.company_name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        // Optimistic UI update: Remove from list immediately
        setExperiences((prev) => prev.filter((item) => item.id !== exp.id));

        await deleteExperience(exp.id);
        Swal.fire({
          title: "Deleted!",
          text: "Experience has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        // Silently re-sync data to ensure pagination consistency
        const response = await viewAllExperiences(pagination.currentPage);
        const { data, current_page, last_page, total, from, to } = response.data;
        setExperiences(data || []);
        setPagination({ currentPage: current_page, lastPage: last_page, total, from, to });

      } catch (error) {
        // Revert UI to previous state on failure
        fetchExperiences(pagination.currentPage);
        Swal.fire("Error", error.message || "Failed to delete experience", "error");
      }
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        <div className="experience-container" ref={containerRef}>
          {/* Main Header */}
          <div className="experience-header">
            <div>
              <h1>Experience</h1>
              <p>Manage your work experience</p>
            </div>
            <button
              className="add-experience-btn"
              onClick={() => setModalState((prev) => ({ ...prev, add: true }))}
            >
              <Plus size={18} /> Add Experience
            </button>
          </div>

          {/* Conditional Rendering: Loading, Empty, or Data */}
          {loading &&
            Array.from({ length: 5 }).map((_, i) => (
              <SkeletonExperienceCard key={i} />
            ))}

          {!loading && experiences.length === 0 && <p className="no-data">No experiences found.</p>}

          {!loading &&
            experiences.map((exp) => (
              <div key={exp.id} className="experience-card">
                <div className="experience-card-header">
                  <h2 className="experience-title">
                    <Briefcase className="experience-icon" />
                    {exp.role}
                  </h2>
                  <div className="experience-actions">
                    <button
                      className="icon-btn view"
                      onClick={() =>
                        setModalState({ view: true, selectedId: exp.id, add: false, edit: false })
                      }
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="icon-btn edit"
                      onClick={() =>
                        setModalState({ edit: true, selectedId: exp.id, add: false, view: false })
                      }
                      title="Edit Experience"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete(exp)}
                      title="Delete Experience"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h4 className="company">{exp.company_name}</h4>

                <div className="experience-meta">
                  <span>
                    <Calendar size={14} /> {exp.start_date} -{" "}
                    {exp.is_current ? "Present" : exp.end_date}
                  </span>
                  <span>
                    <MapPin size={14} /> {exp.company_location || "N/A"}
                  </span>
                  {exp.is_current && <span className="badge">Current</span>}
                </div>

                <p className="experience-description">{exp.description}</p>

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="experience-responsibilities">
                    <h4>Responsibilities</h4>
                    <ul>
                      {exp.responsibilities.map((item) => (
                        <li key={item.id}>{item.responsibility}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

          {/* Pagination Footer */}
          {!loading && experiences.length > 0 && (
            <div className="table-footer-experience">
              <div className="table-summary-experience">
                Showing {pagination.from} to {pagination.to} of {pagination.total} experiences
              </div>
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.lastPage}
                onPageChange={(page) => fetchExperiences(page)}
              />
            </div>
          )}
        </div>

        {/* Modals for Adding, Viewing, and Editing */}
        <AddExperienceModal
          isOpen={modalState.add}
          onClose={() => setModalState((prev) => ({ ...prev, add: false }))}
          onExperienceAdded={() => fetchExperiences(pagination.currentPage)}
        />

        {modalState.view && modalState.selectedId && (
          <ViewExperienceModal
            isOpen={modalState.view}
            onClose={() => setModalState((prev) => ({ ...prev, view: false, selectedId: null }))}
            experienceId={modalState.selectedId}
          />
        )}

        {modalState.edit && modalState.selectedId && (
          <EditExperienceModal
            isOpen={modalState.edit}
            onClose={() => setModalState((prev) => ({ ...prev, edit: false, selectedId: null }))}
            experienceId={modalState.selectedId}
            onExperienceUpdated={() => fetchExperiences(pagination.currentPage)}
          />
        )}
      </main>
    </div>
  );
};

export default AdminExperience;
