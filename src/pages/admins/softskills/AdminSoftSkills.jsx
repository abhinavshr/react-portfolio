import React from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import "../../../css/admin/softskills/AdminSoftSkills.css";

const AdminSoftSkills = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar active="Skills" />

      <main className="admin-content admin-soft-skill">
        {/* Header */}
        <div className="soft-skill-header">
          <div>
            <h1>Soft Skills</h1>
            <p>Manage your interpersonal and professional skills</p>
          </div>

          <button className="add-soft-skill-btn">
            <FiPlus /> Add Soft Skill
          </button>
        </div>

        {/* Skill Cards */}
        <div className="soft-skill-grid">
          {softSkills.map((skill) => (
            <div className="soft-skill-card" key={skill.id}>
              
              <div className="soft-skill-card-header">
                <h3>{skill.name}</h3>

                <div className="soft-skill-actions">
                  <FiEdit2 />
                  <FiTrash2 />
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
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminSoftSkills;

/* Static Data */
const softSkills = [
  {
    id: 1,
    name: "Leadership",
    level: 90,
    description:
      "Experience leading cross-functional teams and mentoring junior developers",
  },
  {
    id: 2,
    name: "Communication",
    level: 95,
    description:
      "Strong written and verbal communication skills, presenting to stakeholders",
  },
  {
    id: 3,
    name: "Problem Solving",
    level: 88,
    description:
      "Analytical thinking and creative solutions to complex technical challenges",
  },
  {
    id: 4,
    name: "Teamwork",
    level: 92,
    description:
      "Collaborative approach to working with diverse teams across time zones",
  },
  {
    id: 5,
    name: "Time Management",
    level: 85,
    description:
      "Efficient prioritization and meeting deadlines in fast-paced environments",
  },
  {
    id: 6,
    name: "Adaptability",
    level: 93,
    description:
      "Quick learner, comfortable with changing requirements and new technologies",
  },
];
