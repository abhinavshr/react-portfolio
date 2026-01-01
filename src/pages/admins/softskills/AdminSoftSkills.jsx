import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { FiEdit2, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import "../../../css/admin/softskills/AdminSoftSkills.css";
import { viewAllSoftSkills } from "../../../services/softSkillService";
import AddSoftSkillModal from "./AddSoftSkillModal";
import ViewSoftSkillModal from "./ViewSoftSkillModal";
import EditSoftSkillModal from "./EditSoftSkillModal"; 

const AdminSoftSkills = () => {
  const [active, setActive] = useState("Soft Skills");
  const [softSkills, setSoftSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState(null);

  useEffect(() => {
    fetchSoftSkills();
  }, []);

  // Fetch all soft skills
  const fetchSoftSkills = async () => {
    try {
      const response = await viewAllSoftSkills();
      setSoftSkills(response.data || []);
    } catch (error) {
      console.error("Failed to fetch soft skills:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add Modal Handlers
  const handleAddSoftSkill = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);
  const handleSoftSkillAdded = () => {
    fetchSoftSkills();
    setIsAddModalOpen(false);
  };

  // View Modal Handlers
  const handleViewSoftSkill = (id) => {
    setSelectedSkillId(id);
    setIsViewModalOpen(true);
  };
  const handleCloseViewModal = () => {
    setSelectedSkillId(null);
    setIsViewModalOpen(false);
  };

  // Edit Modal Handlers
  const handleEditSoftSkill = (id) => {
    setSelectedSkillId(id);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setSelectedSkillId(null);
    setIsEditModalOpen(false);
  };
  const handleSoftSkillUpdated = () => {
    fetchSoftSkills();
    setIsEditModalOpen(false);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <AdminSidebar active={active} setActive={setActive} />

      {/* Main Content */}
      <main className="admin-content admin-soft-skill">
        {/* Header */}
        <div className="soft-skill-header">
          <div>
            <h1>Soft Skills</h1>
            <p>Manage your interpersonal and professional skills</p>
          </div>

          <button className="add-soft-skill-btn" onClick={handleAddSoftSkill}>
            <FiPlus /> Add Soft Skill
          </button>
        </div>

        {/* Loading */}
        {loading && <p>Loading soft skills...</p>}

        {/* Empty State */}
        {!loading && softSkills.length === 0 && <p>No soft skills found.</p>}

        {/* Soft Skill Cards */}
        <div className="soft-skill-grid">
          {softSkills.map((skill) => (
            <div className="soft-skill-card" key={skill.id}>
              <div className="soft-skill-card-header">
                <h3>{skill.name}</h3>
                <div className="soft-skill-actions">
                  <FiEdit2 title="Edit" onClick={() => handleEditSoftSkill(skill.id)} />
                  <FiTrash2 title="Delete" />
                  <FiEye title="View" onClick={() => handleViewSoftSkill(skill.id)} />
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
      </main>

      {/* Add Soft Skill Modal */}
      <AddSoftSkillModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSkillAdded={handleSoftSkillAdded}
      />

      {/* View Soft Skill Modal */}
      {isViewModalOpen && selectedSkillId && (
        <ViewSoftSkillModal
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          skillId={selectedSkillId}
        />
      )}

      {/* Edit Soft Skill Modal */}
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
