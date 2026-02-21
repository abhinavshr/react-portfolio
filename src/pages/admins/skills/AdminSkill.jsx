import React, { useEffect, useState, useCallback, useRef } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Pencil, Trash2, Plus, Code2, Layers, Cpu, Sparkles } from "lucide-react";
import { viewAllSkills, deleteSkill } from "../../../services/skillService";
import "../../../css/admin/skills/AdminSkill.css";
import AddSkillModal from "./AddSkillModal";
import EditSkillModal from "./EditSkillModal";
import Swal from "sweetalert2";
import Pagination from "../../../components/admin/Pagination";
import { gsap } from "gsap";

const PER_SKILL_PAGE = 6;

/**
 * Skeleton component for skill cards to show during initial data load.
 */
const SkeletonSkillCard = () => (
  <div className="skill-card skeleton-skill">
    <div className="skeleton-pulse title" />
    <div className="skill-table">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton-pulse skeleton-row" />
      ))}
    </div>
  </div>
);

/**
 * AdminSkill Component
 * 
 * Manages the technical skills section of the admin dashboard.
 * Categorizes skills (e.g., Frontend, Backend) and provides CRUD operations.
 */
const AdminSkill = () => {
  const [active, setActive] = useState("Skills");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState(null);

  // Pagination for categories and nested skills
  const [categoryPagination, setCategoryPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 3,
  });
  const [skillPagination, setSkillPagination] = useState({});
  const containerRef = useRef(null);

  /**
   * Fetches skills grouped by categories.
   */
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

  // Initial load
  useEffect(() => {
    fetchSkills(1);
  }, [fetchSkills]);

  // Entrance animations for skill cards
  useEffect(() => {
    if (!loading && categories.length > 0) {
      gsap.fromTo(
        ".skill-card",
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [loading, categories]);

  /**
   * Handles individual skill deletion with confirmation.
   */
  const handleDelete = useCallback(
    async (skillId, skillName) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You are about to delete "${skillName}". This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Yes, delete it",
        background: "rgba(255, 255, 255, 0.95)",
        backdrop: `rgba(15, 23, 42, 0.4)`,
      });

      if (!result.isConfirmed) return;

      try {
        await deleteSkill(skillId);
        Swal.fire({
          title: "Deleted!",
          text: "Skill has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchSkills(categoryPagination.currentPage);
      } catch {
        Swal.fire("Error", "Failed to delete skill", "error");
      }
    },
    [fetchSkills, categoryPagination.currentPage]
  );

  /**
   * Logic for client-side pagination of skills within a category.
   */
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

      <main className="admin-content admin-skill" ref={containerRef}>
        <div className="admin-skill-header">
          <div>
            <h1>Technical Skills</h1>
            <p>Manage and organize your technical expertise</p>
          </div>
          <button
            className="add-skill-btn"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={18} /> Add New Skill
          </button>
        </div>

        {/* Global Add Skill Modal */}
        <AddSkillModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSkillAdded={() => fetchSkills(categoryPagination.currentPage)}
        />

        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <SkeletonSkillCard key={i} />
          ))
        ) : (
          categories.map((category) => {
            const {
              skills,
              paginated,
              currentPage,
              totalPages,
              from,
              to,
            } = getPaginatedSkills(category);

            return (
              <div key={category.id} className="skill-card">
                <h3 className="skill-category">
                  {/* Dynamic Icons based on category name */}
                  {category.name === "Frontend" && <Sparkles size={20} className="text-blue-500" />}
                  {category.name === "Backend" && <Cpu size={20} className="text-blue-500" />}
                  {category.name === "Other" && <Layers size={20} className="text-blue-500" />}
                  {!["Frontend", "Backend", "Other"].includes(category.name) && <Code2 size={20} className="text-blue-500" />}
                  {category.name}
                </h3>

                <div className="table-responsive">
                  <table className="skill-table">
                    <thead>
                      <tr>
                        <th style={{ width: "30%" }}>Skill Name</th>
                        <th style={{ width: "55%" }}>Proficiency</th>
                        <th style={{ width: "15%", textAlign: "right" }}>Actions</th>
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
                              title="Edit Skill"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="icon-btn delete"
                              onClick={() =>
                                handleDelete(skill.id, skill.name)
                              }
                              title="Delete Skill"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Local pagination for skills within this card */}
                {totalPages > 1 && (
                  <div className="table-footer-skills">
                    <div className="table-summary-skills">
                      Showing {from} - {to} of {skills.length}
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
              </div>
            );
          })
        )}

        {/* Global category-level pagination */}
        {categoryPagination.lastPage > 1 && (
          <div className="table-footer-skills mt-8">
            <div className="table-summary-skills">
              Showing{" "}
              {(categoryPagination.currentPage - 1) * categoryPagination.perPage + 1}
              {" - "}
              {Math.min(
                categoryPagination.currentPage * categoryPagination.perPage,
                categoryPagination.total
              )}{" "}
              of {categoryPagination.total} Categories
            </div>

            <Pagination
              currentPage={categoryPagination.currentPage}
              totalPages={categoryPagination.lastPage}
              onPageChange={(page) => fetchSkills(page)}
            />
          </div>
        )}

        {/* Modal for editing existing skills */}
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
