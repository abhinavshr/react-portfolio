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

/* ------------------ SKELETON CARD ------------------ */
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

const AdminExperience = () => {
  const [active, setActive] = useState("Experience");
  const [experiences, setExperiences] = useState([]);
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

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

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

        // Re-fetch to sync pagination if needed, but not strictly necessary for visual if we are okay with count being off until next page load
        // But let's fetch silently without setting loading to true to avoid layout shift
        const response = await viewAllExperiences(pagination.currentPage);
        const { data, current_page, last_page, total, from, to } = response.data;
        setExperiences(data || []);
        setPagination({ currentPage: current_page, lastPage: last_page, total, from, to });

      } catch (error) {
        // Revert on error
        fetchExperiences(pagination.currentPage);
        Swal.fire("Error", error.message || "Failed to delete experience", "error");
      }
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content">
        <div className="experience-container" ref={containerRef}>
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

          {/* ---------- SKELETON LOADING ---------- */}
          {loading &&
            Array.from({ length: 5 }).map((_, i) => (
              <SkeletonExperienceCard key={i} />
            ))}

          {/* ---------- EMPTY ---------- */}
          {!loading && experiences.length === 0 && <p>No experiences found.</p>}

          {/* ---------- REAL DATA ---------- */}
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
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="icon-btn edit"
                      onClick={() =>
                        setModalState({ edit: true, selectedId: exp.id, add: false, view: false })
                      }
                    >
                      <Edit size={18} />
                    </button>
                    <button className="icon-btn delete" onClick={() => handleDelete(exp)}>
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
