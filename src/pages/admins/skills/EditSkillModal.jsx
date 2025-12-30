import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import Select from "react-select";
import { fetchCategories } from "../../../services/projectService";
import { viewSkillById, updateSkill } from "../../../services/skillService";
import "../../../css/admin/skills/AddSkillModal.css";

const EditSkillModal = ({ isOpen, onClose, skillId, onSkillUpdated }) => {
    const [name, setName] = useState("");
    const [level, setLevel] = useState(0);
    const [category, setCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingSkill, setLoadingSkill] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const loadCategories = async () => {
            try {
                setLoadingCategories(true);
                const res = await fetchCategories();
                const data = res?.data ?? res ?? [];
                setCategories(data.map((cat) => ({ value: cat.id ?? cat, label: cat.name ?? cat })));
            } catch (error) {
                console.error("Failed to fetch categories", error);
            } finally {
                setLoadingCategories(false);
            }
        };

        const loadSkill = async () => {
            try {
                setLoadingSkill(true);
                const skill = await viewSkillById(skillId);
                setName(skill.name);
                setLevel(skill.level);
                if (skill.category) {
                    setCategory({ value: skill.category.id, label: skill.category.name });
                }
            } catch (error) {
                console.error("Failed to fetch skill:", error);
            } finally {
                setLoadingSkill(false);
            }
        };

        loadCategories();
        if (skillId) loadSkill();
    }, [isOpen, skillId]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!category) return;

        try {
            await updateSkill(skillId, {
                name,
                level: Number(level),
                category_id: category.value,
            });

            if (onSkillUpdated) onSkillUpdated(); // refresh parent list
            onClose(); // close modal

            // reset form
            setName("");
            setLevel(50);
            setCategory(null);

            alert("Skill updated successfully!");
        } catch (err) {
            console.error(err);
            alert(err.message || "Failed to update skill");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <div className="modal-header">
                    <h2>Edit Skill</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FiX size={20} />
                    </button>
                </div>

                <p className="modal-subtitle">Edit the details of your skill</p>

                {loadingSkill ? (
                    <div>Loading skill...</div>
                ) : (
                    <form className="modal-form" onSubmit={handleSubmit}>
                        <label>
                            Skill Name *
                            <input
                                type="text"
                                placeholder="e.g., React"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </label>

                        <label>
                            Level (0–100%) *
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                onBlur={() => {
                                    const clean = Math.max(0, Math.min(100, Number(level)));
                                    setLevel(isNaN(clean) ? 0 : clean);
                                }}
                                required
                            />
                        </label>

                        <div className="level-slider-wrapper">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={level}
                                onChange={(e) => setLevel(Number(e.target.value))}
                                className="level-slider"
                                style={{ "--percent": `${level}%` }}
                            />
                            <span className="level-percent">{level}%</span>
                        </div>

                        <label>
                            Category *
                            <Select
                                value={category}
                                onChange={setCategory}
                                options={categories}
                                isLoading={loadingCategories}
                                placeholder={loadingCategories ? "Loading categories..." : "Select category"}
                                isClearable
                            />
                        </label>

                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-add">
                                Update
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EditSkillModal;
