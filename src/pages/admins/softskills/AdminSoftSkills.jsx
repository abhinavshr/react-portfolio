import React, { useEffect, useState, useCallback } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { FiEdit2, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import Swal from "sweetalert2";
import "../../../css/admin/softskills/AdminSoftSkills.css";
import { viewAllSoftSkills, deleteSoftSkill } from "../../../services/softSkillService";
import AddSoftSkillModal from "./AddSoftSkillModal";
import ViewSoftSkillModal from "./ViewSoftSkillModal";
import EditSoftSkillModal from "./EditSoftSkillModal";
import Pagination from "../../../components/admin/Pagination";
import { motion as Motion } from "framer-motion";

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

  const handleDeleteSoftSkill = async (id, title) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${title}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteSoftSkill(id);
        Swal.fire("Deleted!", `"${title}" has been deleted.`, "success");
        fetchSoftSkills(pagination.currentPage);
      } catch (error) {
        Swal.fire("Error!", error.message || "Failed to delete soft skill.", "error");
      }
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content admin-soft-skill">
        <div className="soft-skill-header">
          <div>
            <h1>Soft Skills</h1>
            <p>Manage your interpersonal and professional skills</p>
          </div>
          <button
            className="add-soft-skill-btn"
            onClick={() => setModalState((prev) => ({ ...prev, add: true }))}
          >
            <FiPlus /> Add Soft Skill
          </button>
        </div>

        {loading && <p>Loading soft skills...</p>}
        {!loading && softSkills.length === 0 && <p>No soft skills found.</p>}

        <div className="soft-skill-grid">
          {softSkills.map((skill, index) => (
            <Motion.div
              className="soft-skill-card"
              key={skill.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="soft-skill-card-header">
                <h3>{skill.name}</h3>
                <div className="soft-skill-actions">
                  <FiEdit2
                    title="Edit"
                    onClick={() =>
                      setModalState({ edit: true, selectedId: skill.id, add: false, view: false })
                    }
                  />
                  <FiTrash2
                    title="Delete"
                    onClick={() => handleDeleteSoftSkill(skill.id, skill.name)}
                  />
                  <FiEye
                    title="View"
                    onClick={() =>
                      setModalState({ view: true, selectedId: skill.id, add: false, edit: false })
                    }
                  />
                </div>
              </div>

              <div className="soft-skill-progress">
                <div className="progress-bar">
                  <Motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <span>{skill.level}%</span>
              </div>

              <p className="soft-skill-description">
                {skill.description || "No description provided."}
              </p>
            </Motion.div>
          ))}
        </div>

        {!loading && softSkills.length > 0 && (
          <div className="table-footer-soft-skill">
            <div className="table-summary-soft-skill">
              Showing {pagination.from} to {pagination.to} of {pagination.total} skills
            </div>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.lastPage}
              onPageChange={(page) => fetchSoftSkills(page)}
            />
          </div>
        )}
      </main>

      <AddSoftSkillModal
        isOpen={modalState.add}
        onClose={() => setModalState((prev) => ({ ...prev, add: false }))}
        onSkillAdded={() => {
          fetchSoftSkills(pagination.currentPage);
          setModalState((prev) => ({ ...prev, add: false }));
        }}
      />

      {modalState.view && modalState.selectedId && (
        <ViewSoftSkillModal
          isOpen={modalState.view}
          onClose={() => setModalState((prev) => ({ ...prev, view: false, selectedId: null }))}
          skillId={modalState.selectedId}
        />
      )}

      {modalState.edit && modalState.selectedId && (
        <EditSoftSkillModal
          isOpen={modalState.edit}
          onClose={() => setModalState((prev) => ({ ...prev, edit: false, selectedId: null }))}
          skillId={modalState.selectedId}
          onSkillUpdated={() => {
            fetchSoftSkills(pagination.currentPage);
            setModalState((prev) => ({ ...prev, edit: false, selectedId: null }));
          }}
        />
      )}
    </div>
  );
};

export default AdminSoftSkills;
