import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { FiEdit2, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import "../../../css/admin/softskills/AdminSoftSkills.css";
import { viewAllSoftSkills } from "../../../services/softSkillService";
import AddSoftSkillModal from "./AddSoftSkillModal"; 

const AdminSoftSkills = () => {
  const [active, setActive] = useState("Soft Skills");
  const [softSkills, setSoftSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    fetchSoftSkills();
  }, []);

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

  const handleAddSoftSkill = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSoftSkillAdded = () => {
    fetchSoftSkills();
    setIsModalOpen(false);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

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

        {/* Skill Cards */}
        <div className="soft-skill-grid">
          {softSkills.map((skill) => (
            <div className="soft-skill-card" key={skill.id}>
              <div className="soft-skill-card-header">
                <h3>{skill.name}</h3>
                <div className="soft-skill-actions">
                  <FiEdit2 title="Edit" />
                  <FiTrash2 title="Delete" />
                  <FiEye title="View" />
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
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSkillAdded={handleSoftSkillAdded}
      />
    </div>
  );
};

export default AdminSoftSkills;
