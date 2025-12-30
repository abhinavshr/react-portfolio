import React, { useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import "../../../css/admin/skills/AdminSkill.css";

const AdminSkill = () => {
  const [active, setActive] = useState("Skills");

  const skills = {
    Frontend: [
      { id: 1, name: "React", level: 95 },
    ],
    Backend: [
      { id: 2, name: "Node.js", level: 85 },
    ],
    Language: [
      { id: 3, name: "TypeScript", level: 90 },
      { id: 4, name: "Python", level: 80 },
    ],
    Database: [
      { id: 5, name: "MySQL", level: 75 },
    ],
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

          <button className="add-skill-btn">
            <FiPlus /> Add Skill
          </button>
        </div>

        {/* Skill Sections */}
        {Object.entries(skills).map(([category, items]) => (
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
                {items.map((skill) => (
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
                        <span className="skill-percent">
                          {skill.level}%
                        </span>
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
      </main>
    </div>
  );
};

export default AdminSkill;
