import React, { useEffect, useState, useCallback } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { viewAllSkills, deleteSkill } from "../../../services/skillService";
import "../../../css/admin/skills/AdminSkill.css";
import AddSkillModal from "./AddSkillModal";
import EditSkillModal from "./EditSkillModal";
import Swal from "sweetalert2";
import Pagination from "../../../components/admin/Pagination";
import { motion as Motion } from "framer-motion";

const PER_SKILL_PAGE = 6;

const AdminSkill = () => {
  const [active, setActive] = useState("Skills");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState(null);

  const [categoryPagination, setCategoryPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 3,
  });

  const [skillPagination, setSkillPagination] = useState({});

  const fetchSkills = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await viewAllSkills(page);
      const paginated = res.data;

      setCategories(paginated.data || []);
      setCategoryPagination({
        currentPage: paginated.current_page,
        lastPage: paginated.last_page,
        total: paginated.total,
        perPage: paginated.per_page,
      });
    } catch {
      Swal.fire("Error", "Failed to load skills", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills(1);
  }, [fetchSkills]);

  const handleDelete = useCallback(
    async (skillId, skillName) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Delete "${skillName}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#2563eb",
        confirmButtonText: "Yes, delete it!",
      });

      if (!result.isConfirmed) return;

      try {
        await deleteSkill(skillId);
        Swal.fire("Deleted!", "Skill deleted successfully.", "success");
        fetchSkills(categoryPagination.currentPage);
      } catch {
        Swal.fire("Error", "Failed to delete skill", "error");
      }
    },
    [fetchSkills, categoryPagination.currentPage]
  );

  const getPaginatedSkills = useCallback(
    (category) => {
      const skills = category.skills || [];
      const currentPage = skillPagination[category.id]?.currentPage || 1;
      const totalPages = Math.ceil(skills.length / PER_SKILL_PAGE);

      const paginated = skills.slice(
        (currentPage - 1) * PER_SKILL_PAGE,
        currentPage * PER_SKILL_PAGE
      );

      const from = (currentPage - 1) * PER_SKILL_PAGE + 1;
      const to = Math.min(currentPage * PER_SKILL_PAGE, skills.length);

      return { skills, paginated, currentPage, totalPages, from, to };
    },
    [skillPagination]
  );

  return (
    <div className="admin-layout">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-content admin-skill">
        <div className="admin-skill-header">
          <div>
            <h1>Technical Skills</h1>
            <p>Manage your technical skill set</p>
          </div>
          <button
            className="add-skill-btn"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FiPlus /> Add Skill
          </button>
        </div>

        <AddSkillModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSkillAdded={() => fetchSkills(categoryPagination.currentPage)}
        />

        {loading ? (
          <div className="empty-state">Loading skills...</div>
        ) : (
          categories.map((category, index) => {
            const {
              skills,
              paginated,
              currentPage,
              totalPages,
              from,
              to,
            } = getPaginatedSkills(category);

            return (
              <Motion.div
                key={category.id}
                className="skill-card glow-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 18px rgba(37, 99, 235, 0.6)",
                }}
              >
                <h3 className="skill-category">{category.name}</h3>

                <table className="skill-table">
                  <thead>
                    <tr>
                      <th>SKILL NAME</th>
                      <th>LEVEL</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((skill) => (
                      <tr key={skill.id}>
                        <td>{skill.name}</td>
                        <td>
                          <div className="skill-level-wrapper">
                            <div className="skill-bar">
                              <div
                                className="skill-bar-fill"
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                            <span>{skill.level}%</span>
                          </div>
                        </td>
                        <td className="skill-actions">
                          <button
                            className="icon-btn edit"
                            onClick={() => {
                              setSelectedSkillId(skill.id);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className="icon-btn delete"
                            onClick={() =>
                              handleDelete(skill.id, skill.name)
                            }
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {totalPages > 1 && (
                  <div className="table-footer-skills">
                    <div className="table-summary-skills">
                      Showing {from} to {to} of {skills.length} skills
                    </div>

                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) =>
                        setSkillPagination((prev) => ({
                          ...prev,
                          [category.id]: { currentPage: page },
                        }))
                      }
                    />
                  </div>
                )}
              </Motion.div>
            );
          })
        )}

        {categoryPagination.lastPage > 1 && (
          <div className="table-footer-skills">
            <div className="table-summary-skills">
              Showing{" "}
              {(categoryPagination.currentPage - 1) *
                categoryPagination.perPage +
                1}{" "}
              to{" "}
              {Math.min(
                categoryPagination.currentPage *
                  categoryPagination.perPage,
                categoryPagination.total
              )}{" "}
              of {categoryPagination.total} categories
            </div>

            <Pagination
              currentPage={categoryPagination.currentPage}
              totalPages={categoryPagination.lastPage}
              onPageChange={(page) => fetchSkills(page)}
            />
          </div>
        )}

        {isEditModalOpen && (
          <EditSkillModal
            isOpen={isEditModalOpen}
            skillId={selectedSkillId}
            onClose={() => setIsEditModalOpen(false)}
            onSkillUpdated={() =>
              fetchSkills(categoryPagination.currentPage)
            }
          />
        )}
      </main>
    </div>
  );
};

export default AdminSkill;
