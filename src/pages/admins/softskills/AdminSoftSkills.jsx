import React, { useEffect, useState } from "react";
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

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState(null);

  useEffect(() => {
    fetchSoftSkills();
  }, []);

  const fetchSoftSkills = async (page = 1) => {
    try {
      setLoading(true);
      const response = await viewAllSoftSkills(page);
      setSoftSkills(response.data || []);
      setPagination({
        currentPage: response.pagination.current_page,
        lastPage: response.pagination.last_page,
        total: response.pagination.total,
        from: (response.pagination.current_page - 1) * response.pagination.per_page + 1,
        to: (response.pagination.current_page - 1) * response.pagination.per_page + response.data.length,
      });
    } catch (error) {
      console.error("Failed to fetch soft skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSoftSkill = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);
  const handleSoftSkillAdded = () => {
    fetchSoftSkills(pagination.currentPage);
    setIsAddModalOpen(false);
  };

  const handleViewSoftSkill = (id) => {
    setSelectedSkillId(id);
    setIsViewModalOpen(true);
  };
  const handleCloseViewModal = () => {
    setSelectedSkillId(null);
    setIsViewModalOpen(false);
  };

  const handleEditSoftSkill = (id) => {
    setSelectedSkillId(id);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setSelectedSkillId(null);
    setIsEditModalOpen(false);
  };
  const handleSoftSkillUpdated = () => {
    fetchSoftSkills(pagination.currentPage);
    setIsEditModalOpen(false);
  };

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
        console.error("Failed to delete skill:", error);
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

          <button className="add-soft-skill-btn" onClick={handleAddSoftSkill}>
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
                  <FiEdit2 title="Edit" onClick={() => handleEditSoftSkill(skill.id)} />
                  <FiTrash2
                    title="Delete"
                    onClick={() => handleDeleteSoftSkill(skill.id, skill.name)}
                  />
                  <FiEye title="View" onClick={() => handleViewSoftSkill(skill.id)} />
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
              onPageChange={(page) => {
                setLoading(true);
                fetchSoftSkills(page);
              }}
            />
          </div>
        )}
      </main>

      <AddSoftSkillModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSkillAdded={handleSoftSkillAdded}
      />

      {isViewModalOpen && selectedSkillId && (
        <ViewSoftSkillModal
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          skillId={selectedSkillId}
        />
      )}

      {isEditModalOpen && selectedSkillId && (
        <EditSoftSkillModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          skillId={selectedSkillId}
          onSkillUpdated={handleSoftSkillUpdated}
        />
      )}
    </div>
  );
};

export default AdminSoftSkills;
