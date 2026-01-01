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
    const [skillsByCategory, setSkillsByCategory] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSkillId, setSelectedSkillId] = useState(null);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const response = await viewAllSkills();
            const skillData = response.data;
            const groupedSkills = {};

            skillData.forEach(skill => {
                const categoryName = skill.category?.name || "Uncategorized";

                if (!groupedSkills[categoryName]) {
                    groupedSkills[categoryName] = [];
                }
                groupedSkills[categoryName].push(skill);
            });

            setSkillsByCategory(groupedSkills);

        } catch (error) {
            console.error("Failed to fetch skills:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (skillId, skillName) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete "${skillName}". This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                await deleteSkill(skillId);
                Swal.fire('Deleted!', `"${skillName}" has been deleted.`, 'success');
                fetchSkills(); 
            } catch (err) {
                console.error(err);
                Swal.fire('Error', err.message || 'Failed to delete skill.', 'error');
            }
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

                    <button className="add-skill-btn" onClick={() => setIsModalOpen(true)}>
                        <FiPlus /> Add Skill
                    </button>
                    <AddSkillModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSkillAdded={() => {
                            fetchSkills();
                            setIsModalOpen(false);
                        }}
                    />
                </div>

                {loading ? (
                    <div className="empty-state">Loading skills...</div>
                ) : (
                    <>
                        {Object.entries(skillsByCategory).map(([category, skills]) => (
                            <div className="skill-card" key={category}>
                                <h3 className="skill-category">{category}</h3>

                                <table className="skill-table">
                                    <thead>
                                        <tr>
                                            <th>SKILL NAME</th>
                                            <th>LEVEL</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {skills.map((skill) => (
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
                                                        <span className="skill-percent">{skill.level}%</span>
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
                                                        onClick={() => handleDelete(skill.id, skill.name)}
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </>
                )}

                {isEditModalOpen && selectedSkillId && (
                    <EditSkillModal
                        isOpen={isEditModalOpen}
                        skillId={selectedSkillId}
                        onClose={() => setIsEditModalOpen(false)}
                        onSkillUpdated={() => fetchSkills()}
                    />
                )}
            </main>
        </div>
    );
};

export default AdminSkill;
