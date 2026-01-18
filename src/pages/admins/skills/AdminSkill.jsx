import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { viewAllSkills, deleteSkill } from "../../../services/skillService";
import "../../../css/admin/skills/AdminSkill.css";
import AddSkillModal from "./AddSkillModal";
import EditSkillModal from "./EditSkillModal";
import Swal from "sweetalert2";

const AdminSkill = () => {
    const [active, setActive] = useState("Skills");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSkillId, setSelectedSkillId] = useState(null);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            setLoading(true);
            const response = await viewAllSkills();

            // Only keep categories that have skills
            const filteredCategories = response.data.data.filter(
                (category) => category.skills && category.skills.length > 0
            );

            setCategories(filteredCategories);
        } catch (error) {
            console.error("Failed to fetch skills:", error);
            Swal.fire("Error", "Failed to load skills", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (skillId, skillName) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete "${skillName}". This action cannot be undone!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        try {
            await deleteSkill(skillId);
            Swal.fire("Deleted!", `"${skillName}" has been deleted.`, "success");
            fetchSkills();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", err.message || "Failed to delete skill.", "error");
        }
    };

    return (
        <div className="admin-layout">
            <AdminSidebar active={active} setActive={setActive} />

            <main className="admin-content admin-skill">
                {/* Header */}
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

                {/* Add Skill Modal */}
                <AddSkillModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSkillAdded={() => {
                        fetchSkills();
                        setIsAddModalOpen(false);
                    }}
                />

                {/* Content */}
                {loading ? (
                    <div className="empty-state">Loading skills...</div>
                ) : categories.length === 0 ? (
                    <div className="empty-state">No skills found</div>
                ) : (
                    categories.map((category) => (
                        <div className="skill-card" key={category.id}>
                            <h3 className="skill-category">
                                {category.name}
                            </h3>

                            <table className="skill-table">
                                <thead>
                                    <tr>
                                        <th>SKILL NAME</th>
                                        <th>LEVEL</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {category.skills.map((skill) => (
                                        <tr key={skill.id}>
                                            <td>{skill.name}</td>

                                            <td>
                                                <div className="skill-level-wrapper">
                                                    <div className="skill-bar">
                                                        <div
                                                            className="skill-bar-fill"
                                                            style={{
                                                                width: `${skill.level}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="skill-percent">
                                                        {skill.level}%
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="skill-actions">
                                                <button
                                                    className="icon-btn edit"
                                                    onClick={() => {
                                                        setSelectedSkillId(
                                                            skill.id
                                                        );
                                                        setIsEditModalOpen(true);
                                                    }}
                                                >
                                                    <FiEdit2 />
                                                </button>

                                                <button
                                                    className="icon-btn delete"
                                                    onClick={() =>
                                                        handleDelete(
                                                            skill.id,
                                                            skill.name
                                                        )
                                                    }
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                )}

                {/* Edit Skill Modal */}
                {isEditModalOpen && selectedSkillId && (
                    <EditSkillModal
                        isOpen={isEditModalOpen}
                        skillId={selectedSkillId}
                        onClose={() => setIsEditModalOpen(false)}
                        onSkillUpdated={() => {
                            fetchSkills();
                            setIsEditModalOpen(false);
                        }}
                    />
                )}
            </main>
        </div>
    );
};

export default AdminSkill;
