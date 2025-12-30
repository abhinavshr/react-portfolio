import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { viewAllSkills } from "../../../services/skillService";
import "../../../css/admin/skills/AdminSkill.css";
import AddSkillModal from "./AddSkillModal";


const AdminSkill = () => {
    const [active, setActive] = useState("Skills");
    const [skillsByCategory, setSkillsByCategory] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

                {/* Loading State */}
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
                                                    <button className="icon-btn edit">
                                                        <FiEdit2 />
                                                    </button>
                                                    <button className="icon-btn delete">
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
            </main>
        </div>
    );
};

export default AdminSkill;
