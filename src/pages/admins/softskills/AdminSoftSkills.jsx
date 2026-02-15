import React, { useEffect, useState, useCallback, useRef } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Pencil, Trash2, Plus, Eye, Brain } from "lucide-react";
import Swal from "sweetalert2";
import "../../../css/admin/softskills/AdminSoftSkills.css";
import { viewAllSoftSkills, deleteSoftSkill } from "../../../services/softSkillService";
import AddSoftSkillModal from "./AddSoftSkillModal";
import ViewSoftSkillModal from "./ViewSoftSkillModal";
import EditSoftSkillModal from "./EditSoftSkillModal";
import Pagination from "../../../components/admin/Pagination";
import { gsap } from "gsap";

const SkeletonSoftSkill = () => (
  <div className="soft-skill-card skeleton-soft-skill">
    <div className="skeleton-pulse title" />
    <div className="skeleton-pulse bar" />
    <div className="skeleton-pulse desc" />
    <div className="skeleton-pulse desc" style={{ width: "70%" }} />
  </div>
);

const AdminSoftSkills = () => {
  const [active, setActive] = useState("Soft Skills");
  const [softSkills, setSoftSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  const [modalState, setModalState] = useState({
    add: false,
    view: false,
    edit: false,
    selectedId: null,
  });

  const containerRef = useRef(null);

  const fetchSoftSkills = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await viewAllSoftSkills(page);
      const { current_page, last_page, total, per_page } = response.pagination;

      setSoftSkills(response.data || []);
      setPagination({
        currentPage: current_page,
        lastPage: last_page,
        total,
        from: (current_page - 1) * per_page + 1,
        to: (current_page - 1) * per_page + response.data.length,
      });
    } catch (error) {
      Swal.fire("Error!", error.message || "Failed to fetch soft skills.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSoftSkills();
  }, [fetchSoftSkills]);

  useEffect(() => {
    if (!loading && softSkills.length > 0) {
      gsap.fromTo(
        ".soft-skill-card",
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [loading, softSkills]);

  const handleDeleteSoftSkill = async (id, title) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${title}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it",
      background: "rgba(255, 255, 255, 0.95)",
      backdrop: `rgba(15, 23, 42, 0.4)`,
    });

    if (result.isConfirmed) {
      try {
        await deleteSoftSkill(id);
        Swal.fire({
          title: "Deleted!",
          text: "Soft skill has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchSoftSkills(pagination.currentPage);
      } catch (error) {
        Swal.fire("Error!", error.message || "Failed to delete soft skill.", "error");
      }
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content admin-soft-skill" ref={containerRef}>
        <div className="soft-skill-header">
          <div>
            <h1>Soft Skills</h1>
            <p>Manage and showcase your professional interpersonal skills</p>
          </div>
          <button
            className="add-soft-skill-btn"
            onClick={() => setModalState((prev) => ({ ...prev, add: true }))}
          >
            <Plus size={18} /> Add Soft Skill
          </button>
        </div>

        <div className="soft-skill-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
              <SkeletonSoftSkill key={i} />
            ))
            : softSkills.map((skill) => (
              <div className="soft-skill-card" key={skill.id}>
                <div className="soft-skill-card-header">
                  <h3>
                    <Brain size={20} className="inline-block mr-2 text-blue-500" />
                    {skill.name}
                  </h3>
                  <div className="soft-skill-actions">
                    <button
                      className="btn-view"
                      title="View Details"
                      onClick={() =>
                        setModalState({ view: true, selectedId: skill.id, add: false, edit: false })
                      }
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="btn-edit"
                      title="Edit Skill"
                      onClick={() =>
                        setModalState({ edit: true, selectedId: skill.id, add: false, view: false })
                      }
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn-delete"
                      title="Delete Skill"
                      onClick={() => handleDeleteSoftSkill(skill.id, skill.name)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="soft-skill-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <span>{skill.level}%</span>
                </div>

                <p className="soft-skill-description">
                  {skill.description || "No description provided."}
                </p>
              </div>
            ))}
        </div>

        {!loading && softSkills.length > 0 && (
          <div className="table-footer-soft-skill">
            <div className="table-summary-soft-skill">
              Showing {pagination.from} - {pagination.to} of {pagination.total} Skills
            </div>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.lastPage}
              onPageChange={(page) => fetchSoftSkills(page)}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <AddSoftSkillModal
        isOpen={modalState.add}
        onClose={() => setModalState((prev) => ({ ...prev, add: false }))}
        onSkillAdded={() => fetchSoftSkills(pagination.currentPage)}
      />

      {modalState.view && (
        <ViewSoftSkillModal
          isOpen={modalState.view}
          onClose={() => setModalState({ ...modalState, view: false, selectedId: null })}
          skillId={modalState.selectedId}
        />
      )}

      {modalState.edit && (
        <EditSoftSkillModal
          isOpen={modalState.edit}
          onClose={() => setModalState({ ...modalState, edit: false, selectedId: null })}
          skillId={modalState.selectedId}
          onSkillUpdated={() => fetchSoftSkills(pagination.currentPage)}
        />
      )}
    </div>
  );
};

export default AdminSoftSkills;
